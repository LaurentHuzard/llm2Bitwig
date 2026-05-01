# Semantic Audio Analysis - Feature Spec

## Feature Name

Semantic Audio Analysis for mood, vibe, weirdness, genericness, coherence, and potential.

## User Story

As a producer using Beat Twin, I want the audio tools to describe what a sample or clip feels like, explain why, and suggest how I might keep or mutate it, so I can browse, evaluate, and develop material without reducing taste to a hard verdict.

## Inputs

V1 inputs:

- uploaded audio file through the frontend `/audio` surface;
- live buffer via `GET /analyze?seconds=N`;
- manual user notes or corrections, once the correction UI exists.

Later inputs:

- local sample path from a user-selected folder;
- selected Bitwig clip or track;
- project BPM, track name, device names, clip names, scene position;
- reference prompts or user-defined style anchors.

## Output Contract

Semantic analysis returns deterministic audio evidence plus optional semantic layers.

```json
{
  "schema_version": "semantic-audio-analysis.v1",
  "analysis_id": "sample_20260429_001",
  "source": {
    "kind": "uploaded_sample",
    "filename": "metallic_kick_loop.wav",
    "duration": 4.0,
    "sample_rate": 44100
  },
  "audio_evidence": {
    "tempo": { "value": 138.2, "confidence": 0.61 },
    "key": { "value": "F# minor", "confidence": 0.34 },
    "loudness": { "rms": 0.18, "peak": 0.91 },
    "spectral": {
      "centroid": 1840.0,
      "sub": 0.22,
      "bass": 0.31,
      "mid": 0.18,
      "high": 0.09
    },
    "rhythm": {
      "onset_density_per_second": 3.4,
      "beat_stability": 0.74
    }
  },
  "instrument_detection": {
    "primary": "kick",
    "confidence": 0.71,
    "candidates": [
      { "label": "kick", "score": 0.71 },
      { "label": "tom", "score": 0.38 }
    ]
  },
  "semantic_read": {
    "mood": [
      { "label": "tense", "score": 0.66 }
    ],
    "vibe": [
      { "label": "warehouse techno", "score": 0.73 }
    ],
    "weirdness": {
      "score": 0.58,
      "source": "metallic high-mid transient smear"
    },
    "genericness": {
      "score": 0.42,
      "source": "stable four-on-the-floor pulse, but distinctive texture"
    },
    "coherence": { "score": 0.69 },
    "potential": { "score": 0.77 }
  },
  "interpretation": {
    "summary": "Tense warehouse kick loop with a metallic edge.",
    "reason_to_keep": "The transient texture gives the loop identity.",
    "suggested_mutation": "Drop one kick before the loop turn and automate the noise tail.",
    "caveat": "Key confidence is low; harmonic labels are weak evidence."
  },
  "provenance": {
    "analyser_version": "0.1.0",
    "models": [
      { "name": "librosa", "version": "0.10+", "status": "used" },
      { "name": "clap", "version": null, "status": "not_available" },
      { "name": "llm_curator", "version": null, "status": "not_available" }
    ]
  }
}
```

## Score Semantics

Scores use `0.0..1.0`.

- `0.0..0.29`: weak or absent signal.
- `0.30..0.59`: possible signal, use with caution.
- `0.60..0.79`: useful signal with readable evidence.
- `0.80..1.0`: strong signal, still not objective truth.

Scores are not universal music quality metrics. They are local listening aids.

## System Design

### Layer 1 - Descriptor Contract

Extend `ear-service` analysis results with a stable `audio_evidence` object:

- loudness;
- spectral features;
- rhythm/transient features;
- tempo/key with confidence;
- warnings and low-confidence flags.

This layer must work without optional ML dependencies.

### Layer 2 - Semantic Heuristics

Map deterministic evidence to starter tags:

- dark / bright;
- rhythmic / ambient;
- noisy / clean;
- stable / unstable;
- sparse / dense;
- dry / spacious, when reverb proxies exist.

### Layer 3 - Embeddings And Model Opinions

Optional model layer:

- CLAP prompt similarity for vibe and genericness anchors;
- YAMNet or AudioSet labels for environmental/noise/event evidence;
- Essentia models for danceability, mood, genre, and rhythm descriptors.

Missing models should degrade gracefully.

### Layer 4 - LLM Curator

The LLM receives structured evidence and returns short, constrained studio language. It must cite evidence fields and include caveats.

The LLM must not:

- invent exact music theory;
- judge quality;
- recommend destructive actions;
- hide uncertainty.

### Layer 5 - Human Correction

Users can accept, reject, or rewrite tags. Corrections are stored separately from raw descriptors.

## UI Expectations

Extend the `/audio` page with:

- semantic summary panel;
- mood/vibe candidate meters;
- weirdness and genericness evidence cards;
- model availability indicators;
- "accept tag" and "reject tag" controls;
- human note field;
- low-confidence visual state.

The UI should stay dense and tool-like, following the current analyser surface.

## Storage And Cache

Before folder/library analysis, add a cache.

Cache key:

- path;
- file size;
- mtime;
- analyser version;
- model version;
- prompt-set version.

Store separately:

- raw descriptors;
- model outputs;
- LLM interpretation;
- human corrections.

## MCP Exposure

Until the active MCP backend is decided, semantic analysis should not depend on MCP writes.

Read-only tools after backend decision:

- `sample_analyze`;
- `sample_library_search`;
- `sample_semantic_tags`;
- `sample_feedback_record`.

Mutation tools, such as loading samples into Bitwig, are out of scope for this feature spec.

## Acceptance Criteria

- `/analyze-file` can return a versioned semantic contract for one audio file.
- Semantic output includes evidence, confidence, and caveats.
- Genericness is framed as identity risk or distinctiveness gap, not quality.
- UI shows mood/vibe/weirdness/genericness without implying certainty.
- Missing optional models are visible and non-fatal.
- Python tests cover silence, kick-like transient, noisy snare-like burst, ambient pad, and distorted loop fixture.
- Frontend tests mock analyser responses, error states, low-confidence states, and missing-model states.
- Docs define vocabulary and score semantics.

## Reviewer Notes

Reviewer challenge: the riskiest concept is genericness. The spec handles this by requiring evidence, confidence, human correction, and non-judgmental language.

Moldu challenge: explain machine terms in producer language. The UI and docs should say "audio fingerprint" instead of embedding when possible, and "the system guesses" instead of "the model knows."

