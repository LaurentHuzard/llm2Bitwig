# Bitwig Controller Architecture

> Note: This architecture doc is historical. It references legacy controller names/paths (`BitwigPOC.control.js`, `bitwig-controller/BitwigPOC/*`); current bundled controller file is `bitwig-controller/controller-mcp.js`.

This document describes the internal architecture of the **Bitwig Controller Script** (`BitwigPOC.control.js`) which serves as the bridge between the Bitwig API and the MCP Server.

## 🏗 Modular Design

To maintain manageability as the feature set grows, the controller is split into functional **Modules**. The main script acts as a kernel that manages the TCP connection and routes requests to the appropriate module.

### File Structure
```
bitwig-controller/
└── BitwigPOC/
    ├── BitwigPOC.control.js  # Entry point & Connection Manager
    └── modules/              # Feature Modules
        ├── Transport.js      # Playback, Tempo, Loops
        ├── TrackBank.js      # Tracks, Clips, Scenes, Mixer
        ├── Cursor.js         # Selected Track & Device Control
        └── Application.js    # Project level commands
```

---

## 🧩 The Module Pattern

Bitwig's JavaScript API uses an ES5-like environment. We use the `load()` function to include separate files.

Each module implements a simple interface:

1.  **Constructor**: Initializes specific Bitwig API objects (e.g., `host.createTransport()`) and marks "interested" observers.
2.  **`handleRequest(method, params)`**: Process an MCP tool call.

### Example Module (`modules/ExampleModule.js`)
```javascript
function ExampleModule(host) {
    this.transport = host.createTransport();
    // Mark observers
    this.transport.isPlaying().markInterested();
}

ExampleModule.prototype.handleRequest = function(method, params) {
    switch (method) {
        case "example.action":
            // Do something
            return "Result";
        default:
            return undefined; // Not handled by this module
    }
};
```

---

## 📡 Request Routing

When the MCP Server sends a JSON-RPC command:

1.  **`BitwigPOC.control.js`** receives the raw bytes via TCP.
2.  Parses the JSON `request`.
3.  Iterates through the registered `modules` array.
4.  Calls `handleRequest` on each module.
5.  **First module** to return a non-undefined value "wins".
6.  The result is sent back as a JSON-RPC response.

### Adding a New Feature
To add a new set of capabilities (e.g., "Browser Control"):

1.  Create `modules/Browser.js`.
2.  Implement the class and handlers.
3.  In `BitwigPOC.control.js`:
    ```javascript
    load("modules/Browser.js");
    // ... inside init()
    modules.push(new BrowserModule(host));
    ```

---

## 🔌 Connection Handling

The `BitwigPOC.control.js` handles:
- **TCP Server**: Listens on port `8888`.
- **Handshake**: Tracks `isConnected` state.
- **Error Handling**: Catches JSON parse errors or module execution errors and returns standard JSON-RPC error codes.
