# Task: server-mcp-java cleanup baseline

## Goal
Stabilize the Java MCP module layout so only active source paths remain and local workflow metadata exists.

## Scope
- Remove accidental duplicate nested source tree under `server-mcp-java/server-mcp-java/`.
- Add module-level ignore rules for Gradle/build artifacts.
- Add a local task document for execution tracking.

## Deliverables
- Duplicate nested folder removed.
- `.gitignore` added in this module.
- `docs/task.md` added in this module.

## Acceptance checks
- `[ ! -d ./server-mcp-java ]` confirms the duplicate nested directory is absent.
- `.gitignore` exists and includes `/.gradle/` and `/build/`.
- `./gradlew test` succeeds.
