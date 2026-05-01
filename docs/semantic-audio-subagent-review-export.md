# Semantic Audio Analysis - Subagent Review Export

Date: 2026-04-29

Context: this export preserves the visible subagent outputs used to design the semantic audio analysis docs for mood, vibe, weirdness, genericness, and distinctiveness. It is not a hidden transcript export; it contains the final briefs and challenges returned by each subagent.

## Agents

- Product / Audio Brainstormer
- Architecture Challenger
- Doc Reviewer
- Moldu Readability Reviewer

## Product / Audio Brainstormer

### Goals

Build a semantic ear that helps Beat Twin answer: "what is this fragment trying to be, and where is it too obvious, too noisy, or too alive?"

It should not output one final truth. It should output a small bundle of evidence: mood, vibe, weirdness, genericness, confidence, and suggested musical questions for the studio council.

Core use cases:

- Tag clips/tracks after capture.
- Compare fragments inside a session.
- Warn when a loop is technically fine but emotionally flat.
- Detect promising accidents: unstable rhythm, odd timbre, unexpected silence, genre friction.
- Feed LLM reflection with grounded audio features, not vibes-only prose.

### Dimensions

Mood: emotional valence and energy.
Examples: tense, euphoric, melancholic, cold, playful, anxious, intimate.

Vibe: cultural/genre-adjacent identity.
Examples: broken club, bedroom techno, dusty hip-hop, cinematic ambient, industrial pop, vaporous IDM.

Weirdness: productive deviation from expectation.
This is not badness. It means: unusual timbre, unstable meter, dissonant harmony, abrupt structure, uncanny texture, genre collision, nonstandard dynamics.

Genericness: resemblance to common templates without distinctive traits.
This should be treated carefully. A simple kick loop can be useful. Genericness should mean low identity density, not bad music.

Coherence: whether the parts feel like they belong to one musical object.

Potential: whether a fragment has enough signal to deserve another pass.

### Signals

Librosa / DSP baseline:

- Tempo, beat stability, onset density.
- RMS/loudness envelope and dynamic range.
- Spectral centroid, rolloff, bandwidth, flatness.
- MFCCs for timbral fingerprints.
- Chroma / key estimate / harmonic ambiguity.
- Zero-crossing rate for noisiness/percussiveness.
- Repetition and novelty curves for structure.
- Silence ratio, transient density, loop boundary roughness.

Essentia-style MIR:

- Danceability, arousal/valence-ish descriptors.
- Tonal stability, dissonance, key strength.
- Rhythm complexity.
- Genre/mood classifiers if available locally.
- High-level descriptor cross-checks against librosa features.

YAMNet / audio event layer:

- Detect non-musical or semi-musical events: noise, speech, machine texture, crowd, impact, ambience.
- Useful for weirdness and contamination detection.
- Should be evidence, not verdict: "contains machine-like broadband texture" is better than "bad recording."

CLAP / embedding layer:

- Text-audio similarity prompts:
  - "dark club track"
  - "generic stock music"
  - "strange metallic percussion"
  - "warm intimate melody"
  - "experimental but coherent"
- Nearest-neighbor comparison against project memory: "sounds close to prior fragment X."
- Useful for vibe, cultural tags, and semantic retrieval.

LLM layer:

- Takes structured features + classifier outputs + project context.
- Produces concise analysis:
  - "This clip is high-energy but low-identity: stable 4/4, narrow timbral range, little harmonic motion."
  - "The weirdness is mostly timbral, not rhythmic."
  - "Keep the noisy transient; vary the bass pattern."

### Model Stack

1. Capture layer: audio fragment + DAW metadata such as track name, clip name, BPM, instrument, Bitwig context, capture time.
2. Feature layer: deterministic numeric descriptors from librosa/Essentia.
3. Classifier layer: CLAP/YAMNet/Essentia semantic labels with confidence and disagreement tracking.
4. Comparative memory layer: compare against current project clips, user prior fragments, known too-generic patterns, and known signature Beat Twin sounds.
5. LLM interpretation layer: converts evidence into musical notes for Orchestrator, DA, engineer, and outside-ear roles.
6. Action layer: suggests, never commands: keep, mutate, layer, simplify, contrast, archive as reference.

### Risks

- Mood detection can become fake certainty.
- Genericness can become taste-policing.
- CLAP prompt design can bias everything.
- Weirdness can over-reward chaos.
- YAMNet may misread music as environmental sound.
- LLM summaries can hallucinate music theory.

### What Not To Build Yet

