package com.beattwin.mcp.bitwig;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class BitwigClient implements AutoCloseable {
    private static final Logger log = LoggerFactory.getLogger(BitwigClient.class);
    private static final String HOST = "127.0.0.1";
    private static final int PORT = 8888;
    
    private final ObjectMapper mapper = new ObjectMapper();
    private Socket socket;
    private OutputStream out;
    private InputStream in;
    private Thread readerThread;
    
    private final AtomicInteger requestId = new AtomicInteger(0);
    private final ConcurrentMap<Integer, CompletableFuture<JsonNode>> pendingRequests = new ConcurrentHashMap<>();
    
    private volatile boolean isRunning = false;

    public BitwigClient() {
    }

    protected String getHost() { return HOST; }
    protected int getPort() { return PORT; }

    public synchronized void connect() throws IOException {
        if (socket != null && !socket.isClosed()) {
            return;
        }
        socket = new Socket(getHost(), getPort());
        out = socket.getOutputStream();
        in = socket.getInputStream();
        isRunning = true;
        
        readerThread = new Thread(this::readLoop, "BitwigClient-Reader");
        readerThread.setDaemon(true);
        readerThread.start();
        log.info("Connected to Bitwig at {}:{}", getHost(), getPort());
    }
    
    private void readLoop() {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
            String line;
            while (isRunning && (line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                try {
                    JsonNode node = mapper.readTree(line);
                    if (node.has("id")) {
                        int id = node.get("id").asInt();
                        CompletableFuture<JsonNode> future = pendingRequests.remove(id);
                        if (future != null) {
                            if (node.has("error") && !node.get("error").isNull()) {
                                future.completeExceptionally(new RuntimeException(node.get("error").toString()));
                            } else {
                                future.complete(node.get("result"));
                            }
                        }
                    } else {
                        log.debug("Received event from Bitwig: {}", line);
                    }
                } catch (Exception e) {
                    log.error("Error parsing response from Bitwig: {}", e.getMessage());
                }
            }
        } catch (IOException e) {
            if (isRunning) {
                log.error("Bitwig connection drop: {}", e.getMessage());
            }
        } finally {
            disconnect();
        }
    }
    
    public synchronized void disconnect() {
        isRunning = false;
        if (socket != null) {
            try {
                socket.close();
            } catch (IOException ignored) {}
            socket = null;
        }
        for (CompletableFuture<JsonNode> future : pendingRequests.values()) {
            future.completeExceptionally(new IOException("Connection closed"));
        }
        pendingRequests.clear();
        log.info("Disconnected from Bitwig");
    }

    public CompletableFuture<JsonNode> callBitwig(String method, List<Object> params) {
        if (!isRunning || socket == null || socket.isClosed()) {
            try {
                connect();
                Thread.sleep(500); // Give bitwig a moment to register callbacks as in TS
            } catch (Exception e) {
                return CompletableFuture.failedFuture(new IOException("Could not connect to Bitwig. Is it running?"));
            }
        }
        
        int id = requestId.getAndIncrement();
        CompletableFuture<JsonNode> future = new CompletableFuture<>();
        pendingRequests.put(id, future);
        
        ObjectNode req = mapper.createObjectNode();
        req.put("jsonrpc", "2.0");
        req.put("method", method);
        ArrayNode paramsNode = req.putArray("params");
        if (params != null) {
            for (Object p : params) {
                paramsNode.add(mapper.valueToTree(p));
            }
        }
        req.put("id", id);
        
        try {
            byte[] msgBytes = mapper.writeValueAsBytes(req);
            ByteBuffer header = ByteBuffer.allocate(4);
            header.putInt(msgBytes.length);
            
            synchronized (out) {
                out.write(header.array());
                out.write(msgBytes);
                out.flush();
            }
        } catch (IOException e) {
            pendingRequests.remove(id);
            future.completeExceptionally(new IOException("Failed to send request", e));
            disconnect();
        }
        
        future.orTimeout(5, TimeUnit.SECONDS).exceptionally(ex -> {
            pendingRequests.remove(id);
            if (ex instanceof TimeoutException) {
                throw new CompletionException(new RuntimeException("Timeout waiting for Bitwig response"));
            }
            throw new CompletionException(ex);
        });
        
        return future;
    }

    @Override
    public void close() {
        disconnect();
    }
}
