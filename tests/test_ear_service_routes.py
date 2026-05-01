import asyncio
import io
import sys
import unittest
import wave
from pathlib import Path

import numpy as np
from fastapi.responses import JSONResponse

ROOT = Path(__file__).resolve().parents[1]
EAR_SERVICE = ROOT / "ear-service"
sys.path.insert(0, str(EAR_SERVICE))

from file_analysis import analyze_uploaded_file  # noqa: E402

SAMPLE_RATE = 44100


class FakeUpload:
    def __init__(self, payload: bytes, filename: str) -> None:
        self._payload = payload
        self.filename = filename

    async def read(self) -> bytes:
        return self._payload


def wav_bytes(samples: np.ndarray) -> bytes:
    data = np.clip(samples, -1.0, 1.0)
    data_i16 = (data * 32767).astype(np.int16)
    out = io.BytesIO()
    with wave.open(out, "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(SAMPLE_RATE)
        handle.writeframes(data_i16.tobytes())
    return out.getvalue()


class EarServiceRouteTests(unittest.TestCase):
    def test_analyze_file_rejects_empty_upload(self) -> None:
        upload = FakeUpload(b"", "empty.wav")

        response = asyncio.run(analyze_uploaded_file(upload))

        self.assertIsInstance(response, JSONResponse)
        self.assertEqual(response.status_code, 400)

    def test_analyze_file_accepts_valid_wav_upload(self) -> None:
        t = np.linspace(0, 0.75, int(SAMPLE_RATE * 0.75), endpoint=False)
        signal = (0.55 * np.sin(2 * np.pi * 80 * t) * np.exp(-7 * t)).astype(np.float32)
        upload = FakeUpload(wav_bytes(signal), "kickish.wav")

        fake_result = {
            "schema_version": "semantic-audio-analysis.v1",
            "semantic_read": {},
        }
        result = asyncio.run(
            analyze_uploaded_file(
                upload,
                SAMPLE_RATE,
                analyze_recording_fn=lambda recording, sample_rate, source: fake_result,
                load_audio_fn=lambda path, sr, mono: (signal, SAMPLE_RATE),
            )
        )

        self.assertIsInstance(result, dict)
        self.assertEqual(result["schema_version"], "semantic-audio-analysis.v1")
        self.assertEqual(result["filename"], "kickish.wav")
        self.assertIn("semantic_read", result)

    def test_analyze_file_returns_error_for_unreadable_payload(self) -> None:
        upload = FakeUpload(b"not audio", "broken.txt")

        def fail_load(path, sr, mono):
            raise ValueError("unsupported format")

        response = asyncio.run(
            analyze_uploaded_file(
                upload,
                SAMPLE_RATE,
                load_audio_fn=fail_load,
            )
        )

        self.assertIsInstance(response, JSONResponse)
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
