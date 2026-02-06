# Implementation Plan - Bitwig Controller TypeScript Modernization

## Goal Description
Rewrite `bitwig-controller/*` to idiomatic TypeScript using `const`/`let`, explicit types, and ES module imports/exports while preserving current runtime behavior and Bitwig compatibility.

## Roadmap Alignment
This aligns with the controller bridge work in **Task 2** of `docs/bitwig-mcp-controller-roadmap.md`, improving maintainability without changing the MCP tool surface.

## User Review Required
> [!IMPORTANT]
> The following decisions affect controller build/runtime behavior and need explicit confirmation:
> 1. **Module system & bundling**: Use ES module source with a bundler (e.g., `esbuild`) to emit a single `controller-mcp.js`, or keep multi-file outputs and use `load()` to stitch them at runtime?
> 2. **Output location**: Keep compiled JS in `bitwig-controller/` (checked in), or emit to a `bitwig-controller/dist/` folder and copy/symlink for Bitwig?
> 3. **Bitwig global typing**: Add a minimal ambient `bitwig-controller/types/bitwig.d.ts` with only required APIs, or a broader surface from docs?

## Scope
### In-scope
- `bitwig-controller/controller-mcp.ts`
- `bitwig-controller/modules/*.ts`
- New `bitwig-controller/tsconfig.json`
- New `bitwig-controller/types/bitwig.d.ts` (ambient Bitwig globals)
- Update `package.json` controller build script if required

### Out-of-scope (unless requested)
- Server, frontend, and tests refactors
- Any MCP tool behavior changes
- Bitwig API feature expansion

## Files to Modify / Add (Expected)
### Controller
- `bitwig-controller/controller-mcp.ts`
- `bitwig-controller/modules/Application.ts`
- `bitwig-controller/modules/Browser.ts`
- `bitwig-controller/modules/Clip.ts`
- `bitwig-controller/modules/Cursor.ts`
- `bitwig-controller/modules/Device.ts`
- `bitwig-controller/modules/Mixer.ts`
- `bitwig-controller/modules/SceneBank.ts`
- `bitwig-controller/modules/TrackBank.ts`
- `bitwig-controller/modules/Transport.ts`
- `bitwig-controller/tsconfig.json` (new)
- `bitwig-controller/types/bitwig.d.ts` (new)

## Implementation Steps (Implementer)
1. **Controller build setup**
   - Add `bitwig-controller/tsconfig.json` with strict settings aligned to the repo base.
   - Decide on module output strategy (bundled single file vs. `load()` with multi-file output).
   - Update `package.json` `build:controller` to use the chosen build pipeline.

2. **Introduce shared types and contracts**
   - Create `bitwig-controller/types/bitwig.d.ts` for `host`, `loadAPI`, `load`, `println`, `RemoteConnection`, and any API used by modules.
   - Add a `ControllerModule` interface (`handleRequest(method, params)` signature).
   - Define shared `RequestParams`/`RequestResult` types as needed.

3. **Module refactor to ES modules**
   - Convert each module to `export class ...` with explicit constructor types.
   - Replace `var` with `const`/`let`.
   - Replace global dependencies (like `sendEvent`) with imported helper or injected callback.
   - Keep behavior identical; avoid changing message formats or tool names.

4. **Controller entry refactor**
   - Replace `load()` usage with `import { ... } from "./modules/..."` in `controller-mcp.ts` (or keep `load()` only if bundling is not approved).
   - Type `modules` array and all request/response handling helpers.
   - Remove `// @ts-nocheck` once types are in place.

5. **Compile and verify outputs**
   - Ensure emitted JS remains compatible with Bitwig’s controller runtime.
   - Check in compiled JS outputs if required for Bitwig usage.

## Verification Steps (Tester)
1. `pnpm run build:controller` and confirm expected JS output(s) exist.
2. Load controller in Bitwig and verify it starts without errors.
3. Run a quick MCP smoke test (ping + transport_play/stop) to confirm tool routing.

## Risks / Notes
- Bitwig controller runtime does not support Node/CommonJS by default; bundling strategy must ensure compatibility.
- ES module syntax in TS requires a build step that removes imports for Bitwig’s runtime.
