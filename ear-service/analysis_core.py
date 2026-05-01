import numpy as np
import librosa

SCHEMA_VERSION = "semantic-audio-analysis.v1"
ANALYSER_VERSION = "0.1.0"

FREQUENCY_BANDS = {
    "sub": (20, 60),
    "bass": (60, 250),
    "low_mid": (250, 500),
    "mid": (500, 2000),
    "high_mid": (2000, 4000),
    "high": (4000, 20000),
}


def clamp01(value: float) -> float:
    return float(max(0.0, min(1.0, value)))


def rounded(value: float, digits: int = 3) -> float:
    return float(round(float(value), digits))


def to_mono(recording: np.ndarray) -> np.ndarray:
    if recording.ndim > 1 and recording.shape[1] >= 2:
        return np.mean(recording, axis=1)
    return recording.flatten()


def calculate_frequency_energy(mono: np.ndarray, sample_rate: int) -> tuple[dict[str, float], float]:
    window = np.hanning(len(mono))
    mono_windowed = mono * window
    fft_spectrum = np.fft.rfft(mono_windowed)
    freqs = np.fft.rfftfreq(len(mono_windowed), 1 / sample_rate)
    magnitude = np.abs(fft_spectrum)
    total_energy = np.sum(magnitude) + 1e-9

    energy = {}
    for name, (low, high) in FREQUENCY_BANDS.items():
        idx = np.where((freqs >= low) & (freqs < high))[0]
        energy[name] = float(np.sum(magnitude[idx]) / total_energy) if len(idx) > 0 else 0.0

    centroid = np.sum(freqs * magnitude) / total_energy
    return energy, float(centroid)


def estimate_tempo(mono: np.ndarray, sample_rate: int) -> float:
    try:
        if len(mono) <= sample_rate * 2:
            return 0.0
        onset_env = librosa.onset.onset_strength(y=mono, sr=sample_rate)
        tempo_arr, _ = librosa.beat.beat_track(onset_envelope=onset_env, sr=sample_rate)
        return float(tempo_arr[0]) if np.ndim(tempo_arr) > 0 else float(tempo_arr)
    except Exception as e:
        print(f"Tempo detection error: {e}")
        return 0.0


def estimate_key_with_confidence(mono: np.ndarray, sample_rate: int) -> tuple[str, float]:
    try:
        chroma = librosa.feature.chroma_cqt(y=mono, sr=sample_rate)
        chroma_vals = np.sum(chroma, axis=1)
        pitch_classes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        major_profile = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
        minor_profile = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])

        chroma_vals = chroma_vals / (np.max(chroma_vals) + 1e-9)
        major_profile = major_profile / np.max(major_profile)
        minor_profile = minor_profile / np.max(minor_profile)

        if np.std(chroma_vals) < 1e-9:
            return "Unknown", 0.0

        best_corr = -1.0
        second_corr = -1.0
        key = "Unknown"
        for i in range(12):
            p_major = np.roll(major_profile, i)
            corr = np.corrcoef(chroma_vals, p_major)[0, 1]
            if corr > best_corr:
                second_corr = best_corr
                best_corr = corr
                key = f"{pitch_classes[i]} Major"
            elif corr > second_corr:
                second_corr = corr

            p_minor = np.roll(minor_profile, i)
            corr = np.corrcoef(chroma_vals, p_minor)[0, 1]
            if corr > best_corr:
                second_corr = best_corr
                best_corr = corr
                key = f"{pitch_classes[i]} Minor"
            elif corr > second_corr:
                second_corr = corr

        confidence = clamp01((best_corr + 1.0) / 2.0)
        if second_corr > -1.0:
            confidence = clamp01(confidence * 0.75 + max(0.0, best_corr - second_corr) * 0.5)
        return key, rounded(confidence)
    except Exception as e:
        print(f"Key detection error: {e}")
        return "Unknown", 0.0


