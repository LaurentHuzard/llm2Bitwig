# Agentic Bitwig Composition Workflow

## Intent

This workflow turns Beat Twin into a small studio council: agents propose a musical direction, create instrument responsibilities, ask Bitwig to materialize the session through MCP, then validate the result with deterministic checks and a supervised Computer Use pass.

The goal is not to let agents command the artist. The goal is to make a coherent draft quickly enough that the human can react musically.

## Session Shape

1. **Brief**
   - Human gives seed: genre, mood, BPM, reference words, constraints, or a fragment already in Bitwig.
   - Orchestrator writes the mission brief and risk boundary.

2. **Brainstorm**
   - Musical agents propose compatible ideas.
   - DA picks one direction and rejects clutter.
   - Poto Listener gives a blunt outside-ear reaction.

3. **Arrangement Plan**
   - Orchestrator converts the selected idea into a track plan.
   - DomainSmith maps each musical intention to MCP actions.
   - QA-Sentinel defines the exact assertions before Bitwig is touched.

4. **Bitwig Build**
   - MCP creates tracks, clips, scenes, colors, names, tempo, cue markers, and device placeholders.
   - Each instrument agent owns one lane of the arrangement.
   - Sound Engineer performs mix sanity passes.

5. **Verification**
   - Deterministic MCP E2E checks validate the Bitwig project state.
   - Computer Use performs the final visible review of the Bitwig session under supervision.
   - Archivist logs the final state, caveats, and next artistic move.

## Musical Agents

### @Orchestrator

Owns the mission brief, scope, and acceptance criteria.

Inputs:
- Human prompt.
- Current Bitwig project summary.
- Available MCP tool list.

Outputs:
- Session brief.
- Track plan.
- Stop conditions.

Allowed actions:
- Ask MCP for project state.
- Approve the build plan.
- Stop the workflow if the state is unsafe.

### @DrumArchitect

Owns drums, groove, swing, and energy contour.

Outputs:
- Drum track names.
- Clip plan by scene.
- Groove notes: density, swing, fills, transitions.

Allowed actions:
- Request drum/instrument tracks.
- Request clip creation and naming.
- Request color coding for drum lanes.

### @BassWeaver

Owns bass line, low-end movement, and kick relationship.

Outputs:
- Bass track intent.
- Pattern descriptions by section.
- Sidechain or mix notes for Sound Engineer.

Allowed actions:
- Request bass instrument track.
- Request clip placeholders.
- Request track volume/pan defaults.

### @HarmonySmith

Owns chords, pads, keys, and harmonic pacing.

Outputs:
- Harmonic palette.
- Chord-scene intent.
- Device/preset search suggestions when browser tools are available.

Allowed actions:
- Request harmony tracks.
- Request clip placeholders.
- Request cue markers for harmonic turns.

### @LeadHook

Owns motif, melody, hook, and earworm risk.

Outputs:
- Lead track purpose.
- Call-and-response ideas.
- Hook placement across scenes.

Allowed actions:
- Request lead instrument track.
- Request clip placeholders.
- Request mute/solo checks during review.

### @TextureScout

Owns ambience, ear candy, field texture, transitions, and weird little accidents that make the sketch feel alive.

Outputs:
- Texture track plan.
- Transition suggestions.
- Automation wishes for later implementation.

Allowed actions:
- Request audio or instrument texture tracks.
- Request scene markers.
- Request color coding.

### @SoundEngineer

Owns gain staging, balance, stereo sanity, and mix-readiness.

Outputs:
- Initial level plan.
- Pan suggestions.
- Red-flag list: clipping risk, overcrowded low end, masked hook.

Allowed actions:
- Set volume, pan, mute, solo, arm states through MCP.
- Read track state.
- Request a human confirmation before destructive cleanup.

### @DA

Owns artistic direction and taste.

Outputs:
- Chosen musical direction.
- What to remove.
- What must be exaggerated.

Allowed actions:
- Approve, reject, or request one revision cycle.
- No direct destructive Bitwig actions.

### @PotoListener

Owns the outside-ear reaction: the honest friend in the room.

Outputs:
- One-line gut reaction.
- One boring thing.
- One thing to push harder.

Allowed actions:
- No direct Bitwig actions.
- Can request a final A/B listen or visual scan.

## E2E Validation Layers

### Layer 1: MCP State Assertions

This is the primary automated test. It should run without relying on screenshots.

Required checks:
- Bitwig MCP server is reachable.
- Project has expected `BT_E2E_*` tracks after creation.
- Track types match intent where Bitwig exposes them.
- Track names and colors match the plan.
- Clip placeholders exist in expected track/scene positions.
- Tempo and cue markers match the session brief when supported.
- Cleanup only touches namespaced test artifacts.

Recommended script:

```bash
BITWIG_REAL_E2E=1 pnpm test:e2e:bitwig
```

