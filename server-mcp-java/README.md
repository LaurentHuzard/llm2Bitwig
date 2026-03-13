# Beatmaker Twin - Java MCP Server (`server-mcp-java`)

Java implementation of the Beatmaker Twin MCP server.  
It exposes Bitwig controls as MCP tools/resources over `stdio`, then forwards tool calls to the Bitwig controller over local TCP.

## Status

- Build: passing
- Tests: passing (`./gradlew test`)
- Runtime: functional when launched by an MCP host/client that keeps `stdio` open

Important: running `./gradlew run` in a plain non-MCP shell context can fail with `Failed to enqueue message` because no valid MCP stdio session is attached.

## What This Module Does

- Starts an MCP server (`io.modelcontextprotocol.sdk`) on `stdio`
- Registers tools from [`src/main/resources/tools.json`](src/main/resources/tools.json)
- Routes tool calls to:
  - Bitwig controller TCP bridge at `127.0.0.1:8888`
  - Ear service HTTP API at `http://127.0.0.1:8001` (for `ear_*` tools)
- Exposes read-only resources:
  - `bitwig://project/summary`
  - `bitwig://tracks`
  - `bitwig://devices`

## Architecture

```text
MCP Host/Client
    |
    | stdio (MCP protocol)
    v
server-mcp-java (this module)
    |                     \
    | TCP 127.0.0.1:8888   \ HTTP 127.0.0.1:8001
    v                       v
Bitwig controller         Ear service (optional but recommended)
```

## Tool Coverage

Current catalog is loaded from `tools.json` and includes **165 tools** across domains like:

- `transport_*`
- `track_*`
- `clip_*`
- `scene_*`
- `device_*`
- `arranger_*`
- `application_*`
- `mixer_*`
- `browser_*`
- `note_*`, `midi_*`, `drumpad_*`, `groove_*`
- `ear_*`

To inspect available tools quickly:

```bash
node -e "const t=require('./src/main/resources/tools.json'); console.log('tools:', t.length); console.log(t.map(x=>x.name).join('\n'));"
```

## Prerequisites

- Java 17+
- Bitwig Studio with the Beatmaker controller script installed and enabled
- Ear service running locally (for `ear_*` tools)
- An MCP-compatible client/host (Claude Desktop, Cursor, custom runner, etc.)

## Setup

```bash
cd server-mcp-java
./gradlew test
./gradlew build
```

Optional distributable install script:

```bash
./gradlew installDist
```

Binary output:

- `build/install/server-mcp/bin/server-mcp` (Linux/macOS)
- `build/install/server-mcp/bin/server-mcp.bat` (Windows)

## Running

### Recommended: run through your MCP client config

Use one of:

- `./gradlew run` (dev mode)
- `build/install/server-mcp/bin/server-mcp` (distribution script)

Example MCP command (adjust path):

```json
{
  "command": "/absolute/path/to/server-mcp-java/build/install/server-mcp/bin/server-mcp",
  "args": []
}
```

### Manual terminal run (for debugging only)

```bash
./gradlew run
```

If no MCP peer is connected over stdio, startup may fail quickly with `Failed to enqueue message`. This is expected in non-MCP contexts.

## Validation Commands

```bash
# Unit tests
./gradlew test

# Full build
./gradlew build

# Generate runtime distribution
./gradlew installDist
```

## Project Layout

- `src/main/java/com/beattwin/mcp/McpServerApp.java` - server bootstrap and capability registration
- `src/main/java/com/beattwin/mcp/tools/BitwigTools.java` - tool registration + dispatch logic
- `src/main/java/com/beattwin/mcp/resources/BitwigResources.java` - MCP resources
- `src/main/java/com/beattwin/mcp/bitwig/BitwigClient.java` - TCP JSON-RPC bridge to Bitwig controller
- `src/main/java/com/beattwin/mcp/ear/EarServiceClient.java` - HTTP client for ear service
- `src/main/resources/tools.json` - MCP tool schema catalog
- `src/test/java/...` - unit tests

## How To Add/Change a Tool

1. Add/update schema entry in `src/main/resources/tools.json`.
2. Implement dispatch mapping in `BitwigTools.handleBitwig(...)` or `handleEarService(...)`.
3. Ensure the Bitwig controller or ear service endpoint exists for that method.
4. Add/update tests.
5. Run `./gradlew test`.

## Current Constraints

- Bitwig TCP host/port are currently fixed in code (`127.0.0.1:8888`).
- Ear service base URL defaults to `http://127.0.0.1:8001` and is currently not wired to env config in `McpServerApp`.
- No MCP prompts are registered in this Java server (`prompts(false)`).

## Troubleshooting

- `Could not connect to Bitwig. Is it running?`
  - Verify Bitwig is running and the controller bridge is active on port `8888`.
- `Failed to contact Ear Service`
  - Start ear service or avoid `ear_*` tools until it is running.
- `Failed to enqueue message`
  - Launch from an MCP host/client that provides active stdio transport.

