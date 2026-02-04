# Workflow: The Tribal Ritual

The Tribe operates in a phased lifecycle known as the **Forced Delivery Ritual**.

## 🔄 Core Loop

1.  **Initialization (Orchestrator)**
    - User request is received.
    - Orchestrator updates `task.md`.

2.  **Planning (Long Shadow)**
    - **Planner** creates/updates `implementation_plan.md`.
    - Verification Plan is defined.
    - **GATE**: User approves the Plan.

3.  **Construction (Guerilla Ninja)**
    - **Implementer** executes the plan.
    - Focus on visible, testable features.
    - Feature flags used for safety.

4.  **Sealing (Black Hammer)**
    - **Tester** verifies the build.
    - **Refactorer** cleans up *after* verification if needed.
    - **GATE**: Tests pass.

5.  **Harvest (Alien Agronomists)**
    - **Tech Writer** updates docs.
    - **Journalist** writes the report.
    - **Orchestrator** marks tasks as DONE and notifies User.

## ⚠️ Critical Rules
- **No Skipping**: You cannot Build without a Plan. You cannot Harvest without Sealing.
- **Artifacts**: Every phase produces artifacts (Code, Tests, Docs).
- **Failure**: If a phase fails, go back one step. (e.g., If Testing fails, go back to Construction).
