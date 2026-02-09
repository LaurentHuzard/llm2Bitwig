# Model Context Protocol (MCP) Cheat Sheet

## 📚 Overview

The **Model Context Protocol (MCP)** is an open standard that enables AI models (clients) to interact with external data and tools (servers). It standardizes how AI agents connect to local or remote resources, replacing fragmented integrations with a unified protocol.

### Architecture
*   **Host**: The application running the LLM (e.g., Claude Desktop, IDE).
*   **Client**: The MCP Client within the Host that initiates connections.
*   **Server**: The MCP Server (e.g., your Bitwig adapter) that exposes Resources, Prompts, and Tools.

---

## 🔌 Core Protocol

*   **Transport**: JSON-RPC 2.0 over `stdio` (local) or `SSE` (remote/HTTP).
*   **Message Format**: Standard JSON-RPC Request/Response/Notification.

### Initialization Handshake
1.  **Client sends**: `initialize` with protocol version and capabilities.
2.  **Server responds**: `initialize` result with server capabilities and info.
3.  **Client sends**: `notifications/initialized`.

---

## 🛠 Server Capabilities

### 1. Resources (Read Data)
Expose data like files, database records, or API responses as content.

*   `resources/list`: List available resources.
    *   *Returns*: `resources` (array of `uri`, `name`, `mimeType`).
*   `resources/read`: Get the content of a specific resource.
    *   *Params*: `uri`.
    *   *Returns*: `contents` (list of text/blob chunks).
*   `resources/templates/list`: List dynamic URI templates (e.g., `file:///{path}`).
*   `resources/subscribe`: Client subscribes to updates for a resource.
*   **Notifications**:
    *   `notifications/resources/list_changed`: Server notifies client to re-fetch list.
    *   `notifications/resources/updated`: Server notifies client a specific resource changed.

### 2. Tools (Execute Actions)
Expose executable functions that can modify state or perform complex calculations.

*   `tools/list`: List available tools.
    *   *Returns*: `tools` (array of `name`, `description`, `inputSchema`).
*   `tools/call`: Execute a tool.
    *   *Params*: `name`, `arguments`.
    *   *Returns*: `content` (text/image results), `isError`.
*   **Notifications**:
    *   `notifications/tools/list_changed`: Server notifies client to re-fetch tool list.

### 3. Prompts (Context Templates)
Expose pre-written prompt templates to the user/client.

*   `prompts/list`: List available prompts.
    *   *Returns*: `prompts` (array of `name`, `description`, `arguments`).
*   `prompts/get`: Render a prompt with arguments.
    *   *Params*: `name`, `arguments`.
    *   *Returns*: `messages` (list of user/assistant messages).
*   **Notifications**:
    *   `notifications/prompts/list_changed`.

### 4. Sampling (Agentic Loop)
Server asks the Client (LLM) to generate a completion. Useful for "agentic" servers that need to think or process data using the LLM.

*   `sampling/createMessage`: Request an LLM completion.
    *   *Params*: `messages`, `systemPrompt`, `modelPreferences`.
    *   *Returns*: `role`, `content`, `model`, `stopReason`.

---

## 📝 JSON-RPC Reference Examples

### Listing Tools
**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "play_music",
        "description": "Starts playback",
        "inputSchema": { "type": "object", "properties": {} }
      }
    ]
  }
}
```

### Calling a Tool
**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "set_tempo",
    "arguments": { "bpm": 120 }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      { "type": "text", "text": "Tempo set to 120 BPM" }
    ],
    "isError": false
  }
}
```

---

## ✅ Compliance Checklist (Self-Check)

- [ ] **Protocol Version**: Are you using `2024-11-05` (or latest)?
- [ ] **Capabilities**: Do you correctly declare what `capabilities` (tools, resources, etc.) your server supports in the `initialize` response?
- [ ] **Error Handling**: Do you return standard JSON-RPC error codes (e.g., -32601 for Method not found)?
- [ ] **Tool Schemas**: Are generic JSON Schemas valid?
- [ ] **Concurrency**: Can your server handle multiple requests (via `id` matching)?
