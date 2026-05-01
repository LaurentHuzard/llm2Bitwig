import sys
import unittest
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
EAR_SERVICE = ROOT / "ear-service"
sys.path.insert(0, str(EAR_SERVICE))

from analysis_core import analyze_recording  # noqa: E402

SAMPLE_RATE = 44100


def decaying_sine(freq: float, seconds: float, decay: float, gain: float = 0.8) -> np.ndarray:
    t = np.linspace(0, seconds, int(SAMPLE_RATE * seconds), endpoint=False)
    env = np.exp(-decay * t)
    return (gain * np.sin(2 * np.pi * freq * t) * env).astype(np.float32).reshape(-1, 1)


def noisy_burst(seconds: float, decay: float, gain: float = 0.55, seed: int = 7) -> np.ndarray:
    rng = np.random.default_rng(seed)
    samples = int(SAMPLE_RATE * seconds)
    t = np.linspace(0, seconds, samples, endpoint=False)
    noise = rng.normal(0, gain, samples).astype(np.float32)
    return (noise * np.exp(-decay * t).astype(np.float32)).reshape(-1, 1)


def impulse_train(seconds: float, interval: float, gain: float = 0.7) -> np.ndarray:
    samples = np.zeros(int(SAMPLE_RATE * seconds), dtype=np.float32)
    for pos in np.arange(0.0, seconds, interval):
        idx = int(pos * SAMPLE_RATE)
        if idx < len(samples):
            samples[idx:idx + 120] = gain
    return samples.reshape(-1, 1)


class SemanticAnalysisTests(unittest.TestCase):
    def assert_semantic_contract(self, result: dict) -> None:
        self.assertEqual(result["schema_version"], "semantic-audio-analysis.v1")
        self.assertIn("audio_evidence", result)
        self.assertIn("instrument_detection", result)
        self.assertIn("semantic_read", result)
        self.assertIn("provenance", result)
        self.assertIn("mood", result["semantic_read"])
        self.assertIn("vibe", result["semantic_read"])
        self.assertIn("genericness", result["semantic_read"])

    def test_silence_reports_silence_with_caveat(self) -> None:
        result = analyze_recording(np.zeros((SAMPLE_RATE, 1), dtype=np.float32), SAMPLE_RATE, "fixture_silence")

        self.assert_semantic_contract(result)
        self.assertEqual(result["instrument_detection"]["primary"], "silence")
        self.assertTrue(result["semantic_read"]["interpretation"]["caveats"])

    def test_kick_like_transient_prefers_kick_candidate(self) -> None:
        result = analyze_recording(decaying_sine(55, 1.2, 8.5), SAMPLE_RATE, "fixture_kick")

        self.assert_semantic_contract(result)
        candidates = result["instrument_detection"]["candidates"]
        self.assertGreater(candidates[0]["score"], 0)
        self.assertIn(result["instrument_detection"]["primary"], {"kick", "tom", "bass", "unknown_percussion"})
        self.assertGreater(result["audio_evidence"]["spectral"]["bands"]["sub"] + result["audio_evidence"]["spectral"]["bands"]["bass"], 0.2)

    def test_noisy_snare_like_burst_has_nonzero_weirdness(self) -> None:
        result = analyze_recording(noisy_burst(1.0, 14), SAMPLE_RATE, "fixture_snareish")

        self.assert_semantic_contract(result)
        self.assertGreater(result["semantic_read"]["weirdness"]["score"], 0.1)
        self.assertGreater(result["audio_evidence"]["spectral"]["zero_crossing_rate"], 0.01)

    def test_hat_like_impulses_are_bright_or_percussive(self) -> None:
        result = analyze_recording(impulse_train(1.0, 0.125), SAMPLE_RATE, "fixture_hat")

        self.assert_semantic_contract(result)
        self.assertGreaterEqual(result["audio_evidence"]["rhythm"]["onset_count"], 1)
        self.assertTrue(result["semantic_read"]["mood"])


if __name__ == "__main__":
    unittest.main()
