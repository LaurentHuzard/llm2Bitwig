# Beat Twin Roadmap

Last updated: 2026-05-08

## Summary

Beat Twin is an active Bitwig MCP proof of concept. Its goal is to let AI agents inspect and control Bitwig Studio through MCP tools, a Bitwig controller script, and an ear-service audio analysis layer.

This file is the canonical roadmap entry point. It summarizes the current direction and points to the detailed planning documents instead of replacing them.

## Canonical References

- `README.md`: architecture, setup, MCP tool surface, and run commands
- `STATUS.md`: current status, verification baseline, and active risks
- `PROJECT_SUMMARY.md`: short project assessment
- `docs/task.md`: current Orbit Loop task and recent task history
- `docs/semantic-audio-backlog.md`: semantic audio analyser backlog
- `docs/complete_implementation_roadmap.md`: broad Bitwig API implementation roadmap
- `docs/BEAT_TWIN_PASS_2026-04-27.md`: last broader audit trail

## Current Direction

Keep Beat Twin honest as an advanced prototype, not a polished product repo. The useful center is:

- Java MCP server direction in `server-mcp-java/`
- Bitwig controller script in `bitwig-controller/controller-mcp.ts`
- growing transport, track, browser, hardware, and MIDI/OSC tool coverage
- `ear-service/` for audio and semantic analysis tools
- E2E validation that separates deterministic MCP checks from optional desktop/Computer Use review

## Milestones

### Milestone 0: Stabilize The Canonical Shape

- [ ] Decide the branch/mainline strategy for `feat/phase-2-hardware-integration`.
- [ ] Choose and document the default MCP backend: Java first, TypeScript legacy, or another explicit split.
- [ ] Classify top-level surfaces as active, legacy, generated, archived, or experimental.
- [ ] Record host-level socket test results outside the sandbox.

### Milestone 1: Deepen Bitwig Control

- [x] Core transport, track, browser, mixer, hardware, MIDI, OSC, arranger, and cue-marker tool coverage exists.
- [ ] Implement remaining hardware display support.
- [ ] Implement deeper browser/session tooling.
- [ ] Expand device parameter and automation coverage.
- [ ] Add or refresh a small happy-path smoke script: create track, set tempo, launch/stop transport, read state.

### Milestone 2: Mature Ear And Semantic Audio

- [x] Keep `ear-service/` as the current FastAPI audio analysis backend.
- [x] Extract deterministic semantic analysis into importable modules.
- [x] Add fixture tests for semantic analysis and uploaded-file helper behavior.
- [ ] Add a dedicated semantic vocabulary document.
- [ ] Add human tag correction storage.
- [ ] Decide whether semantic analysis remains in `ear-service/` or moves to a future `semantic-service/`.

### Milestone 3: Agentic Composition E2E

- [x] Document the multi-agent composition workflow.
- [x] Split deterministic MCP verification from optional desktop review.
- [ ] Run `BITWIG_REAL_E2E=1` against a host Bitwig session.
- [ ] Provide local desktop command bindings for screenshot/action review on the target machine.

## Near-Term Tickets

- Run `pnpm run typecheck` after docs-only changes to confirm no tooling drift.
- Run Python semantic tests with the available local environment when touching `ear-service/`.
- Update `STATUS.md` after any host-level Bitwig or socket-bound verification.
- Keep cleanup scoped: avoid deleting legacy surfaces until their ownership is documented.
