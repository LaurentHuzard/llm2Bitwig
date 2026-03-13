package com.beattwin.mcp.ear;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;

public class EarServiceClient {
    private static final Logger log = LoggerFactory.getLogger(EarServiceClient.class);
    private static final String DEFAULT_URL = "http://127.0.0.1:8001";
    
    private final HttpClient client;
    private final ObjectMapper mapper;
    private final String baseUrl;

    public EarServiceClient() {
        this(DEFAULT_URL);
    }
    
    public EarServiceClient(String baseUrl) {
        this.baseUrl = baseUrl;
        this.client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
        this.mapper = new ObjectMapper();
    }

    public CompletableFuture<JsonNode> call(String endpoint, String method) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + endpoint))
                .method(method, HttpRequest.BodyPublishers.noBody())
                .timeout(Duration.ofSeconds(10))
                .build();
                
        return client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(response -> {
                    if (response.statusCode() >= 400) {
                        throw new RuntimeException("Ear service returned " + response.statusCode() + ": " + response.body());
                    }
                    try {
                        return mapper.readTree(response.body());
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to parse Ear service response: " + e.getMessage(), e);
                    }
                })
                .exceptionally(ex -> {
                    log.error("Failed to contact Ear Service: {}. Is it running?", ex.getMessage());
                    throw new RuntimeException("Failed to contact Ear Service: " + ex.getMessage(), ex);
                });
    }
}
