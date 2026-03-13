package com.beattwin.mcp.resources;

import com.beattwin.mcp.bitwig.BitwigClient;
import io.modelcontextprotocol.spec.McpSchema.ReadResourceResult;
import io.modelcontextprotocol.spec.McpSchema.Resource;
import io.modelcontextprotocol.spec.McpSchema.TextResourceContents;
import io.modelcontextprotocol.server.McpServerFeatures.AsyncResourceSpecification;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class BitwigResources {
    private final BitwigClient bitwigClient;

    public BitwigResources(BitwigClient bitwigClient) {
        this.bitwigClient = bitwigClient;
    }

    public List<AsyncResourceSpecification> getResources() {
        List<AsyncResourceSpecification> specs = new ArrayList<>();

        specs.add(new AsyncResourceSpecification(
            Resource.builder()
                .uri("bitwig://project/summary")
                .name("Project Summary")
                .mimeType("application/json")
                .description("Overview of the current project state")
                .build(),
            (exchange, req) -> Mono.fromFuture(bitwigClient.callBitwig("project.get_summary", Collections.emptyList()))
                .map(node -> new ReadResourceResult(List.of(
                    new TextResourceContents("bitwig://project/summary", "application/json", node.toPrettyString())
                )))
                .onErrorResume(e -> Mono.just(new ReadResourceResult(List.of(
                    new TextResourceContents("bitwig://project/summary", "application/json", "{\"error\": \"" + e.getMessage() + "\"}")
                ))))
        ));

        specs.add(new AsyncResourceSpecification(
            Resource.builder()
                .uri("bitwig://tracks")
                .name("Track List")
                .mimeType("application/json")
                .description("List of all tracks in the current bank")
                .build(),
            (exchange, req) -> Mono.fromFuture(bitwigClient.callBitwig("track.list", Collections.emptyList()))
                .map(node -> new ReadResourceResult(List.of(
                    new TextResourceContents("bitwig://tracks", "application/json", node.toPrettyString())
                )))
                .onErrorResume(e -> Mono.just(new ReadResourceResult(List.of(
                    new TextResourceContents("bitwig://tracks", "application/json", "{\"error\": \"" + e.getMessage() + "\"}")
                ))))
        ));

        specs.add(new AsyncResourceSpecification(
            Resource.builder()
                .uri("bitwig://devices")
                .name("Device List")
                .mimeType("application/json")
                .description("List of devices on the currently selected track")
                .build(),
            (exchange, req) -> Mono.fromFuture(bitwigClient.callBitwig("device.list", Collections.emptyList()))
                .map(node -> new ReadResourceResult(List.of(
                    new TextResourceContents("bitwig://devices", "application/json", node.toPrettyString())
                )))
                .onErrorResume(e -> Mono.just(new ReadResourceResult(List.of(
                    new TextResourceContents("bitwig://devices", "application/json", "{\"error\": \"" + e.getMessage() + "\"}")
                ))))
        ));

        return specs;
    }
}