def describe_transients(mono: np.ndarray, sample_rate: int) -> dict[str, float | int]:
    try:
        onset_env = librosa.onset.onset_strength(y=mono, sr=sample_rate)
        onset_frames = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sample_rate, backtrack=False)
        duration = max(len(mono) / sample_rate, 1e-9)
        onset_count = int(len(onset_frames))
        density = onset_count / duration
        strength = float(np.mean(onset_env)) if len(onset_env) else 0.0
        strength_peak = float(np.max(onset_env)) if len(onset_env) else 0.0
        return {
            "count": onset_count,
            "density_per_second": float(density),
            "mean_strength": strength,
            "peak_strength": strength_peak,
        }
    except Exception as e:
        print(f"Transient analysis error: {e}")
        return {"count": 0, "density_per_second": 0.0, "mean_strength": 0.0, "peak_strength": 0.0}


def classify_instruments(mono: np.ndarray, sample_rate: int, energy: dict[str, float], centroid: float) -> dict:
    rms = float(np.sqrt(np.mean(mono**2)))
    peak = float(np.max(np.abs(mono)))
    duration = float(len(mono) / sample_rate)
    transients = describe_transients(mono, sample_rate)

    high_total = energy["high_mid"] + energy["high"]
    low_total = energy["sub"] + energy["bass"]
    mid_total = energy["low_mid"] + energy["mid"]
    brightness = min(1.0, centroid / 8000.0)
    transient_score = min(1.0, float(transients["peak_strength"]) / 8.0)
    punch = min(1.0, peak / (rms + 1e-6) / 8.0)

    scores = {
        "kick": (low_total * 1.45 + energy["sub"] * 0.9 + transient_score * 0.25 + punch * 0.15) * (1.1 if centroid < 1600 else 0.75),
        "snare": (mid_total * 0.95 + energy["high_mid"] * 0.65 + transient_score * 0.35 + punch * 0.15) * (1.05 if 900 <= centroid <= 5200 else 0.75),
        "closed_hat": (high_total * 1.5 + brightness * 0.4 + transient_score * 0.25) * (1.1 if duration < 1.0 else 0.85),
        "clap": (energy["mid"] * 0.75 + energy["high_mid"] * 0.95 + transient_score * 0.25) * (1.05 if 1800 <= centroid <= 6500 else 0.8),
        "tom": (energy["bass"] * 0.95 + energy["low_mid"] * 0.85 + transient_score * 0.25) * (1.05 if 180 <= centroid <= 1800 else 0.8),
        "cymbal": (energy["high"] * 1.65 + energy["high_mid"] * 0.45 + brightness * 0.6) * (1.1 if duration >= 0.8 else 0.85),
        "bass": (energy["bass"] * 1.1 + energy["sub"] * 0.75) * (0.85 if transient_score > 0.65 else 1.1),
    }

    sorted_scores = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    top_label, top_score = sorted_scores[0]
    second_score = sorted_scores[1][1] if len(sorted_scores) > 1 else 0.0
    confidence = max(0.0, min(0.98, (top_score - second_score * 0.55) + min(0.18, peak)))
    confidence = float(round(confidence, 3))

    if peak < 0.005 or rms < 0.001:
        top_label = "silence"
        confidence = 0.95
    elif confidence < 0.18:
        top_label = "unknown_percussion"

    candidates = [
        {"label": label, "score": float(round(score, 3))}
        for label, score in sorted_scores
    ]

    return {
        "primary": top_label,
        "confidence": confidence,
        "candidates": candidates,
        "transients": transients,
        "notes": build_classifier_notes(top_label, energy, centroid, transients),
    }


