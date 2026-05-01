# Current Orbit Loop Task: Semantic Audio Analysis Dev Slice

## Goal

Continue the audio analyser feature so Beat Twin can classify sample-like audio, expose mood/vibe/genericness readings, and keep the implementation testable before optional model dependencies arrive.

## Scope

- Keep live capture in `ear-service/main.py`.
- Move deterministic analysis into importable modules.
- Add fast Python fixtures for instrument, mood, and upload-file behavior.
- Preserve the semantic response contract used by `/audio`.
- Record the slice in the semantic backlog and Orbit Loop report.

## Deliverables

- `ear-service/analysis_core.py`
- `ear-service/file_analysis.py`
- `tests/test_semantic_analysis.py`
- `tests/test_ear_service_routes.py`
- `docs/reports/semantic-audio-orbit-loop-2026-04-29.md`
- Updated `docs/semantic-audio-backlog.md`

## Acceptance Checks

- Python modules compile.
- Semantic fixture tests pass.
- Uploaded-file helper tests pass without importing the live audio capture app.
- Frontend typecheck, lint, and build still pass for the `/audio` UI.
- Remaining uncertainty is documented rather than hidden.

---

# Previous Task: Agentic Bitwig Composition E2E

## Goal

Build a real Beat Twin workflow where agents brainstorm a track, split musical responsibilities, drive Bitwig through MCP, and validate the final composition with both deterministic MCP checks and a Computer Use visual/auditory review pass.

## Scope

- Define a reusable agentic composition workflow for Bitwig sessions.
- Keep the workflow compatible with the existing Orbit Loop roles.
- Specify musical subagents for different instruments and production concerns.
- Define the E2E validation layers:
  - MCP assertions for project state, tracks, clips, names, colors, and devices.
  - Computer Use as a supervised final-review layer for the visible Bitwig project.
- Keep irreversible actions human-gated: saving over user projects, deleting tracks outside the test namespace, exporting, publishing, or overwriting files.

## Deliverables

- `docs/agentic-bitwig-composition-workflow.md`
- `.agents/workflow/agentic-bitwig-composition.md`
- `docs/task.md`
- `tests/e2e_bitwig_composition.ts`
- `tests/ComputerUseReview.ts`

## Acceptance Checks

- The workflow names each agent role, its inputs, its outputs, and its allowed Bitwig actions.
- The E2E path separates deterministic MCP verification from Computer Use review.
- The test session uses a safe namespace such as `BT_E2E_*` for tracks, clips, scenes, and markers.
- The final review has a pass/fail rubric that can be logged by QA-Sentinel.

## Open Implementation Work

- Run the real host-level E2E test script against Bitwig with `BITWIG_REAL_E2E=1`.
- Provide local desktop commands for `BITWIG_CUA_SCREENSHOT_CMD` and `BITWIG_CUA_ACTION_CMD`.
- Decide whether the active MCP backend for this workflow is `server-mcp/` TypeScript or `server-mcp-java/`.