- Do not build a hit predictor.
- Do not build automatic arrangement decisions.
- Do not build a single global score like `vibe: 87`.
- Do not train a custom model before the feature/classifier/LLM evidence loop exists.
- Do not make genericness destructive or auto-filtering.
- Do not let the analyser overwrite human naming, notes, or Bitwig structure.
- Do not build a huge taxonomy first.

Recommended first version: a small semantic report per clip with mood, vibe, weirdness source, genericness source, confidence, one suggested mutation, and one reason to keep it.

## Architecture Challenger

### Constraints

The semantic/vibe analyser should be framed as local audio descriptors plus human vocabulary, not as "understands the track." Current reality is a FastAPI `ear-service` with librosa heuristics, `/analyze`, `/analyze-file`, and a frontend `/audio` route. That is a good base for BPM/key/bands/transients/drum-family hints, but not enough for claims like mood, genre truth, arrangement intent, or "find the perfect sample."

The MCP layer is still uncertain: both `server-mcp/` TypeScript and `server-mcp-java/` expose ear tools, and `docs/task.md` explicitly leaves the active backend undecided. Do not build semantic features that depend on MCP until one backend owns the contract.

Model dependencies must be optional. A local-first analyser should work offline with deterministic features first; embeddings, CLAP-style audio models, or LLM labeling can be a second layer with clear install gates, cache invalidation, and model-unavailable behavior.

Caching is mandatory before library scanning. Cache by file path + size + mtime + analyser version + model version. Store raw descriptors separately from subjective labels so vibe words can evolve without recomputing FFT/key/BPM every time.

Performance target should be boring: batch queue, bounded concurrency, cancel/resume, skip unchanged files, no full-library scan on app launch, and no blocking FastAPI request while recursively analysing a folder.

### Recommended Slices

1. Descriptor Contract: extend the existing `ear-service` response with stable fields such as duration, loudness, spectral bands, onset density, tempo confidence, key confidence, tags, and warnings.
2. Single File Semantic Pass: enrich `/analyze-file` for one uploaded/local sample.
3. Local Sample Library Index: add a local folder indexer as a separate service/module.
4. Similarity Search: start with numeric descriptors before embeddings.
5. MCP Read-Only Tool: expose `sample_library_search` and `sample_analyze` only after backend direction is settled.
6. Human Feedback Loop: let the user correct tags and store corrections locally.

### Red Flags

- Vibe analyser that outputs poetic labels without feature evidence.
- Claims that it can understand full mix intent from a three-second buffer.
- Shipping CLAP/transformer dependencies before deterministic MIR and cache plumbing are solid.
- Frontend-only indexing or scanning.
- MCP tools that mutate Bitwig based on uncertain labels.
- No confidence, provenance, or analyser version.
- Treating key/BPM as facts for noisy loops.
- Full recursive library analysis on startup.
- Duplicate contracts between TypeScript MCP and Java MCP.

### Test Strategy

Add Python unit tests around synthetic audio fixtures: silence, sine bass, impulse hats, kick-like low transient, noisy snare-ish burst. Then FastAPI tests for `/analyze-file` error cases, empty uploads, unsupported files, and response shape.

Frontend tests should mock the ear-service and verify loading, error, offline, and low-confidence states. MCP tests should mock the ear-service client in both active server paths until one is deprecated.

For library indexing, use a tiny fixture directory and assert cache reuse, invalidation on mtime/size change, analyser-version invalidation, and bounded batch behavior.

Context7 note from challenger: repo contract asks to use `context7`, but no `context7` tool was available in this session.

## Doc Reviewer

### Review Checklist

Concept / Analyse Doc:

- Defines the purpose as studio feedback, not objective truth.
- Separates audio-derived signals from LLM/musicological interpretation.
- Reuses existing Beat Twin vocabulary: `Feature Core`, semantic tags, agents, DA, PotoListener, TextureScout, SoundEngineer.
- Defines mood, vibe, weirdness, and genericness clearly.
- Explains confidence levels and uncertainty.
- Includes failure cases: sparse audio, loops, noisy input, genre mismatch, weak model evidence.
- Names human override as first-class.

Feature Spec:

- Defines input sources: live buffer, uploaded file, selected Bitwig track, full project snapshot.
- Defines output contract: scores, labels, evidence, confidence, timestamp/window, source.
- Specifies whether scores are continuous, categorical, or both.
- Shows example JSON for one analysis result.
- Maps analysis to existing services: `ear-service`, `beat-twin/services`, MCP, frontend `/audio`.
- Separates v1 heuristics from later ML/embedding/model-based analysis.
- Includes UI expectations: dense analysis view, candidate meters, readable rationale, no fake certainty.
- Includes safety/ethics: do not call user music bad; frame genericness as risk or identity strength.
- Defines acceptance tests and fixtures.