def build_classifier_notes(label: str, energy: dict[str, float], centroid: float, transients: dict[str, float | int]) -> list[str]:
    notes = []
    if label == "kick":
        notes.append("Dominant sub/bass energy with a sharp transient.")
    elif label == "snare":
        notes.append("Mid and high-mid noise energy suggests a snare-like hit.")
    elif label == "closed_hat":
        notes.append("Short bright transient with high-frequency energy.")
    elif label == "clap":
        notes.append("Wide mid/high-mid transient profile, close to clap territory.")
    elif label == "tom":
        notes.append("Low-mid resonant body with percussive attack.")
    elif label == "cymbal":
        notes.append("Sustained bright high-frequency energy.")
    elif label == "bass":
        notes.append("Low-frequency energy is present without a strong drum transient.")
    elif label == "silence":
        notes.append("Signal level is too low for musical classification.")
    else:
        notes.append("No single drum family is dominant enough yet.")

    notes.append(f"Centroid {centroid:.0f} Hz; onset density {float(transients['density_per_second']):.2f}/s.")
    notes.append(f"Band balance: sub {energy['sub']:.2f}, bass {energy['bass']:.2f}, mid {energy['mid']:.2f}, high {energy['high']:.2f}.")
    return notes


def extract_audio_evidence(
    mono: np.ndarray,
    sample_rate: int,
    energy: dict[str, float],
    centroid: float,
    rms: float,
    peak: float,
    tempo: float,
    key: str,
    key_confidence: float,
    transients: dict[str, float | int],
) -> dict:
    try:
        rolloff = float(np.mean(librosa.feature.spectral_rolloff(y=mono, sr=sample_rate)[0]))
        bandwidth = float(np.mean(librosa.feature.spectral_bandwidth(y=mono, sr=sample_rate)[0]))
        flatness = float(np.mean(librosa.feature.spectral_flatness(y=mono)[0]))
        zcr = float(np.mean(librosa.feature.zero_crossing_rate(y=mono)[0]))
        mfcc = librosa.feature.mfcc(y=mono, sr=sample_rate, n_mfcc=6)
        mfcc_mean = [rounded(value) for value in np.mean(mfcc, axis=1)]
    except Exception as e:
        print(f"Descriptor extraction error: {e}")
        rolloff = 0.0
        bandwidth = 0.0
        flatness = 0.0
        zcr = 0.0
        mfcc_mean = []

    abs_mono = np.abs(mono)
    silence_threshold = max(0.003, rms * 0.18)
    silence_ratio = float(np.mean(abs_mono < silence_threshold)) if len(abs_mono) else 1.0
    dynamic_range = float(np.percentile(abs_mono, 95) - np.percentile(abs_mono, 10)) if len(abs_mono) else 0.0
    onset_density = float(transients["density_per_second"])
    tempo_confidence = clamp01((len(mono) / sample_rate) / 6.0) * clamp01(onset_density / 4.0)
    if tempo <= 0:
        tempo_confidence = 0.0

    high_total = energy["high_mid"] + energy["high"]
    low_total = energy["sub"] + energy["bass"]
    spectral_balance = high_total - low_total

    return {
        "tempo": {"value": rounded(tempo, 2), "confidence": rounded(tempo_confidence)},
        "key": {"value": key, "confidence": rounded(key_confidence)},
        "loudness": {
            "rms": rounded(rms),
            "peak": rounded(peak),
            "dynamic_range": rounded(dynamic_range),
            "silence_ratio": rounded(silence_ratio),
        },
        "spectral": {
            "centroid": rounded(centroid, 2),
            "rolloff": rounded(rolloff, 2),
            "bandwidth": rounded(bandwidth, 2),
            "flatness": rounded(flatness),
            "zero_crossing_rate": rounded(zcr),
            "spectral_balance": rounded(spectral_balance),
            "bands": {name: rounded(value) for name, value in energy.items()},
            "mfcc_mean": mfcc_mean,
        },
        "rhythm": {
            "onset_count": int(transients["count"]),
            "onset_density_per_second": rounded(onset_density),
            "onset_mean_strength": rounded(float(transients["mean_strength"])),
            "onset_peak_strength": rounded(float(transients["peak_strength"])),
            "beat_stability": rounded(tempo_confidence),
        },
    }


def semantic_candidate(label: str, score: float, evidence: str) -> dict:
    return {"label": label, "score": rounded(clamp01(score)), "evidence": evidence}


