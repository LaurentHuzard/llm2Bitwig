# Semantic Audio Analysis - Task Backlog

## Milestone 0 - Vocabulary And Contracts

- [ ] Define canonical semantic vocabulary in `docs/semantic-audio-vocabulary.md`.
- [ ] Add score semantics and confidence language to `docs/audio-detection-tools.md`.
- [x] Create JSON schema for `semantic-audio-analysis.v1`.
- [x] Add `schema_version`, `analyser_version`, and `provenance.models` to analyser responses.
- [ ] Decide whether semantic analysis lives in `ear-service/` only or a new `semantic-service/`.

## Milestone 1 - Descriptor Baseline

- [x] Refactor `ear-service/main.py` analysis into importable modules.
- [x] Add stable `audio_evidence` object beside the current `features` response.
- [x] Add tempo confidence and key confidence.
- [x] Add MFCC summary, spectral flatness, rolloff, bandwidth, zero-crossing rate.
- [x] Add rhythm stability, silence ratio, dynamic range, and repetition/novelty proxy.
- [x] Preserve current instrument detection output for compatibility.

## Milestone 2 - Heuristic Semantic Layer

- [x] Implement starter mood tags from deterministic evidence.
- [x] Implement starter vibe tags from tempo, spectral balance, rhythm density, and instrument hints.
- [x] Implement weirdness source detection: rhythm instability, harmonic ambiguity, model disagreement placeholder, texture novelty proxy.
- [x] Implement genericness source detection as identity risk, not quality.
- [x] Add caveat generation when evidence is weak or contradictory.
- [x] Add a sample semantic report to `/analyze-file`.

## Milestone 3 - UI Extension

- [x] Extend `/audio` with a semantic summary panel.
- [x] Add mood and vibe candidate meters.
- [x] Add weirdness and genericness cards with evidence text.
- [x] Add model availability badges.
- [ ] Add low-confidence and contradictory-evidence states.
- [ ] Add "accept tag," "reject tag," and "human note" controls.
- [ ] Keep upload/live analysis paths separate and visually obvious.

## Milestone 4 - Cache And Local Library

- [ ] Add a local SQLite or JSONL analysis cache.
- [ ] Cache descriptors by path, size, mtime, analyser version, and model version.
- [ ] Store raw descriptors separately from semantic labels and human corrections.
- [ ] Add a user-selected folder indexer.
- [ ] Add bounded batch analysis with progress, pause, resume, and cancel.
- [ ] Never scan home/music folders automatically.

## Milestone 5 - Optional Model Layer

- [ ] Add a prompt-set file for CLAP-style vibe anchors.
- [ ] Prototype CLAP similarity on one uploaded file.
- [ ] Add optional YAMNet/AudioSet labels for environmental and event evidence.
- [ ] Evaluate Essentia dependency and licensing before integrating.
- [ ] Add `model_unavailable` behavior and UI copy.
- [ ] Compare model outputs against heuristic tags and expose disagreement.

## Milestone 6 - LLM Curator

- [ ] Define LLM input contract: descriptors, candidates, model outputs, project context, human corrections.
- [ ] Define strict LLM output schema for summary, reason to keep, suggested mutation, caveat.
- [ ] Require evidence references in LLM output.
- [ ] Add prompt tests with fixed descriptor fixtures.
- [ ] Add safety language: no quality verdicts, no destructive actions, no fake certainty.

## Milestone 7 - Human Feedback And Calibration

- [ ] Store accepted/rejected tags.
- [ ] Store human correction notes.
- [ ] Add DA/PotoListener review fields.
- [ ] Build a tiny calibration dataset:
  - silence;
  - kick one-shot;
  - noisy snare burst;
  - closed hat;
  - ambient pad;
  - distorted loop;
  - generic trap drum loop;
  - weird glitch texture;
  - dark warehouse loop.
- [ ] Add a calibration report comparing machine read and human notes.
- [ ] Use corrections to tune heuristics before training a custom model.

## Milestone 8 - MCP Read-Only Integration

- [ ] Decide active MCP backend: TypeScript `server-mcp/` or Java `server-mcp-java/`.
- [ ] Add read-only `sample_analyze` MCP tool.
- [ ] Add read-only `sample_library_search` MCP tool.
- [ ] Add read-only `sample_feedback_record` MCP tool.
- [ ] Keep Bitwig mutation out of this milestone.
- [ ] Add tests for MCP response shape with mocked ear-service.

## Milestone 9 - Quality Gates

- [x] Python unit tests for descriptor functions.
- [ ] FastAPI tests for `/analyze-file`: empty file, unsupported file, valid fixture, missing optional models.
- [ ] Frontend tests for loading, error, low-confidence, missing-model, and correction states.
- [ ] Cache invalidation tests.
- [ ] Batch indexer tests with fixture directory.
- [ ] Documentation review pass by Reviewer and Moldu roles.

## Open Questions

- Should genericness be renamed in the UI to identity risk or distinctiveness gap?
- Should CLAP prompt sets be project-specific, global, or both?
- Which cache store is canonical: SQLite, JSONL, or existing project storage?
- Should semantic analysis be synchronous for single files and queued for library scans?
- Which MCP backend owns sample-library read tools?
- How should user corrections feed future custom model training?

## First Recommended Slice

Build Milestones 0-2 only:

1. schema and vocabulary;
2. richer deterministic descriptors;
3. semantic heuristic report for one uploaded file;
4. docs and fixtures.

This keeps the feature honest before adding heavy model dependencies.

## Implementation Checkpoint - 2026-04-29

Completed in the first dev slice:

- [x] Added `semantic-audio-analysis.v1` schema in `beat-twin/contracts/semantic_analysis.schema.json`.
- [x] Added `schema_version`, `analyser_version`, `audio_evidence`, `semantic_read`, and `provenance` to `ear-service` analysis responses.
- [x] Added heuristic mood, vibe, weirdness, identity-risk, coherence, and potential scoring.
- [x] Extended `/audio` with semantic summary, mood/vibe candidates, model status chips, and evidence cards.
- [x] Updated docs index and audio detection docs.

Still open from the first recommended slice:

- [x] Refactor `ear-service/main.py` into importable analysis modules.
- [x] Add Python unit fixtures and uploaded-file helper tests.
- [ ] Add human tag correction storage.
- [ ] Add a dedicated vocabulary document.

## Implementation Checkpoint - 2026-04-29 Orbit Loop Slice

Completed in the continuation slice:

- [x] Moved deterministic semantic analysis into `ear-service/analysis_core.py`.
- [x] Moved uploaded-file handling into `ear-service/file_analysis.py` so it can be tested without starting the live capture app.
- [x] Added synthetic audio fixtures for silence, kick-like lows, noisy snare-like bursts, and hat-like impulses.
- [x] Added uploaded-file helper tests for empty, valid, and unreadable sample payloads.
- [x] Updated `docs/task.md` with the current semantic audio Orbit Loop task.

Still open after the continuation slice:

- [ ] Add true FastAPI client tests around `/analyze-file` once live capture startup can be dependency-injected or disabled in test mode.
- [ ] Add the dedicated semantic vocabulary document.
- [ ] Add human tag correction storage.
- [ ] Add optional model comparison fixtures after CLAP/YAMNet availability is decided.