Task Backlog:

- Split by implementation layer: schema, ear-service, MCP bridge, frontend, tests, docs.
- Includes data fixtures/audio examples for validation.
- Includes regression tests for silence, drums-only, dense mix, ambient pad, distorted/noisy loop.
- Marks dependencies on existing instrument detection and semantic tagging.
- Adds documentation tasks for schema vocabulary and interpretation guide.
- Has a calibration task comparing machine output against human DA/PotoListener notes.

### Likely Missing Sections

- Vocabulary canonicalization.
- Evidence model.
- Score semantics.
- Genre / context conditioning.
- Human review loop.
- Schema versioning.
- Non-audio signals.
- Calibration dataset.
- Anti-genericness actions.
- Acceptance rubric.

Biggest reviewer note: genericness is the riskiest concept. It should be framed as identity risk or distinctiveness gap, with explainable evidence and human override.

## Moldu Readability Reviewer

As Moldu, normal music producer / curious reader, I would need the document to explain the idea as if I have ears, taste, and DAW experience, but not machine-learning vocabulary.

The document should answer one simple question first:

> What does this detector hear that I would also recognize in a track?

Terms like mood, vibe, weirdness, and genericness can become slippery fast. Each one should be tied to plain musical examples.

### What The Document Must Explain

Mood: emotional color, like sad, tense, dreamy, aggressive, calm, euphoric, lonely.

Example: a slow minor-key pad with soft attack and lots of reverb may be tagged as melancholic or spacious.

Vibe: more social/cultural than mood.

Example: late-night club, bedroom demo, cinematic trailer, lo-fi loop, warehouse techno, commercial pop polish.

Weirdness: weird does not mean bad. It can mean unexpected, unstable, hard to classify, unusually textured, rhythmically off-grid, harmonically strange, or structurally surprising.

Example: a clean four-on-the-floor kick is low weirdness. A kick pattern that stutters, reverses, and drops out unpredictably is higher weirdness.

Genericness: needs the most care, because it sounds judgmental. It may mean similar to many known examples, low distinctiveness, template-like arrangement, or predictable production choices.

Example: a standard trap drum loop with common hi-hat rolls and stock 808 movement may score as more generic, even if it is still useful.

### Terms To Challenge

- `embedding`: say compressed fingerprint of the sound.
- `latent space`: say a map where similar sounds are placed near each other.
- `classifier`: say labeler or a system that guesses categories.
- `feature extraction`: say measuring things in the audio, like brightness, rhythm, density, and texture.
- `semantic audio`: say what the sound seems to mean or feel like, beyond pitch and loudness.
- `novelty`: clarify whether it means originality, unusual sound design, or difference from a reference library.
- `confidence`: clarify whether high confidence means right or merely sure.
- `distance`: explain distance from what.
- `cluster`: say a group of sounds that the system thinks are similar.
- `outlier`: say a sound that does not resemble the usual examples.

### Questions The Document Should Answer

- Is this judging the whole track, a clip, a stem, or a short audio moment?
- Does it listen to lyrics, harmony, rhythm, sound design, dynamics, or all of them?
- Can a sound be both generic and emotionally strong?
- Can a sound be weird but still genre-correct?
- Is genericness based on the user's own library, a dataset, or built-in musical assumptions?
- How should a producer use the result without feeling judged?
- What should I do if I disagree with the detector?
- Are these scores creative prompts, search filters, warnings, or final truths?

### Plain-Language Framing

Instead of:

> The system computes latent affective and novelty embeddings.

Say:

> The system makes a rough fingerprint of the audio, then compares it with other sounds to guess its emotional tone, stylistic neighborhood, and how expected or unusual it feels.

Instead of:

> Genericness is derived from proximity to dense genre clusters.

Say:

> If a clip sounds very close to many common examples in the reference library, it may receive a higher genericness score.

The biggest thing: make it clear this is a companion ear, not a judge. The scores are invitations to listen again, not verdicts.

## Synthesis

The agents agreed on a conservative path:

- keep deterministic descriptors as the first reliable layer;
- add semantics only with evidence and confidence;
- treat CLAP/YAMNet/Essentia as optional model opinions;
- use the LLM as a curator of structured evidence, not as the source of audio truth;
- frame genericness as identity risk or distinctiveness gap;
- require human correction and local calibration before any custom model training;
- avoid MCP mutation until backend ownership is settled.
