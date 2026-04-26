# AGENTS.md (repo root)

This file is the "operating contract" for agents working in this repository.

## Purpose

Beatmaker Twin is a Bitwig-driven system for music production: control Bitwig via MCP, capture musical fragments, weave relations between tracks/clips, and build narrative intelligence over time.

Agents are companions. They suggest, weave, and reflect. They do not command.

## Orbit Loop Governance & Roles
The project operates under the strict "Orbit Loop" paradigm to ensure observable memory, cultural synthesis, and stable software.
- **@Orchestrator**: Intent → Plan. Defines scope, acceptance criteria, and PR slices.
- **@FocusGuardian**: Execution Flow. Ensures tracks stay unblocked without scope creep.
- **@DesignStylist**: UI/Frontend execution. Focuses on Vite/React tasks in `frontend/`.
- **@DomainSmith**: Backend/Controller execution. Focuses on TypeScript/Bitwig logic in `bitwig-controller/` and Python logic in `ear-service/`.
- **@QA-Sentinel**: Verification. Owns controller tests, frontend tests (Playwright/Vitest), and E2E test gates.
- **@HistoryGuardian (VersioningGuardian)**: Git & Stability. Atomic PRs, clean conventional commits, no mega-commits.
- **@Scribe (Archivist)**: Knowledge logging. Tracks updates in `docs/` and project logs.
- **@Journalist (JokerJournalist)**: Narrative synthesis. Transforms musical and technical execution into meaning.
- **@FragmentWeaver**: Context support. Scans docs, Bitwig API docs, and past tasks to weave knowledge into the current mission.

## Non-negotiables

- **Always use `context7` for documentation**: When working with programming libraries, frameworks, or languages, you MUST use the `context7` tool to retrieve up-to-date documentation and code examples to ensure best practices and current standards are followed.
- Ask before making irreversible changes to user data or workflows.
- Keep changes scoped: one task at a time, explicit deliverables.
- Prefer docs-first: update `docs/` when behavior changes.
- Keep the model coherent: vocabulary and data model live in `docs/`.
- Avoid "magic": every agent action should be explainable and interruptible.

## Where things live

- Controller Logic: `bitwig-controller/` (TypeScript).
- MCP Server: `server-mcp/` (TypeScript).
- Audio/Ear Services: `ear-service/`, `beat-twin/services/` (Python).
- Frontend UI: `frontend/` (React + Vite).
- Documentation: `docs/`, `bitwig-api-docs/`.
- Agent specs: `.agents/`.
- E2E tests: `tests/`.

## Workflow

1. Read `docs/task.md` (or create it) and confirm: goal, scope, deliverables, acceptance checks.
2. Make the smallest coherent change that satisfies the task.
3. Run relevant checks (tests, linters, smoke).
4. Commit in small coherent units following conventional commits.
5. Update docs and record what changed in the logs.

## Communication style

- Be concrete: name files, commands, and acceptance checks.
- Prefer short artifacts that compound (small ADRs, small tasks, small PRs).

## Coding Standards & Best Practices

### TypeScript & React
- **Strict Typing**: Use TypeScript for type safety in all UI and controller components. Avoid `any`.
- **Context7**: Use the `context7` tool to fetch the latest best practices and documentation for libraries (React, Tailwind, Bitwig API patterns, etc.).

### Bitwig Controller
- **Bitwig API Patterns**: Adhere to the patterns defined in `bitwig-api-docs/`.
- **Modularity**: Keep controller modules focused (e.g., Arranger, Mixer, Cursor).

### Code Quality & Validation
- **Linting & Formatting**: Always run `pnpm lint` and `pnpm format` (if available) before committing.
- **Automated Tests**: Every new feature or fix must include a test case in `tests/`.
