package com.beattwin.mcp.bitwig;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.util.Collections;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static org.junit.jupiter.api.Assertions.*;

class BitwigClientTest {
    
    private ServerSocket testServer;
    private Thread serverThread;
    private BitwigClient client;
    private volatile boolean serverRunning;
    private volatile boolean simulateTimeout = false;

    static class TestBitwigClient extends BitwigClient {
        private final int port;
        public TestBitwigClient(int port) {
            this.port = port;
        }
        @Override
        protected int getPort() { return port; }
        @Override
        protected String getHost() { return "127.0.0.1"; }
    }

    @BeforeEach
    void setUp() throws Exception {
        testServer = new ServerSocket(0);
        int port = testServer.getLocalPort();
        serverRunning = true;
        simulateTimeout = false;
        
        serverThread = new Thread(() -> {
            try {
                while (serverRunning) {
                    Socket s = testServer.accept();
                    new Thread(() -> handleClient(s)).start();
                }
            } catch (Exception e) {
                // ignore
            }
        });
        serverThread.start();
        
        client = new TestBitwigClient(port);
    }

    private void handleClient(Socket s) {
        try (InputStream in = s.getInputStream(); OutputStream out = s.getOutputStream()) {
            byte[] header = new byte[4];
            while (in.read(header) == 4) {
                int len = ByteBuffer.wrap(header).getInt();
                byte[] body = new byte[len];
                int read = 0;
                while (read < len) {
                    int r = in.read(body, read, len - read);
                    if (r == -1) break;
                    read += r;
                }
                
                if (simulateTimeout) {
                    continue; // Skip response, causes timeout
                }
                
                String json = new String(body);
                int idIndex = json.indexOf("\"id\":");
                if (idIndex != -1) {
                    int idEnd = json.indexOf(",", idIndex);
                    if (idEnd == -1) idEnd = json.indexOf("}", idIndex);
                    String idStr = json.substring(idIndex + 5, idEnd).trim();
                    
                    String response = "{\"jsonrpc\":\"2.0\",\"id\":" + idStr + ",\"result\":{\"success\":true}}\n";
                    out.write(response.getBytes());
                    out.flush();
                }
            }
        } catch (Exception e) {
            // ignore
        }
    }

    @AfterEach
    void tearDown() throws Exception {
        serverRunning = false;
        if (client != null) client.close();
        if (testServer != null) testServer.close();
        if (serverThread != null) serverThread.join(1000);
    }

    @Test
    void testHappyPath() throws Exception {
        CompletableFuture<JsonNode> future = client.callBitwig("test_method", Collections.emptyList());
        JsonNode result = future.get(); // this will throw if exceptionally completed
        assertNotNull(result);
        assertTrue(result.get("success").asBoolean());
    }

    @Test
    void testEdgeCaseTimeoutAndDisconnect() {
        simulateTimeout = true; // Wait for the 5000ms timeout
        
        // This is a bit slow for a unit test (5 seconds), but validates the exact timeout logic
        CompletableFuture<JsonNode> future = client.callBitwig("test_method", Collections.emptyList());
        
        ExecutionException ex = assertThrows(ExecutionException.class, future::get);
        assertTrue(ex.getCause() instanceof java.util.concurrent.TimeoutException || 
                   (ex.getCause().getMessage() != null && ex.getCause().getMessage().contains("Connection closed")), 
                   "Was: " + ex.getCause());
    }
}
