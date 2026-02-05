# Implementation Plan: TypeScript Refactor

## Goal
Refactor the Node MCP server and related scripts to TypeScript while preserving runtime behavior and CLI usage.

## User Review (Breaking Changes / Decisions)
- Confirm scope: convert only the MCP server and tests, or also the Bitwig controller extension in `bitwig-controller/`.
- Decide runtime: compile to `dist/` and run with `node`, or use a TS runtime (`tsx`/`ts-node`) in development only.
- Decide output locations: keep CLI entry at `dist/index.js` and, if converting controller code, keep `.control.js` outputs in `bitwig-controller/BitwigPOC/`.
- Confirm module system: keep ESM (`"type": "module"`) with `moduleResolution: "nodenext"`.

## Files to Add / Modify
- Add: `tsconfig.json`
- Add: `src/index.ts` (new TS entry, replaces `index.js`)
- Add (optional): `tsconfig.build.json` or `tsconfig.tests.json` if we split build/test settings
- Modify: `package.json` (scripts, devDependencies, bin/main if needed)
- Modify: `README.md` (build/run instructions)
- Modify: `tests/*.js` and root `test_*.js` to `.ts` (if tests are in scope)
- Modify (optional): `bitwig-controller/BitwigPOC/*.control.js` via TS source build

## Plan (Detailed Steps)
1) Tooling and config
   - Add TypeScript dev dependencies (`typescript`, `@types/node`, and a TS runner like `tsx`).
   - Create `tsconfig.json` with ESM + NodeNext settings, `rootDir: "src"`, `outDir: "dist"`, `target: "ES2022"`, `module: "NodeNext"`, `moduleResolution: "NodeNext"`, `resolveJsonModule: true`, `esModuleInterop: true`, `preserveShebang: true`.
   - Add scripts: `build`, `typecheck`, `dev`, and `start` (pointing to `dist/index.js`).

2) Server entry migration
   - Move `index.js` to `src/index.ts`.
   - Add explicit types for the TCP client, request/response payloads, and pending request map.
   - Keep behavior identical (connection lifecycle, JSON-RPC framing, tool registry).
   - Ensure shebang preserved for CLI usage.

3) Tests and scripts migration (if in scope)
   - Convert `tests/*.js` and root `test_*.js` to `.ts`.
   - Update imports to use TS pathing and/or compiled output as appropriate.
   - Decide whether tests run against TS source (via `tsx`) or against compiled JS.

4) Bitwig controller extension (optional)
   - If converting, create `bitwig-controller/src/*.ts` sources.
   - Add a small build step that outputs `.control.js` in `bitwig-controller/BitwigPOC/` for Bitwig to load.
   - Keep runtime behavior identical; no API changes.

5) Documentation and cleanup
   - Update `README.md` with new build and run commands.
   - Remove or archive any obsolete JS entrypoints if no longer used.

## Verification Steps (Tester)
- `pnpm run typecheck`
- `pnpm run build`
- Run a quick smoke test: `node dist/index.js` (expect MCP server to start and wait on stdio)
- If tests are in scope: run existing test scripts via the chosen runner.

## Notes / Risks
- Bitwig controller extensions require `.control.js` files; TypeScript must compile to that exact format/location.
- ESM + NodeNext settings can surface import path issues; be ready to add explicit file extensions.
