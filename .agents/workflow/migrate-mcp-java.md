---
description: Agentic workflow for migrating the MCP Server from TypeScript to Java
---

# Migrate MCP Server to Java

This workflow adapts the "Agentic System Orca" methodology to our local **Orbit Loop** governance to safely and efficiently migrate `server-mcp/` from TypeScript to Java. As the agent, you will act out these personas in sequence to complete the migration.

## Phase 1: The Conceptual War Room (@Orchestrator + @QA-Sentinel)

Before writing any code, we establish the architecture and identify risks.

1. **The Architect (Sensei Constraint):** 
   - Analyze the current `server-mcp/` logic.
   - Define a SOTA (State of the Art) Java architecture. Use `context7` to fetch the best Java libraries for JSON-RPC, standard I/O streaming, and the MCP protocol.
   - Keep it "as simple as possible."
2. **The Joker (Edge Cases):** 
   - Challenge the proposed Java architecture. Identify hidden risks (e.g., differences in async handling/promises vs. Java CompletableFuture, JSON serialization quirks, or Bitwig connection drops).
3. **The Scribe:** 
   - Summarize the consensus into `docs/implementation_plan.md`.

## Phase 2: Task Generation (@Scribe)

Translate the conceptual plan into an actionable `docs/task.md`.

- Break the implementation into **Atomic Tasks** (small enough for single commits).
- For each task, define the **Definition of Done** (Happy Path + Edge Case test).

## Phase 3: TDD Execution Loop (@DomainSmith)

For each task in `docs/task.md`, execute the strict "Resilient Agentic Implementation Flow":

1. **Analyze Code:** Review the specific TS logic to be ported.
2. **Add Happy Path Test:** Write the JUnit/TestNG test first.
3. **Implement Code:** Write the Java code.
4. **Local Verify:** Compile and run tests (e.g., `./gradlew test` or `mvn test`).
   - *If Red:* Fix the code.
   - *If Green:* Proceed to edge cases.
5. **Add Edge Case Test:** Consider what The Joker would break and write a test for it.
6. **Commit:** Use **@HistoryGuardian** to make a small, conventional commit.

## Phase 4: The Quality Gate (@QA-Sentinel + @HistoryGuardian)

Act as the "Git Keeper" and "Call Saul" pre-merge audit.

Review your own work by asking:

- **Technical:** Is the history clean? Does the code follow the conceptual design? Are there code smells? Are both Happy Path and Edge Case tests present and green?
- **Compliance/Safety:** Is logging secure? Is error handling graceful for the MCP protocol? Did we preserve full parity with the old TS server?

## Phase 5: The Journalist Interview (@Journalist + @Scribe)

Once a major module or the full migration is complete, document the "return of experience" (REX).

- **Scribe:** Update the main `docs/` and `README.md` with the new Java build/run instructions.
- **Journalist:** Create a Field Report in `docs/diary/` using The Journalist template:
  - **The Narrative:** What was ported and how did it go?
  - **The Performance:** Happy paths achieved and walls hit during the TS-to-Java translation.
  - **Key Learning & REX:** Actionable advice and post-mortem optimizations for the future.
