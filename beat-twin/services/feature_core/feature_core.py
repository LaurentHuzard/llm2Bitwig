import asyncio
import websockets
import json
import numpy as np
import librosa
import time
from shared.config import SAMPLE_RATE, WS_HOST, WS_PORT

BUFFER_SECONDS = 2
buffer_accumulator = []

async def run():
    uri = f"ws://{WS_HOST}:{WS_PORT}"
    async with websockets.connect(uri) as websocket:
        async for message in websocket:
            event = json.loads(message)

            if event["type"] == "audio_frame":
                samples = np.array(event["buffer"], dtype=np.float32)
                buffer_accumulator.extend(samples)

                if len(buffer_accumulator) >= SAMPLE_RATE * BUFFER_SECONDS:
                    y = np.array(buffer_accumulator[:SAMPLE_RATE * BUFFER_SECONDS])
                    buffer_accumulator.clear()

                    energy = float(np.sqrt(np.mean(y**2)))

                    # Feature Extraction
                    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=SAMPLE_RATE)[0]
                    spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=SAMPLE_RATE)[0]
                    zero_crossing_rate = librosa.feature.zero_crossing_rate(y)[0]
                    
                    # Tagging Logic
                    tags = []
                    
                    # Brightness / Darkness
                    avg_centroid = np.mean(spectral_centroid)
                    if avg_centroid < 1500:
                        tags.append("dark")
                    elif avg_centroid > 3000:
                        tags.append("bright")
                        
                    # Rhythmic / Ambient
                    onset_env = librosa.onset.onset_strength(y=y, sr=SAMPLE_RATE)
                    tempo, _ = librosa.beat.beat_track(onset_envelope=onset_env, sr=SAMPLE_RATE)
                    pulse = librosa.beat.plp(onset_envelope=onset_env, sr=SAMPLE_RATE)
                    rhythmic_strength = np.mean(pulse)

                    if rhythmic_strength > 0.3:
                         tags.append("rhythmic")
                    else:
                         tags.append("ambient")

                    # Texture
                    avg_zcr = np.mean(zero_crossing_rate)
                    if avg_zcr > 0.1:
                        tags.append("noisy") # or "fx"
                    
                    feature_event = {
                        "type": "feature_event",
                        "timestamp": time.time(),
                        "tempo": float(tempo),
                        "energy": energy,
                        "tags": tags,
                        "analysis": {
                            "centroid": float(avg_centroid),
                            "zcr": float(avg_zcr),
                            "rhythmic_strength": float(rhythmic_strength)
                        }
                    }

                    await websocket.send(json.dumps(feature_event))

if __name__ == "__main__":
    asyncio.run(run())

