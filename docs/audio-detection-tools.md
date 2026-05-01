# Audio Detection Tools

## Goal

Beat Twin's ear service now exposes a first-pass instrument detector for short samples and live buffer windows. The target is pragmatic studio feedback: identify likely kick, snare, hat, clap, tom, cymbal, bass, silence, or unknown percussion from spectral balance and transient shape.

## Backend Surface

- `GET /analyze?seconds=3` keeps the existing BPM/key/spectral analysis and now returns `instrument_detection`.
- `POST /analyze-file` accepts an uploaded audio file and returns the same analysis contract for sample-library triage.
- Both endpoints now return `schema_version`, `analyser_version`, `audio_evidence`, `semantic_read`, and `provenance`.
- `instrument_detection.primary` is the current best label.
- `instrument_detection.confidence` is heuristic confidence, not a trained model probability.
- `instrument_detection.candidates` lists ranked labels and scores for UI inspection.
- `instrument_detection.notes` explains the decision using centroid, band balance, and onset density.
- `semantic_read` reports mood, vibe, weirdness, identity risk, coherence, potential, and a concise interpretation.

## UI Surface

The frontend route `/audio` provides:

- live input levels and input-device selection;
- a live analysis window slider;
- upload-based sample analysis;
- semantic mood/vibe/identity panels;
- candidate meters for kick/snare/hat/etc.;
- frequency-band columns and transient metrics.

The layout follows the Tofo/proxy-photo pattern: a compact control rail, dense analysis canvas, restrained dark panels, and direct action buttons instead of a marketing-style screen.

## Current Limits

This is rule-based MIR, not stem separation or supervised drum classification. It should work as a useful v1 for one-shot drum samples and simple loops, but layered loops can confuse the primary label. Mood/vibe/weirdness/genericness are listening prompts with evidence, not final truths. CLAP/YAMNet/Essentia/LLM layers are still future optional model opinions.

## Related Documents

- `docs/semantic-audio-conception.md`
- `docs/semantic-audio-feature-spec.md`
- `docs/semantic-audio-backlog.md`
- `docs/semantic-audio-subagent-review-export.md`
- `beat-twin/contracts/semantic_analysis.schema.json`
