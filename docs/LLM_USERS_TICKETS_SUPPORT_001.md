# Support Ticket: LLM_USERS_TICKETS_SUPPORT_001

> Note: This support ticket is historical and may reference legacy controller paths (`bitwig-controller/BitwigPOC/*`).

**Date:** Friday, 30 January 2026
**Agent:** Gemini CLI Agent
**Status:** Open
**Priority:** Medium
**Topic:** Bug in `browser_set_filter` and `PopupBrowser` implementation

## 1. Problem Summary
While attempting to add specific instruments to tracks using the Bitwig MCP, the `browser_set_filter` tool failed with a script error. Additionally, opening the browser on empty tracks using `device_browse_insert_after/before` did not appear to function as expected.

## 2. Technical Details

### Error Message
```
Error: Error processing browser.set_filter: TypeError: invokeMember (filterColumn) on com.bitwig.flt.control_surface.proxy.PopupBrowserProxy failed due to: Unknown identifier: filterColumn
```

### Context
- **Tool Called:** `browser_set_filter({ text: "808 kit" })`
- **Location in Code:** `bitwig-controller/BitwigPOC/modules/Browser.js`
- **Current Implementation:**
  ```javascript
  case "browser.set_filter":
      if (params && params[0] !== undefined) {
          this.popupBrowser.filterColumn(0).getWildcardFilter().setValue(params[0]);
          return "OK";
      }
      return "Missing filter text parameter";
  ```

## 3. Root Cause Analysis
1.  **API Mismatch:** According to `bitwig-api-docs/PopupBrowser.md`, the `PopupBrowser` interface does not expose a generic `filterColumn(index)` method. It uses named methods like `smartCollectionColumn()`, `deviceColumn()`, `categoryColumn()`, etc.
2.  **Missing Global Search:** There is currently no clear way in the `Browser.js` module to set the global "Search" text field found in the Bitwig Popup Browser UI.
3.  **Empty Track Insertion:** `device_browse_insert_after` calls `cursorDevice.browseToInsertAfterDevice()`. On a newly created (empty) track, `cursorDevice.exists()` is `false`, which seems to prevent the insertion point from being valid, thus the browser never opens.

## 4. Suggested Fixes
- **Browser Filter:** Update `Browser.js` to use a valid method for filtering. If a global search isn't directly available on `PopupBrowser`, consider filtering a specific column (e.g., `deviceColumn()` or `smartCollectionColumn()`) if that aligns with the user's intent.
- **Empty Track Handling:** Implement a tool or logic to handle "first device" insertion on empty tracks, perhaps using `cursorTrack.createCursorDevice().beforeDeviceInsertionPoint().browse()` or targeting the track's primary device chain directly.
- **API Verification:** Verify if `filterColumn` exists in the specific version of the Bitwig API being targeted; otherwise, replace it with the documented named column accessors.

## 5. Reproduction Steps
1. Create a new instrument track: `application_create_instrument_track`.
2. Select the track: `track_bank_select({ index: X })`.
3. Try to insert a device: `device_browse_insert_after`.
4. Observe that `browser_get_status` returns `exists: false`.
5. If the browser were to open, calling `browser_set_filter({ text: "test" })` triggers the `TypeError`.
