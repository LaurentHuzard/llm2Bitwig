package com.beattwin.mcp;

import com.beattwin.mcp.bitwig.BitwigClient;
import com.beattwin.mcp.ear.EarServiceClient;
import com.beattwin.mcp.resources.BitwigResources;
import com.beattwin.mcp.tools.BitwigTools;
import io.modelcontextprotocol.json.McpJsonMapper;
import io.modelcontextprotocol.server.McpAsyncServer;
import io.modelcontextprotocol.server.McpServer;
import io.modelcontextprotocol.server.transport.StdioServerTransportProvider;
import io.modelcontextprotocol.spec.McpSchema.ServerCapabilities;
import io.modelcontextprotocol.spec.McpSchema.Implementation;
import io.modelcontextprotocol.server.McpServerFeatures.AsyncToolSpecification;
import io.modelcontextprotocol.server.McpServerFeatures.AsyncResourceSpecification;

import java.util.concurrent.CountDownLatch;

public class McpServerApp {
    public static void main(String[] args) {
        try {
            BitwigClient bitwigClient = new BitwigClient();
            // Start connection in background, it's non-blocking mostly or fails gracefully 
            // inside callBitwig if it takes time.
            try {
                bitwigClient.connect();
            } catch (Exception e) {
                System.err.println("Warning: Bitwig is not running yet. Connection will retry automatically.");
            }

            EarServiceClient earServiceClient = new EarServiceClient();
            
            BitwigTools tools = new BitwigTools(bitwigClient, earServiceClient);
            BitwigResources resources = new BitwigResources(bitwigClient);

            StdioServerTransportProvider transportProvider = new StdioServerTransportProvider(McpJsonMapper.getDefault());

            var builder = McpServer.async(transportProvider)
                    .serverInfo(new Implementation("bitwig-mcp-server", "1.0.0"))
                    .capabilities(ServerCapabilities.builder()
                            .tools(true)
                            .resources(true, false)
                            .prompts(false)
                            .build());

            McpAsyncServer server = builder.build();

            for (AsyncToolSpecification spec : tools.getTools()) {
                server.addTool(spec).block();
            }

            for (AsyncResourceSpecification spec : resources.getResources()) {
                server.addResource(spec).block();
            }

            System.err.println("Bitwig MCP Server (Java) running on stdio");
            
            // Wait forever
            new CountDownLatch(1).await();
        } catch (Exception e) {
            System.err.println("Fatal error: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
