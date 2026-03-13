package com.beattwin.mcp.ear;

import com.fasterxml.jackson.databind.JsonNode;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;

class EarServiceClientTest {
    private HttpServer server;
    private EarServiceClient client;

    @BeforeEach
    void setUp() throws Exception {
        server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/test", exchange -> {
            String response = "{\"status\":\"ok\"}";
            exchange.sendResponseHeaders(200, response.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        });
        server.createContext("/error", exchange -> {
            String response = "{\"error\":\"not_found\"}";
            exchange.sendResponseHeaders(404, response.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        });
        server.setExecutor(null);
        server.start();

        int port = server.getAddress().getPort();
        client = new EarServiceClient("http://127.0.0.1:" + port);
    }

    @AfterEach
    void tearDown() {
        if (server != null) {
            server.stop(0);
        }
    }

    @Test
    void testHappyPath() throws Exception {
        CompletableFuture<JsonNode> future = client.call("/test", "GET");
        JsonNode result = future.get();
        assertNotNull(result);
        assertEquals("ok", result.get("status").asText());
    }

    @Test
    void testErrorPath() {
        CompletableFuture<JsonNode> future = client.call("/error", "GET");
        RuntimeException ex = assertThrows(RuntimeException.class, future::join);
        assertTrue(ex.getMessage().contains("returned 404"));
    }
}
