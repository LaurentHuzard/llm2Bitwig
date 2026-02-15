# Implementation Plan: MCP Compliance Upgrade (Resources & Prompts)

**Status**: [ ] Draft / [ ] Review / [ ] Approved
**Owner**: Planner / Implementer
**Date**: 2026-02-11

## Goal
Implement **Resources** and **Prompts** support in the Bitwig MCP Server. This will allow LLMs to passively read the project state and use pre-defined templates for common tasks, significantly improving the "agentic" experience and compliance with the full MCP specification.

## Proposed Changes

### 1. Server-Side (`server-mcp/index.ts`)

#### 1.1 Import New Schemas
Add imports for:
-   `ListResourcesRequestSchema`
-   `ReadResourceRequestSchema`
-   `ListPromptsRequestSchema`
-   `GetPromptRequestSchema`

#### 1.2 Implement Resource Handlers
-   **`ListResourcesRequestSchema`**: Return a list of available resources:
    -   `bitwig://project`: Project overview (Transport, Meta).
    -   `bitwig://tracks`: List of all tracks in the current bank.
    -   `bitwig://devices`: List of devices on the currently selected track.
-   **`ReadResourceRequestSchema`**:
    -   Handle `bitwig://project`: Call `project.get_summary` (existing RPC) -> Return JSON string.
    -   Handle `bitwig://tracks`: Call `track.list` (existing RPC) -> Return JSON string.
    -   Handle `bitwig://devices`: Call `device.list` (existing RPC) -> Return JSON string.

#### 1.3 Implement Prompt Handlers
-   **`ListPromptsRequestSchema`**: Return a list of prompts:
    -   `explain_project`: "Explain the structure and state of this project."
    -   `analyze_track`: "Analyze the currently selected track and its devices."
-   **`GetPromptRequestSchema`**:
    -   Handle `explain_project`:
        -   Fetch `project.get_summary` and `track.list` from Bitwig.
        -   Construct a `user` message embedding this data as context.
        -   Return `messages`.
    -   Handle `analyze_track`:
        -   Fetch `track.selected.get_status` and `device.list` from Bitwig.
        -   Construct a `user` message with this data.
        -   Return `messages`.

### 2. Controller-Side (`bitwig-controller/controller-mcp.ts`)
*No changes required.* The existing RPC methods (`project.get_summary`, `track.list`, etc.) are sufficient.

## Verification Plan

### Automated Tests
1.  Create `tests/test_compliance.ts` (using the MCP Client/Inspector approach).
2.  Test `resources/list` -> Verify `bitwig://project` exists.
3.  Test `resources/read` -> Verify content is valid JSON.
4.  Test `prompts/list` -> Verify `explain_project` exists.
5.  Test `prompts/get` -> Verify it returns a populated message.

### Manual Walkthrough
1.  Connect via `mcp-inspector` or Claude Desktop.
2.  Check the "Resources" tab -> Click to read `bitwig://project`.
3.  Check the "Prompts" tab -> Run `explain_project`.

## Risk Assessment
-   **Low Risk**: This is purely additive to the MCP Server. Existing tools will function as before.
-   **Latency**: Fetching data for prompts might take a few milliseconds, but `callBitwig` is fast (local TCP).

## Definition of Done
-   [ ] `server-mcp/index.ts` implements Resource and Prompt handlers.
-   [ ] `tests/test_compliance.ts` passes.
-   [ ] Documentation updated to reflect new capabilities.