Computer Use is enabled only when these environment variables are present:

```bash
OPENAI_API_KEY=...
BITWIG_CUA_MODEL=gpt-5.5
BITWIG_CUA_ENVIRONMENT=linux
BITWIG_CUA_SCREENSHOT_CMD='./scripts/capture-bitwig-screenshot.sh'
BITWIG_CUA_ACTION_CMD='./scripts/desktop-action-from-json.sh'
BITWIG_REAL_E2E=1 pnpm test:e2e:bitwig
```

`BITWIG_CUA_SCREENSHOT_CMD` must write PNG/JPEG bytes, or a `data:image/...` URL, to stdout. `BITWIG_CUA_ACTION_CMD` receives one Computer Use action JSON object on stdin and is responsible for mapping safe actions to the local desktop automation layer.

The harness uses the GA Computer Use path by default: model `gpt-5.5` and tool type `computer`, including batched `actions[]`. If the OpenAI project does not have access to the selected model, the E2E keeps the MCP assertions as the primary pass and marks Computer Use as skipped. Set `BITWIG_CUA_REQUIRED=1` when you want missing Computer Use access to fail the run.

To let Computer Use click the first visible DRUMS test clip and then verify the launched/queued state through MCP:

```bash
BITWIG_CUA_CLICK_PLAY_CLIP=1 BITWIG_REAL_E2E=1 pnpm test:e2e:bitwig
```

This mode uses the real mouse through the configured desktop action script, so keep Bitwig focused and avoid using the pointer until the run finishes.

For a less brittle desktop-input smoke test, open the on-screen piano keyboard at the bottom of Bitwig and use:

```bash
BITWIG_CUA_CLICK_KEYBOARD=1 BITWIG_REAL_E2E=1 pnpm test:e2e:bitwig
```

This mode asks Computer Use to click a large visible piano key after confirming the E2E tracks. It validates the screenshot/action loop without relying on the tiny clip-launch target.

To force the older preview integration, set:

```bash
BITWIG_CUA_LEGACY_PREVIEW=1
BITWIG_CUA_MODEL=computer-use-preview
```

For Kubuntu/Plasma Wayland:
- `scripts/capture-bitwig-screenshot.sh` uses Spectacle first, then Grim, then GNOME Screenshot.
- `scripts/desktop-action-from-json.sh` supports `wait` without extra tooling, and pointer/keyboard actions through `ydotool` or text input through `wtype`.
- If only visual review is needed, omit `BITWIG_CUA_ACTION_CMD`; the harness will still allow screenshot/wait actions and fail clearly if Computer Use asks for a real desktop action.
- If full action support is needed, install and configure `ydotool`/`ydotoold` for Wayland input injection before running the review. Check it with `pgrep -a ydotoold`; if it is not running, start it according to your package setup, for example with `systemctl --user enable --now ydotoold` when a user service exists, or a trusted manual `ydotoold` launch with access to `/dev/uinput`.

### Layer 2: Computer Use Review

Computer Use is a supervised visual-review layer. It is useful for checking what a human sees in Bitwig, not for proving the MCP contract.

Use it to validate:
- The Bitwig window is focused on the expected project.
- The visible track list matches the created plan.
- Arrangement/clip launcher lanes look populated as expected.
- Track names are readable.
- No obvious modal, error, or disconnected-controller state is blocking the session.

Do not use it as the only pass/fail oracle for:
- Exact track counts.
- Exact clip data.
- Timing-sensitive state.
- Audio quality.

Safety rules:
- Run inside a sandboxed desktop or dedicated test VM when possible.
- Require human acknowledgement before save/export/delete.
- Use a blocklist for destructive menu items when the harness supports it.
- Log every action and screenshot reference in the QA report.

## Final Composition Rubric

Pass:
- The MCP assertions pass.
- The visible Bitwig project contains the planned musical lanes.
- The DA says the draft has a clear identity.
- PotoListener can name the main hook or vibe in one sentence.
- SoundEngineer reports no obvious balance blocker for a first sketch.

Soft fail:
- The project state is correct, but the musical idea is bland.
- Computer Use cannot reliably inspect the UI, but MCP state is valid.
- One instrument lane is missing but the session is recoverable.

Hard fail:
- MCP cannot prove the tracks/clips exist.
- Bitwig is not connected to the controller.
- The workflow touches non-namespaced user data.
- Computer Use attempts an irreversible action without confirmation.

## Session Log Template

```md
# Beat Twin Composition Session

## Brief

- Seed:
- BPM:
- Mood:
- Constraints:

## Direction

- DA choice:
- Poto reaction:

## Track Plan

- Drums:
- Bass:
- Harmony:
- Lead:
- Texture:

## MCP Verification

- Command:
- Result:
- Notes:

## Computer Use Review

- Environment:
- Result:
- Screenshots:
- Human confirmations:

## Next Move

-
```
