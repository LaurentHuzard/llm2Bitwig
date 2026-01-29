# Implementation Plan - Finish MCP for LLM Support

## Goal Description
Complete the MCP toolset to allow LLM agents to fully control Bitwig Studio, specifically focusing on content creation (browsing/inserting) and transport control. This bridges the gap between "controlling existing parameters" and "creating new sounds/arrangements".

## User Review Required
> [!IMPORTANT]
> **Browser Integration Strategy**: We will implement a `BrowserModule` that wraps Bitwig's `host.createPopupBrowser()`. The LLM will interact with it blindly (List results -> Select -> Commit).
> **Latency**: Browsing is asynchronous. The LLM must wait for the browser to open and results to load. We might need a "browser_wait_for_ready" tool or rely on events.

## Proposed Changes

### Controller Script (Backend)

#### [NEW] [modules/Browser.js](file:///home/taenia/Code/bitwig-mcp-poc/bitwig-controller/BitwigPOC/modules/Browser.js)
implement `BrowserModule`:
- `browser.exists()`: Observe if browser is open.
- `browser.list_results()`: Return first N items in current result list.
- `browser.select_index(i)`: Select specific item in result list.
- `browser.commit()`: Confirm selection (Insert).
- `browser.cancel()`: Close browser.
- `browser.set_filter(text)`: Set search query (if possible via API).

#### [MODIFY] [modules/Transport.js](file:///home/taenia/Code/bitwig-mcp-poc/bitwig-controller/BitwigPOC/modules/Transport.js)
- Add `transport.toggle_metronome`
- Add `transport.time_signature` (get/set)

#### [MODIFY] [BitwigPOC.control.js](file:///home/taenia/Code/bitwig-mcp-poc/bitwig-controller/BitwigPOC/BitwigPOC.control.js)
- Register `BrowserModule`.

### MCP Server (Node.js)

#### [MODIFY] [index.js](file:///home/taenia/Code/bitwig-mcp-poc/index.js)
- Register new tools:
    - `browser_get_status` (is open?)
    - `browser_list_results`
    - `browser_select_result`
    - `browser_commit`
    - `browser_cancel`
    - `transport_toggle_metronome`
    - `transport_set_time_signature`

## Verification Plan

### Automated/Manual Verification
1.  **Transport**:
    - Call `transport_toggle_metronome` -> Verify click in Bitwig.
    - Call `transport_set_time_signature` -> Verify transport bar in Bitwig.
2.  **Browser Flow**:
    - Select a track.
    - Call `device_browse_replace` (opens browser).
    - Call `browser_get_status` (should be true).
    - Call `browser_list_results` (should return list of presets/devices).
    - Call `browser_select_result` (highlight changes).
    - Call `browser_commit` (browser closes, device loads).