def build_semantic_read(
    mono: np.ndarray,
    sample_rate: int,
    energy: dict[str, float],
    centroid: float,
    rms: float,
    peak: float,
    key: str,
    key_confidence: float,
    transients: dict[str, float | int],
    instrument_detection: dict,
) -> dict:
    duration = max(len(mono) / sample_rate, 1e-9)
    onset_density = float(transients["density_per_second"])
    onset_peak = float(transients["peak_strength"])
    low_total = energy["sub"] + energy["bass"]
    mid_total = energy["low_mid"] + energy["mid"]
    high_total = energy["high_mid"] + energy["high"]
    brightness = clamp01(centroid / 5000.0)
    darkness = clamp01((low_total * 1.5 + (1.0 - brightness)) / 2.0)
    zcr = float(np.mean(librosa.feature.zero_crossing_rate(y=mono)[0]))
    noisiness = clamp01(high_total * 1.25 + zcr * 2.0)
    density = clamp01(onset_density / 6.0)
    pulse_stability = clamp01((duration / 6.0) * (density + clamp01(onset_peak / 8.0)) / 2.0)
    harmonic_ambiguity = clamp01(1.0 - key_confidence)
    instrument_label = str(instrument_detection.get("primary", "unknown"))

    mood = [
        semantic_candidate("dark", darkness, "Low-frequency weight and restrained brightness."),
        semantic_candidate("tense", clamp01(noisiness * 0.45 + density * 0.35 + harmonic_ambiguity * 0.2), "Noisy texture, rhythmic density, or harmonic ambiguity."),
        semantic_candidate("energetic", clamp01(rms * 3.0 + density * 0.5), "Loudness and onset density suggest movement."),
        semantic_candidate("cold", clamp01(brightness * 0.45 + noisiness * 0.35 + (1.0 - low_total) * 0.2), "Bright/noisy spectrum with limited warmth."),
        semantic_candidate("spacious", clamp01((1.0 - density) * 0.45 + high_total * 0.25 + harmonic_ambiguity * 0.2), "Sparse rhythm and diffuse high-frequency energy."),
    ]
    mood = sorted(mood, key=lambda item: item["score"], reverse=True)

    vibe = [
        semantic_candidate("warehouse techno", clamp01(low_total * 0.45 + density * 0.35 + darkness * 0.25), "Low-end pressure and regular transient motion."),
        semantic_candidate("industrial texture", clamp01(noisiness * 0.6 + mid_total * 0.25 + darkness * 0.15), "Noisy high-mid or metallic energy."),
        semantic_candidate("ambient fragment", clamp01((1.0 - density) * 0.55 + harmonic_ambiguity * 0.2 + high_total * 0.15), "Sparse onsets and sustained or ambiguous tone."),
        semantic_candidate("drum tool", clamp01(float(instrument_detection.get("confidence", 0.0)) * 0.7 + density * 0.25), "Percussive classifier and transient density."),
        semantic_candidate("bass weight", clamp01(low_total * 0.8 + darkness * 0.2), "Sub and bass energy dominate the fingerprint."),
    ]
    vibe = sorted(vibe, key=lambda item: item["score"], reverse=True)

    weirdness_score = clamp01(
        harmonic_ambiguity * 0.25
        + noisiness * 0.25
        + abs(high_total - low_total) * 0.15
        + (1.0 - pulse_stability) * 0.15
        + (0.2 if instrument_label == "unknown_percussion" else 0.0)
    )
    genericness_score = clamp01(
        pulse_stability * 0.35
        + (1.0 - weirdness_score) * 0.25
        + float(instrument_detection.get("confidence", 0.0)) * 0.15
        + (0.15 if instrument_label in {"kick", "snare", "closed_hat", "bass"} else 0.0)
    )
    coherence_score = clamp01(pulse_stability * 0.45 + key_confidence * 0.25 + (1.0 - harmonic_ambiguity) * 0.15 + (1.0 - noisiness) * 0.15)
    non_silence_ratio = 1.0 - float(np.mean(np.abs(mono) < 0.003))
    potential_score = clamp01(max(weirdness_score, 1.0 - genericness_score) * 0.45 + max(item["score"] for item in vibe[:2]) * 0.35 + non_silence_ratio * 0.2)

    if weirdness_score > 0.62:
        weird_source = "unusual texture, unstable evidence, or harmonic ambiguity"
    elif noisiness > 0.45:
        weird_source = "noisy or metallic spectral energy"
    elif harmonic_ambiguity > 0.55:
        weird_source = "weak tonal center"
    else:
        weird_source = "mostly familiar audio shape"

    if genericness_score > 0.62:
        generic_source = "stable pulse and familiar instrument profile"
    elif genericness_score > 0.35:
        generic_source = "some familiar traits, with room for identity"
    else:
        generic_source = "distinctive or uncertain enough to avoid a generic read"

    top_mood = mood[0]["label"]
    top_vibe = vibe[0]["label"]
    caveats = []
    if duration < 1.0:
        caveats.append("Very short audio window; semantic tags are weak evidence.")
    if key_confidence < 0.35:
        caveats.append("Key confidence is low; harmonic mood labels are weak.")
    if peak < 0.005 or rms < 0.001:
        caveats.append("Signal level is close to silence.")

    return {
        "mood": mood,
        "vibe": vibe,
        "weirdness": {
            "score": rounded(weirdness_score),
            "source": weird_source,
        },
        "genericness": {
            "score": rounded(genericness_score),
            "source": generic_source,
            "label": "identity_risk",
        },
        "coherence": {
            "score": rounded(coherence_score),
            "source": "Pulse stability, tonal confidence, and texture agreement.",
        },
        "potential": {
            "score": rounded(potential_score),
            "source": "Distinctive traits plus usable vibe evidence.",
        },
        "interpretation": {
            "summary": f"{top_mood} {top_vibe} fragment with {generic_source}.",
            "reason_to_keep": "Keep it if the strongest texture or pulse supports the track identity.",
            "suggested_mutation": "If it feels too familiar, add one rhythmic gap, timbral scar, or automation movement.",
            "caveats": caveats,
        },
    }


