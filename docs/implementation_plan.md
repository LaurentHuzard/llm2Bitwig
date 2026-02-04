# Implementation Plan - Expanded Bitwig API Coverage (Multi-Sprint)

## Goal Description
Expand the MCP toolset toward **full Bitwig API coverage** based on `bitwig-api-docs/`, delivered in **phased milestones**. Each tool implementation is committed separately using the format `feat(tool): <tool_name>`. Documentation and a journalist report will be produced at the end of each milestone.

## Scope Reality Check
The Bitwig Controller API is large (hundreds of interfaces). Full coverage requires multiple sprints, new controller modules, and extensive testing. This plan defines the **phased roadmap** and the **tool contract** for each phase.

## User Review Required
> [!IMPORTANT]
> **Per-tool commits** are required after each tool is implemented. Commit message format: `feat(tool): <tool_name>`.
>
> **Phased rollout**: We will deliver in milestones, with a journalist report after each milestone (e.g., `reports/dev-report-03.md`).
>
> **Breaking changes**: Tool names follow the existing MCP naming style (`transport_get_*`, `track_*`, etc.). If you prefer a different naming convention, confirm now.

## Phase Plan (Milestones)

### Phase 0 — Parity + Stability (Short)
**Goal:** Align MCP tools with existing controller capabilities and fix mismatches.
**Tools / Fixes:**
- `transport_get_recording_status` → `transport.getIsRecording`
- `transport_get_time_signature` → `transport.time_signature`
- `browser_set_filter` → `browser.set_filter`
- `device_select_first` / `device_select_last`
- Fix send mapping for `mixer_get_send_level` / `mixer_set_send_level`
- Ensure `BrowserModule` is loaded in `BitwigPOC.control.js`

### Phase 1 — Roadmap Must‑Have Core
**Transport & Timeline**
- Tap tempo, punch in/out, arrange/launcher overdub
- Play-start position, jump, nudges
**Tracks & Mixer**
- Track create (audio/instrument/effect), list, get info
- Track arm/monitor mode, input/output routing
- Track visibility and scrolling
**Selection & State Query**
- Cursor track/device/clip state query tools
- Project state summary (expanded)
**Observability**
- Event stream: transport state, track state, clip state

### Phase 2 — Clip Launcher + Clip Properties
**Clip Launcher**
- Clip properties: name, length, loop start/end, playback position
- Clip stop all, scene navigation helpers
**Clip Content**
- Step editing enhancements (clear row/col, move notes)
- Note expression controls (basic)

### Phase 3 — Device Chain + Browser Assistant
**Device Chain**
- Full device info, insert/replace, bypass, window/minimize
- Parameter get/set, modulation depth
**Browser**
- Filter columns, results list + select + audition
- Preset/sample browser flows

### Phase 4 — Arrangement & Timeline
- Cue markers: create/delete/list
- Arranger view controls (zoom/scroll)
- Automation lanes (basic)

### Phase 5 — Actions & Commands
- `application_actions_list`
- `application_action_invoke`
- Action categories listing

### Phase 6 — Preferences & Settings
- Preferences access
- Document state helpers

### Phase 7 — MIDI / Hardware / OSC (Optional)
- MIDI input/output routing
- OSC server basics
- Hardware surface bindings (lights/displays) for feedback

## Files to Modify (Expected)
1. `server-mcp/index.js` (tool definitions + routing)
2. `bitwig-controller/BitwigPOC/BitwigPOC.control.js`
3. `bitwig-controller/BitwigPOC/modules/*.js` (new modules per phase)
4. `tests/` (new tests per phase)
5. `README.md` and `docs/` (updated tool catalog + usage)

## Implementation Rules
- **Commit after each tool implementation** using: `feat(tool): <tool_name>`.
- If a tool requires multiple files (controller + MCP + tests), implement fully, then commit.
- No destructive changes without explicit approval in plan.

## Verification Plan (Tester)
- Run existing test suite + new phase tests.
- Manual Bitwig verification for UI and browser actions.
- Update `walkthrough.md` after each phase.

## Handover & Comms
After each phase:
1. Tester updates `walkthrough.md`
2. Tech Writer updates `README.md`
3. Journalist publishes milestone report in `reports/`
