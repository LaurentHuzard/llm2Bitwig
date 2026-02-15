# Current Task: Creative Note & Audio Tools (Phase 4)

**Status**: Completed
**Owner**: Implementer

## Context
Phase 4 successfully implemented the `NoteInput` module, allowing the MCP server to inject MIDI events into Bitwig.

## Objectives
1.  **Implement NoteInput Module**: allow injecting MIDI notes into Bitwig.
2.  **MCP Integration**: Add tools for note on/off and raw MIDI.
3.  **Verification**: Verify note injection works.

## Roadmap
1.  **Types**:
    -   [x] Update `bitwig.d.ts` with `MidiIn` and `NoteInput`
2.  **Controller Implementation**:
    -   [x] Create `bitwig-controller/modules/NoteInput.ts`
    -   [x] Register module in `controller-mcp.ts`
3.  **MCP Server Implementation**:
    -   [x] Add `note_*` tools to `server-mcp/index.ts`
4.  **Verification**:
    -   [x] Create `tests/test_notes.ts`
    -   [x] Run tests

## Progress
-   [x] NoteInput Module
-   [x] Server Tools
-   [x] Verification Script
