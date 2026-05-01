# Semantic Audio Analysis - Conception And Analysis

## Purpose

Beat Twin needs an ear that can say more than "this is a kick" or "the tempo is 140." The semantic analyser should help a producer ask:

> What does this fragment feel like, where does it belong, and where is it too obvious or too strange to ignore?

The analyser is a companion ear, not a judge. Its output is evidence for listening again, not a verdict on taste. "Weird" does not mean bad. "Generic" does not mean useless. A simple loop can be exactly the glue a track needs.

## Scope

The first semantic pass applies to:

- uploaded samples;
- short live buffer windows;
- later, selected Bitwig clips or tracks;
- later, local sample-library entries.

It does not try to understand a full song from a three-second buffer. It reports what the captured audio suggests, with confidence, provenance, and readable reasons.

## Core Dimensions

### Mood

Mood is the emotional color of the sound.

Examples:

- dark
- tense
- euphoric
- melancholic
- cold
- playful
- anxious
- intimate

Plain example: a slow minor-key pad with soft attack and long reverb may be tagged as melancholic or spacious.

### Vibe

Vibe is the cultural or contextual neighborhood of the sound.

Examples:

- warehouse techno
- bedroom demo
- dusty hip-hop
- cinematic ambient
- broken club
- commercial pop polish
- raw underground loop
- ritual texture

Vibe is not only about audio features. It may also use track names, devices, project tempo, user tags, and nearby clips once those signals are available.

### Weirdness

Weirdness is productive deviation from expectation. It can come from unusual timbre, unstable rhythm, dissonant harmony, abrupt structure, uncanny texture, genre collision, or nonstandard dynamics.

Plain example: a clean four-on-the-floor kick is low weirdness. A kick pattern that stutters, reverses, drops out, and returns slightly late is higher weirdness.

Useful weirdness is not maximum chaos. Beat Twin should distinguish "weird but usable" from "unreadable noise."

### Genericness

Genericness is better framed as identity risk or distinctiveness gap. It means a fragment resembles many common examples and has few traits that make it specific.

Plain example: a standard trap drum loop with common hi-hat rolls and stock 808 movement may score higher on genericness, while still being useful.

Genericness must always include evidence and human override. The analyser should never call music bad.

### Coherence

Coherence asks whether the parts feel like they belong to the same musical object. A fragment can be weird and coherent, or generic and incoherent.

### Potential

Potential asks whether the fragment deserves another pass. A fragment can have low polish but high potential because one texture, silence, rhythm, or accident is worth keeping.

## Signal Stack

### Deterministic Audio Descriptors

The existing `ear-service` and `librosa` layer remains the base.

Signals:

- duration;
- loudness and peak/RMS balance;
- spectral bands;
- spectral centroid, rolloff, bandwidth, flatness;
- MFCC timbral fingerprints;
- onset density and transient strength;
- tempo and beat stability;
- chroma, key estimate, and harmonic ambiguity;
- zero-crossing rate for noisy or percussive texture;
- silence ratio and dynamic range.

These descriptors are not the final answer. They are the measurable evidence.

### MIR And Classifier Layer

Optional models can add richer readings.

- Essentia-style descriptors: danceability, rhythm complexity, tonal stability, dissonance, genre/mood model outputs.
- YAMNet or AudioSet-style event labels: speech, crowd, machine noise, impact, ambience, drum-like events.
- CLAP-style audio-text similarity: compare audio against curated text prompts such as "dark club loop," "generic stock music," "strange metallic percussion," or "experimental but coherent."

Every model output must include provenance: model name, version, prompt set, confidence, and whether it was available.

### Comparative Memory

Genericness and weirdness need context. A sound should be compared against:

- the current project;
- the user's accepted sample library;
- prior Beat Twin fragments;
- project-specific reference tags;
- explicitly marked "signature" or "too generic" examples.

This comparison is local-first. Beat Twin should not crawl the user's folders automatically.

### LLM Interpretation Layer

The LLM should not invent audio facts. It should synthesize structured evidence into useful studio language.

Input to the LLM:

- deterministic descriptors;
- classifier outputs;
- CLAP prompt similarities;
- project context;
- user corrections;
- uncertainty flags.

Output from the LLM:

- short mood/vibe summary;
- likely weirdness source;
- likely genericness source;
- one reason to keep the fragment;
- one possible mutation;
- confidence and caveats.

Example:

```json
{
  "summary": "High-energy but low-identity club loop.",
  "mood": ["tense", "mechanical"],
  "vibe": ["warehouse", "industrial"],
  "weirdness_source": "noisy high-mid transient smear",
  "genericness_source": "stable four-on-the-floor pulse with little rhythmic variation",
  "reason_to_keep": "the metallic transient gives the loop a useful scar",
  "suggested_mutation": "drop one kick before the loop turn and automate the noise tail",
  "confidence": 0.68
}
```

## Evidence Model

Every semantic claim should be backed by evidence.

| Claim | Possible Evidence |
| --- | --- |
| dark | low centroid, low high-band energy, minor/chromatic ambiguity |
| tense | high dissonance, repeated high-mid energy, narrow dynamic release |
| euphoric | bright spectrum, stable pulse, major/harmonic clarity |
| weird | model disagreement, outlier embedding, unstable rhythm, unusual timbre |
| generic | close to dense reference cluster, common prompt matches, low novelty |
| coherent | stable rhythmic/harmonic relation across windows |
| high potential | one distinctive trait despite low confidence elsewhere |

If evidence is weak, the output should say so.

## Human Review Loop

Semantic analysis must be correctable.

Fields to preserve:

- machine read;
- accepted tags;
- rejected tags;
- human correction;
- reviewer role, such as DA, SoundEngineer, PotoListener, or user;
- timestamp;
- analyser version.

Corrections become training and calibration data later.

## Subagent Brainstorm Summary

### Product / Audio Brainstormer

The analyser should produce a small evidence bundle, not one final truth. It should detect promising accidents, warn when a loop is technically fine but emotionally flat, and feed the studio council with grounded listening notes.

### Architecture Challenger

The current repo supports FastAPI `ear-service`, `/analyze`, `/analyze-file`, and frontend `/audio`. Semantic features must stay optional, cacheable, local-first, and independent of MCP until the active MCP backend is decided.

### Doc Reviewer

The docs need stable vocabulary, score semantics, evidence fields, schema versioning, human override, calibration fixtures, and a concrete acceptance rubric.

### Moldu Readability Review

The document must explain mood, vibe, weirdness, and genericness in producer language. Terms like embedding, classifier, feature extraction, cluster, confidence, and outlier need plain definitions. Genericness must be framed gently as a listening prompt, not taste policing.

## Risks

- Fake certainty about emotional meaning.
- Taste-policing through genericness labels.
- CLAP prompt bias.
- Weirdness rewarding chaos instead of useful deviation.
- YAMNet or generic audio models misreading music as environmental sound.
- LLM hallucinating music theory without evidence.
- Heavy model dependencies blocking the local-first workflow.

## Non-Goals For The First Pass

- No hit prediction.
- No automatic arrangement decisions.
- No destructive filtering of "generic" samples.
- No full-library scan on startup.
- No single global score like `vibe: 87`.
- No custom model training before descriptor contracts, caching, and correction loops exist.