def analyze_recording(recording: np.ndarray, sample_rate: int = 44100, source: str = "live_buffer") -> dict:
    mono = to_mono(recording).astype(np.float32)
    if len(mono) == 0:
        raise ValueError("No audio data")

    energy, centroid = calculate_frequency_energy(mono, sample_rate)
    rms = float(np.sqrt(np.mean(mono**2)))
    peak = float(np.max(np.abs(mono)))
    tempo = estimate_tempo(mono, sample_rate)
    key, key_confidence = estimate_key_with_confidence(mono, sample_rate)
    instrument_detection = classify_instruments(mono, sample_rate, energy, centroid)
    transients = instrument_detection["transients"]
    audio_evidence = extract_audio_evidence(
        mono,
        sample_rate,
        energy,
        centroid,
        rms,
        peak,
        tempo,
        key,
        key_confidence,
        transients,
    )
    semantic_read = build_semantic_read(
        mono,
        sample_rate,
        energy,
        centroid,
        rms,
        peak,
        key,
        key_confidence,
        transients,
        instrument_detection,
    )

    return {
        "schema_version": SCHEMA_VERSION,
        "analyser_version": ANALYSER_VERSION,
        "source": source,
        "features": energy,
        "centroid": float(centroid),
        "rms": rms,
        "peak": peak,
        "tempo": tempo,
        "key": key,
        "duration": float(len(mono) / sample_rate),
        "audio_evidence": audio_evidence,
        "instrument_detection": instrument_detection,
        "semantic_read": semantic_read,
        "provenance": {
            "models": [
                {"name": "librosa", "status": "used"},
                {"name": "semantic_heuristics", "version": ANALYSER_VERSION, "status": "used"},
                {"name": "clap", "status": "not_available"},
                {"name": "yamnet", "status": "not_available"},
                {"name": "llm_curator", "status": "not_available"},
            ]
        },
    }
