# Beat Twin Status

Last updated: 2026-05-08

## Summary

Beat Twin is an active advanced prototype for AI-assisted Bitwig control. It is useful and worth preserving, but still messy: several server surfaces, docs tracks, and product shells coexist while the project converges on a canonical shape.

This file is the canonical status entry point. Use it with:

- `ROADMAP.md` for the current roadmap
- `README.md` for architecture and run commands
- `PROJECT_SUMMARY.md` for a compact assessment
- `docs/task.md` for the active Orbit Loop task
- `docs/status_report.md` as a historical status snapshot

## Current Branch Context

- Observed working branch: `feat/phase-2-hardware-integration`
- The branch appears to remain the active integration lane.
- Do not force this work onto `main` without an explicit product/cleanup decision.

## Working Surfaces

- `server-mcp-java/`: current Java MCP server direction
- `server-mcp/`: legacy TypeScript MCP server retained during transition
- `bitwig-controller/controller-mcp.ts`: Bitwig controller source
- `bitwig-controller/controller-mcp.js`: bundled controller artifact loaded by Bitwig
- `ear-service/`: FastAPI audio and semantic analysis backend
- `tests/`: TypeScript and Python verification surfaces
- `docs/`: planning, semantic-audio, and historical reports

## Current State

- Core MCP coverage exists for transport, track management, browser filtering, mixer, hardware, MIDI/OSC, arranger, cue markers, and state observation.
- Ear-service exposes audio analysis and semantic analysis helpers.
- The semantic audio continuation slice extracted testable analysis modules and added fixture coverage.
- The agentic Bitwig composition workflow is documented, with deterministic MCP checks separated from optional desktop review.

## Verification Baseline

Use these non-destructive checks depending on the touched surface:

```bash
pnpm run typecheck
pnpm run build:controller
```

For Python-only semantic audio changes:

```bash
uv run --directory ear-service --no-sync python -m compileall main.py analysis_core.py file_analysis.py
uv run --directory beat-twin --no-sync python -m compileall services shared
```

The full TypeScript test suite may need host-level socket permissions because it binds local TCP or pipe resources. Real Bitwig E2E also requires a running Bitwig/controller setup and should be recorded in this file when run.

## Open Risks

- Java and TypeScript MCP server paths coexist; the default must remain explicit.
- Some docs are historical snapshots and mention legacy paths.
- Socket-bound tests can be blocked in restricted sandboxes.
- Real Bitwig verification depends on local app state, controller installation, and port availability.
- Top-level archives and experimental surfaces still need classification before any cleanup.

## Next Move

Run the safe docs-only baseline checks, then record any host-level Bitwig/socket verification once it is available.
