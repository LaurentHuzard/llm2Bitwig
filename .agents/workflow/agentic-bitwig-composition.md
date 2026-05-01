# Workflow: Agentic Bitwig Composition

## Purpose

Create and validate a Bitwig song sketch through a supervised multi-agent studio loop.

This workflow extends the repository Orbit Loop. It adds music-specific roles while keeping QA-Sentinel, DomainSmith, Archivist, and HistoryGuardian in their existing responsibilities.

## Required Inputs

- Human seed prompt.
- Current project state from `bitwig://project/summary` or equivalent MCP tools.
- Available MCP tools for track, clip, scene, transport, mixer, browser, and device operations.
- Safety boundary for the session:
  - test-only project,
  - user project with explicit human approval,
  - or read-only brainstorm.

## Agents

| Agent | Responsibility | Output |
| --- | --- | --- |
| @Orchestrator | Convert intent into plan and gates | Mission brief, acceptance checks |
| @DA | Artistic direction | Chosen direction, removal list |
| @DrumArchitect | Groove and percussion | Drum lane plan |
| @BassWeaver | Bass and low-end relation | Bass lane plan |
| @HarmonySmith | Chords and harmonic pacing | Harmony lane plan |
| @LeadHook | Motif and melody | Hook lane plan |
| @TextureScout | Transitions and texture | Texture lane plan |
| @SoundEngineer | Levels, panning, mix sanity | Mix notes and MCP level actions |
| @PotoListener | Outside-ear critique | Gut check, boring thing, push-harder thing |
| @DomainSmith | MCP execution mapping | Tool-call plan |
| @QA-Sentinel | Verification | MCP E2E result, Computer Use review result |
| @Archivist | Memory and logs | Session note |

## Loop

### 1. Intake

Orchestrator writes:
- brief,
- scope,
- forbidden actions,
- final pass criteria.

Stop if the user has not confirmed whether the workflow can modify the current Bitwig project.

### 2. Brainstorm Council

Each musical agent gives a compact proposal:
- one role in the track,
- one concrete lane idea,
- one thing to avoid.

DA selects one coherent direction.

PotoListener reacts in plain language.

### 3. Tool Plan

DomainSmith maps the selected idea to MCP actions:
- create instrument/audio tracks,
- rename tracks with `BT_E2E_*` or project namespace,
- color tracks,
- create scenes/clips when available,
- set initial volume/pan/mute/solo states,
- read state back.

QA-Sentinel writes assertions before execution.

### 4. Bitwig Execution

Allowed default namespace for test runs:

```text
BT_E2E_<ROLE>_<SHORT_ID>
```

Example tracks:
- `BT_E2E_DRUMS_01`
- `BT_E2E_BASS_01`
- `BT_E2E_HARMONY_01`
- `BT_E2E_LEAD_01`
- `BT_E2E_TEXTURE_01`

All destructive cleanup must filter by namespace.

### 5. Deterministic E2E

QA-Sentinel verifies through MCP:
- all planned tracks exist,
- names/colors match,
- clips/scenes exist where requested,
- project summary is readable,
- transport responds,
- cleanup plan is namespaced.

The run fails if any assertion depends only on a screenshot.

### 6. Computer Use Review

Computer Use starts only after MCP assertions pass.

Review prompt:

```text
You are reviewing a Bitwig test project created by Beat Twin. Confirm whether the visible project contains the expected tracks, whether any modal/error blocks the session, and whether the arrangement looks coherent enough for a human to continue. Do not save, export, delete, or overwrite anything.
```

Computer Use may:
- inspect the Bitwig window,
- switch visible panels if needed,
- take screenshots,
- report visible mismatch.

Computer Use must not:
- save,
- export,
- delete,
- install devices,
- browse the filesystem,
- modify non-test tracks.

### 7. Archive

Archivist writes a short session note under `docs/diary/` with:
- brief,
- track plan,
- MCP result,
- Computer Use result,
- human decisions,
- next musical move.

## Pass Criteria

- MCP E2E passes.
- Computer Use reports no visible blocker.
- DA accepts the direction.
- PotoListener names one memorable thing.
- SoundEngineer reports the sketch is not obviously broken.

## Fail Criteria

- Bitwig MCP connection is unavailable.
- Track creation cannot be verified through MCP.
- Computer Use detects a modal or disconnected state that blocks review.
- The workflow attempts an irreversible action without human confirmation.
