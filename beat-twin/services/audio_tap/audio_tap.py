import sounddevice as sd
import numpy as np
import asyncio
import websockets
import json
import time
from shared.config import SAMPLE_RATE, BUFFER_SIZE, WS_HOST, WS_PORT

async def stream_audio():
    uri = f"ws://{WS_HOST}:{WS_PORT}"
    async with websockets.connect(uri) as websocket:
        loop = asyncio.get_running_loop()

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
                websocket.send(json.dumps(frame)), loop
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
