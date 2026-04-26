# Migrate MCP Server to Java

## Goal Description

Migrate the existing TypeScript Bitwig MCP server (`server-mcp/`) to a modern, robust Java implementation using the official Java MCP SDK. The server will provide the exact same tools and resources for controlling Bitwig (via TCP JSON-RPC) and communicating with the Ear Service (via HTTP).

## User Review Required

> [!IMPORTANT]
> Before we proceed to execution, please review and answer:
> 
> 1. Do you prefer **Maven** or **Gradle** for the new Java build system? (The plan assumes Gradle for modern dependency management).
> 2. Should we replace the contents of the `server-mcp/` folder entirely, or create a new folder (e.g., `server-mcp-java/`) and keep the old one intact until the migration is fully verified?
> 3. Does the architectural design below align with your expectations for the @Orchestrator plan?

## Architectural Consensus (The Conceptual War Room)

### 1. The Architect (Sensei Constraint)

**Core Libraries:**

- **MCP Protocol:** Java SDK `io.modelcontextprotocol.sdk` using `McpAsyncServer` with `StdioServerTransportProvider`.
- **JSON Processing & JSON-RPC:** Jackson (`com.fasterxml.jackson.core`).
- **Bitwig TCP Connection:** Standard `java.net.Socket` mapped to Reactor `Mono` / `CompletableFuture`.
- **Ear Service Integration:** Java 11+ `HttpClient` for async HTTP requests.

**Design:**

- **`BitwigClient`**: Manages the TCP socket, reads line-by-line (`BufferedReader`) to avoid fragmented packets, and maintains a map of `pendingRequests` (ID -> `CompletableFuture`).
- **`EarServiceClient`**: Wraps the HTTP calls to `127.0.0.1:8001`.
- **`ToolsRegistry` & `ResourcesRegistry`**: Classes to register the 40+ tools and 3 resources cleanly, modularizing the current massive 2000-line index file.
- **`McpServerApp`**: Main entry point that wires the Stdio transport to the MCP server.

### 2. The Joker (Edge Cases & Risks)

- **Partial TCP Reads:** TS reads chunks and splits by `\n`. In Java, we must use a line-oriented reader (`BufferedReader.readLine()`) running on a dedicated thread to prevent partial JSON parsing errors that could crop up under load.
- **Bitwig Disconnects:** If Bitwig crashes or restarts, the socket drops. We need to automatically attempt reconnection when a tool is called, with a timeout to prevent blocking the MCP Server indefinitely.
- **Thread Blocking:** `McpAsyncServer` relies on Reactor `Mono`. We must ensure blocking I/O (like reading the socket) happens on a dedicated I/O bounded thread pool (`Schedulers.boundedElastic()`) so we don't block the MCP transport loops.

## Proposed Changes

### Build System & Setup

#### [NEW] server-mcp/build.gradle.kts

#### [NEW] server-mcp/settings.gradle.kts

#### [NEW] server-mcp/src/main/java/... (package structure)

### Core Components

#### [NEW] server-mcp/src/main/java/com/beattwin/mcp/McpServerApp.java

#### [NEW] server-mcp/src/main/java/com/beattwin/mcp/bitwig/BitwigClient.java

#### [NEW] server-mcp/src/main/java/com/beattwin/mcp/ear/EarServiceClient.java

#### [NEW] server-mcp/src/main/java/com/beattwin/mcp/tools/BitwigTools.java

#### [NEW] server-mcp/src/main/java/com/beattwin/mcp/resources/BitwigResources.java

## Verification Plan

### Automated Tests

1. **Happy Path:** JUnit 5 tests mocking the Bitwig TCP socket and verifying JSON-RPC formatting and ID matching.
2. **Edge Case Tests (The Joker):** tests simulating partial JSON payload deliveries and socket timeouts/disconnects.
   Run using: `./gradlew test` (or Maven equivalent based on your choice).

### Manual Verification

1. Run the new Java server via standard standard I/O in the Claude/Cursor MCP configuration.
2. Ensure standard Bitwig tools (`transport_play`, `track_list`) execute successfully without timing out.
3. Validate that the Java server can handle long-running flows without memory leaks or locking up compared to the TS implementation.
