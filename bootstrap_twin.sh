#!/usr/bin/env bash

set -e

PROJECT_NAME="beat-twin"

cd $PROJECT_NAME

echo "Creating JSON contracts..."

cat <<EOF > contracts/audio_frame.schema.json
{
  "\$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AudioFrame",
  "type": "object",
  "properties": {
    "type": { "const": "audio_frame" },
    "timestamp": { "type": "number" },
    "sample_rate": { "type": "integer" },
    "buffer": {
      "type": "array",
      "items": { "type": "number" }
    }
  },
  "required": ["type", "timestamp", "sample_rate", "buffer"]
}
EOF

cat <<EOF > contracts/features.schema.json
{
  "\$schema": "http://json-schema.org/draft-07/schema#",
  "title": "FeatureEvent",
  "type": "object",
  "properties": {
    "type": { "const": "feature_event" },
    "timestamp": { "type": "number" },
    "tempo": { "type": "number" },
    "energy": { "type": "number" },
    "transient_density": { "type": "number" }
  },
  "required": ["type", "timestamp"]
}
EOF

echo "Creating shared config..."

cat <<EOF > shared/config.py
SAMPLE_RATE = 44100
BUFFER_SIZE = 1024
WS_HOST = "localhost"
WS_PORT = 8765
EOF

echo "Creating event bus (WebSocket server)..."

cat <<EOF > services/event_bus/server.py
import asyncio
import websockets

clients = set()

async def handler(websocket):
    clients.add(websocket)
    try:
        async for message in websocket:
            for client in clients:
                if client != websocket:
                    await client.send(message)
    finally:
        clients.remove(websocket)

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        print("Event bus running on ws://localhost:8765")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
EOF

echo "Creating audio tap service..."

cat <<EOF > services/audio_tap/audio_tap.py
import sounddevice as sd
import numpy as np
import asyncio
import websockets
import time
from shared.config import SAMPLE_RATE, BUFFER_SIZE, WS_HOST, WS_PORT

async def stream_audio():
    uri = f"ws://{WS_HOST}:{WS_PORT}"
    async with websockets.connect(uri) as websocket:
        def callback(indata, frames, time_info, status):
            if status:
                print(status)
            frame = {
                "type": "audio_frame",
                "timestamp": time.time(),
                "sample_rate": SAMPLE_RATE,
                "buffer": indata[:, 0].tolist()
            }
            asyncio.run_coroutine_threadsafe(
                websocket.send(str(frame)), asyncio.get_event_loop()
            )

        with sd.InputStream(
            samplerate=SAMPLE_RATE,
            channels=1,
            blocksize=BUFFER_SIZE,
            callback=callback
        ):
            print("Audio tap running...")
            await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(stream_audio())
EOF

echo "Creating feature core..."

cat <<EOF > services/feature_core/feature_core.py
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

                    onset_env = librosa.onset.onset_strength(y=y, sr=SAMPLE_RATE)
                    tempo = librosa.beat.tempo(onset_envelope=onset_env, sr=SAMPLE_RATE)

                    feature_event = {
                        "type": "feature_event",
                        "timestamp": time.time(),
                        "tempo": float(tempo[0]),
                        "energy": energy
                    }

                    await websocket.send(json.dumps(feature_event))

if __name__ == "__main__":
    asyncio.run(run())

EOF

echo "Creating dev runner..."

cat <<EOF > scripts/run_dev.sh
#!/usr/bin/env bash
source venv/bin/activate

echo "Starting event bus..."
python services/event_bus/server.py &
sleep 1

echo "Starting feature core..."
python services/feature_core/feature_core.py &
sleep 1

echo "Starting audio tap..."
python services/audio_tap/audio_tap.py
EOF

chmod +x scripts/run_dev.sh

echo "Creating README..."

cat <<EOF > README.md
# Beatmaker Twin - Audio Core MVP

## Run

source venv/bin/activate
bash scripts/run_dev.sh

Ensure PipeWire loopback is configured and Bitwig master is routed to input.
EOF

echo "Bootstrap complete."
echo "Next step: configure PipeWire loopback to capture Bitwig output."
