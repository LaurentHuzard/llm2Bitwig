# Implementation Plan - Bundle Bitwig Controller into Single File

## Goal Description
Ensure the Bitwig controller build emits a single, bundled `controller-mcp.js` that Bitwig can load directly without `load("modules/…")` invocations.

## Scope
- Align `build:controller` script to produce the checked-in entry point instead of a separate `dist/` artifact.
- Regenerate `bitwig-controller/controller-mcp.js` from `controller-mcp.ts` with the ES module imports bundled inline.
- Keep the TypeScript sources and shared types untouched; the change is to build outputs and scripts.

## Files to Modify / Inspect
- `package.json` (`scripts.build:controller`).
- `bitwig-controller/controller-mcp.ts` (validate existing imports, no edits planned).
- `bitwig-controller/dist/controller-mcp.js` (new artifact) and `bitwig-controller/controller-mcp.js` (checked-in bundle after build).

## Implementation Steps
1. Run `pnpm run build:controller` as currently defined to review the generated bundle at `bitwig-controller/dist/controller-mcp.js` and confirm it contains all modules inline with no `load()` calls.
2. Update `package.json` so `build:controller` writes directly to `bitwig-controller/controller-mcp.js` (optionally still writing a secondary copy) to guarantee the checked-in entry point always matches the bundle Bitwig uses.
3. Re-run the revised build script to regenerate `bitwig-controller/controller-mcp.js` and verify that the file is a single IIFE bundle without module imports.
4. Document the expectation (e.g., in `README.md` or a controller note) that Bitwig should load `bitwig-controller/controller-mcp.js` and that running `pnpm run build:controller` refreshes that file.

## Verification Steps
1. `pnpm run build:controller` (after script change) to produce `bitwig-controller/controller-mcp.js` and ensure it contains the bundled modules and no `load()` statements.
2. Inspect `bitwig-controller/controller-mcp.js` for a `load()` call and confirm the same entry point is what Bitwig ships; note the required build command in the README or controller notes.
