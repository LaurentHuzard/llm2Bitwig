# Beat Twin Pass - 2026-04-27

## Purpose

Beat Twin is the active Bitwig MCP proof of concept: a local bridge that lets an AI agent control Bitwig Studio through MCP tools, a controller script, and a server-side relay.

This pass treats the project as worth keeping, but not yet clean enough to call a stable product repo. The useful core is the Bitwig controller/API bridge, the Java MCP server direction, and the growing transport/track/browser test surface.

## Current Branch

- Working branch: `beat-twin-audit-roadmap`
- Base branch when created: `feat/phase-2-hardware-integration`
- Remote: `origin git@github.com:LaurentHuzard/llm2Bitwig.git`

The next publish step should preserve the current feature branch rather than forcing this directly into `main`. The mainline decision is still a product/cleanup decision.

## Verification

- `pnpm run typecheck`: passed after tightening frontend tool-call typing and mock Bitwig global marker state.
- `pnpm run build:controller`: passed.
- `pnpm run test`: blocked in this sandbox because the suite opens local sockets/pipes and hit `EPERM` on `127.0.0.1:8888`, `0.0.0.0:2625`, and `/tmp/tsx-1000/...`. A host-level run with socket permissions is still required.

## Fixes Applied

- `frontend/src/components/ChatView.tsx`: ignores non-function OpenAI tool calls before reading `toolCall.function`, matching the current OpenAI SDK union types.
- `tests/mock-bitwig.ts`: replaces untyped `global.mockMarkers` access with a typed `globalThis` state shim so strict TypeScript accepts the mock.

## Risks And Mess

- Multiple server surfaces coexist: `server-mcp-java/` appears to be the active direction, while `server-mcp/` remains as legacy TypeScript.
- There are several product shells or archives to classify: `frontend/`, `website/`, nested `beat-twin/`, `WTF-ANTIPASGRAV/`, Gradle zips, `.venv`, and local generated/build outputs.
- The test suite depends on socket binding, so CI or local host verification must be explicit.
- The repo is currently closer to an advanced prototype than a curated tool. That is fine, but the README and roadmap should keep that honesty.

## Next Tickets

1. Decide branch strategy: keep `feat/phase-2-hardware-integration` as the integration lane, or cut a new `main` stabilization branch.
2. Run `pnpm run test` outside the sandbox and record the host-level result.
3. Classify every top-level app/archive directory as active, legacy, generated, or parked.
4. Choose one MCP server default: Java first, with `server-mcp/` explicitly documented as legacy or removed later.
5. Implement device parameter tools for cursor device remotes.
6. Implement clip launcher tools for scene/slot launch, stop, creation, and basic recording.
7. Add a small smoke script for the happy path: create track, set tempo, launch/stop transport, read state.
