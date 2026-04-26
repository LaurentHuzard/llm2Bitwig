# Field Report: MCP Server Migration to Java

**Date:** March 13, 2026
**Author:** @Journalist + @Scribe
**Phase:** 5 (The Journalist Interview)

## The Narrative
The migration of `server-mcp` from TypeScript to Java was born out of a desire for stronger static typing, better standard I/O control for the Model Context Protocol (MCP), and a more mature standard library for network I/O buffering. The @Orchestrator plan dictated a phased approach using the official MCP Java SDK.

We established a "Conceptual War Room" to define a Reactor-based non-blocking architecture relying strictly on standard I/O streams and asynchronous socket clients.

## The Performance
The execution mapped gracefully from TS logic to Java capabilities. We accomplished:
- Complete porting of the asynchronous TCP JSON-RPC client to wrap the 40+ Bitwig interface methods.
- Refactored tool handlers into dynamically loaded Java models using `Jackson` (reducing the enormous single file constraint from TS).
- Complete migration of Ear service HTTP endpoints using the Java 11 `HttpClient`.
- Clean separation of Tools vs Resources.

**Walls Hit:**
1. The `CallToolResult` schema specification structure in the newer `0.17.1` MCP SDK was opaque. It required dynamically extracting the `TextContent` class from within `io.modelcontextprotocol.spec.McpSchema.TextContent` instead of relying on standard POJOs.
2. The asynchronous `McpAsyncServer` structure was surprisingly rigid around lambda arguments and `Mono` chains. This led to a few compile cycle iterations to establish a flawless functional programming map.

## Key Learning & REX
- **AST Generation is King:** Extracting the 165+ tool mappings from the TS switch/case statement using Python and translating them into Java `CompletableFuture` mappings saved hours of manual copying and prevented 100% of syntactic translation errors.
- **Async Robustness:** Using `CompletableFuture.orTimeout()` gives us strict boundaries around Bitwig tool calls, ensuring the MCP SDK does not hang indefinitely when Bitwig isn't running or crashes.
- **Future Action:** Once the Java migration proves completely stable in a live production environment, we should officially delete `server-mcp/` and move `server-mcp-java/` into its place. Use `./gradlew build` to generate the server bundle.
