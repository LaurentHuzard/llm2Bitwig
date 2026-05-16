package com.beattwin.mcp.tools;

import com.beattwin.mcp.bitwig.BitwigClient;
import com.beattwin.mcp.ear.EarServiceClient;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import io.modelcontextprotocol.spec.McpSchema.TextContent;
import io.modelcontextprotocol.spec.McpSchema.Tool;
import io.modelcontextprotocol.server.McpServerFeatures.AsyncToolSpecification;
import io.modelcontextprotocol.json.McpJsonMapper;
import reactor.core.publisher.Mono;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

public class BitwigTools {

    public static final String TOOL_PROFILE_ENV = "BITWIG_MCP_TOOL_PROFILE";

    private static final String DEFAULT_TOOL_PROFILE = "core";

    private static final Set<String> CORE_TOOL_NAMES = Set.of(
            "project_get_summary",
            "transport_play",
            "transport_stop",
            "transport_restart",
            "transport_get_tempo",
            "transport_set_tempo",
            "transport_get_position",
            "transport_set_position",
            "transport_playing_status",
            "track_bank_get_status",
            "track_list",
            "track_get_info",
            "track_bank_select",
            "track_rename",
            "track_set_color",
            "clip_get_grid",
            "clip_get_status",
            "clip_launch",
            "clip_stop",
            "clip_create",
            "clip_delete",
            "scene_list",
            "scene_launch",
            "cursor_track_get_status",
            "cursor_device_get_status",
            "device_get_status",
            "device_list",
            "device_get_remote_controls",
            "device_set_remote_control",
            "browser_get_status",
            "browser_set_filter",
            "browser_list_results",
            "browser_select_result",
            "browser_commit",
            "browser_cancel",
            "ear_status",
            "ear_get_levels",
            "ear_analyze"
    );

    private final BitwigClient bitwigClient;
    private final EarServiceClient earServiceClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public BitwigTools(BitwigClient bitwigClient, EarServiceClient earServiceClient) {
        this.bitwigClient = bitwigClient;
        this.earServiceClient = earServiceClient;
    }

    public List<AsyncToolSpecification> getTools() {
        return getTools(System.getenv().getOrDefault(TOOL_PROFILE_ENV, DEFAULT_TOOL_PROFILE));
    }

    public List<AsyncToolSpecification> getTools(String profileSpec) {
        List<AsyncToolSpecification> specs = new ArrayList<>();
        Set<String> profileTokens = parseProfile(profileSpec);
        try (InputStream in = getClass().getResourceAsStream("/tools.json")) {
            if (in == null) throw new RuntimeException("tools.json not found");
            
            List<Map<String, Object>> toolsDef = mapper.readValue(in, new TypeReference<>() {});
            for (Map<String, Object> def : toolsDef) {
                String name = (String) def.get("name");
                if (!shouldExposeTool(name, profileTokens)) {
                    continue;
                }

                String description = (String) def.get("description");
                Map<String, Object> schemaMap = (Map<String, Object>) def.get("inputSchema");
                
                String schemaJson = mapper.writeValueAsString(schemaMap);
                
                Tool tool = Tool.builder()
                        .name(name)
                        .description(description)
                        .inputSchema(McpJsonMapper.getDefault(), schemaJson)
                        .build();

                AsyncToolSpecification spec = new AsyncToolSpecification(tool, (exchange, args) -> {
                    if (args == null) args = Collections.emptyMap();
                    return Mono.fromFuture(execute(name, args))
                            .map(resultNode -> CallToolResult.builder()
                                    .content(List.of(new TextContent(resultNode.toPrettyString())))
                                    .build())
                            .onErrorResume(e -> Mono.just(CallToolResult.builder()
                                    .content(List.of(new TextContent("Error: " + e.getMessage())))
                                    .isError(true)
                                    .build()));
                });
                specs.add(spec);
            }
            System.err.printf("Registered %d/%d Bitwig MCP tools using profile '%s'%n",
                    specs.size(), toolsDef.size(), String.join(",", profileTokens));
            return specs;
        } catch (Exception e) {
            throw new RuntimeException("Failed to register tools", e);
        }
    }

    private Set<String> parseProfile(String profileSpec) {
        String rawProfile = profileSpec == null || profileSpec.isBlank() ? DEFAULT_TOOL_PROFILE : profileSpec;
        Set<String> tokens = new LinkedHashSet<>();
        for (String token : rawProfile.split(",")) {
            String normalized = token.trim().toLowerCase();
            if (!normalized.isBlank()) {
                tokens.add(normalized);
            }
        }
        if (tokens.isEmpty()) {
            tokens.add(DEFAULT_TOOL_PROFILE);
        }
        return tokens;
    }

    private boolean shouldExposeTool(String name, Set<String> profileTokens) {
        if (profileTokens.contains("full") || profileTokens.contains("all") || profileTokens.contains("*")) {
            return true;
        }

        if (profileTokens.contains("core") && CORE_TOOL_NAMES.contains(name)) {
            return true;
        }

        for (String token : profileTokens) {
            if (name.equals(token) || name.startsWith(token + "_")) {
                return true;
            }
        }

        return false;
    }

    private CompletableFuture<JsonNode> execute(String name, Map<String, Object> args) {
        if (name.startsWith("ear_")) {
            return handleEarService(name, args);
        } else {
            return handleBitwig(name, args);
        }
    }

    private CompletableFuture<JsonNode> handleEarService(String name, Map<String, Object> args) {
        switch (name) {
            case "ear_status":
                return earServiceClient.call("/levels", "GET")
                        .thenApply(levels -> {
                            var res = mapper.createObjectNode();
                            res.put("status", "connected");
                            res.set("levels", levels);
                            return (JsonNode) res;
                        })
                        .exceptionally(ex -> {
                            var res = mapper.createObjectNode();
                            res.put("status", "disconnected");
                            res.put("error", ex.getMessage());
                            return res;
                        });
            case "ear_get_levels":
                return earServiceClient.call("/levels", "GET");
            case "ear_list_devices":
                return earServiceClient.call("/devices", "GET");
            case "ear_set_device":
                return earServiceClient.call("/device/" + args.get("index"), "POST");
            case "ear_listen":
                int sec = args.containsKey("seconds") ? ((Number) args.get("seconds")).intValue() : 5;
                return earServiceClient.call("/listen?seconds=" + sec, "GET");
            case "ear_analyze":
                double secA = args.containsKey("seconds") ? ((Number) args.get("seconds")).doubleValue() : 1.0;
                return earServiceClient.call("/analyze?seconds=" + secA, "GET");
            default:
                return CompletableFuture.failedFuture(new IllegalArgumentException("Unknown ear tool: " + name));
        }
    }

    private CompletableFuture<JsonNode> handleBitwig(String name, Map<String, Object> args) {
switch(name) {
            case "transport_play":
                return bitwigClient.callBitwig("transport.play", Collections.emptyList());
            case "transport_stop":
                return bitwigClient.callBitwig("transport.stop", Collections.emptyList());
            case "transport_restart":
                return bitwigClient.callBitwig("transport.restart", Collections.emptyList());
            case "transport_record":
                return bitwigClient.callBitwig("transport.record", Collections.emptyList());
            case "transport_get_tempo":
                return bitwigClient.callBitwig("transport.getTempo", Collections.emptyList());
            case "transport_set_tempo":
                return bitwigClient.callBitwig("transport.setTempo", List.of(args.get("bpm")));
            case "transport_get_position":
                return bitwigClient.callBitwig("transport.getPosition", Collections.emptyList());
            case "transport_set_position":
                return bitwigClient.callBitwig("transport.setPosition", List.of(args.get("beats")));
            case "transport_playing_status":
                return bitwigClient.callBitwig("transport.getIsPlaying", Collections.emptyList());
            case "transport_get_recording_status":
                return bitwigClient.callBitwig("transport.getIsRecording", Collections.emptyList());
            case "arranger_get_status":
                return bitwigClient.callBitwig("arranger.get_status", Collections.emptyList());
            case "arranger_set_panel_visibility":
                return bitwigClient.callBitwig("arranger.set_panel_visibility", List.of(args.get("panel"), args.get("state")));
            case "arranger_zoom":
                return bitwigClient.callBitwig("arranger.zoom", List.of(args.get("action")));
            case "arranger_cues_list":
                return bitwigClient.callBitwig("arranger.cues.list", Collections.emptyList());
            case "arranger_cues_jump":
                return bitwigClient.callBitwig("arranger.cues.jump", List.of(args.get("index")));
            case "arranger_cues_rename":
                return bitwigClient.callBitwig("arranger.cues.rename", List.of(args.get("index"), args.get("name")));
            case "arranger_cues_color":
                return bitwigClient.callBitwig("arranger.cues.color", List.of(args.get("index"), args.get("r"), args.get("g"), args.get("b")));
            case "transport_add_cue_marker":
                return bitwigClient.callBitwig("transport.add_cue_marker", Collections.emptyList());
            case "arranger_cues_create":
                return bitwigClient.callBitwig("arranger.cues.create", Collections.emptyList());
            case "application_undo":
                return bitwigClient.callBitwig("application.undo", Collections.emptyList());
            case "application_redo":
                return bitwigClient.callBitwig("application.redo", Collections.emptyList());
            case "application_cut":
                return bitwigClient.callBitwig("application.cut", Collections.emptyList());
            case "application_copy":
                return bitwigClient.callBitwig("application.copy", Collections.emptyList());
            case "application_paste":
                return bitwigClient.callBitwig("application.paste", Collections.emptyList());
            case "application_delete":
                return bitwigClient.callBitwig("application.delete", Collections.emptyList());
            case "application_duplicate":
                return bitwigClient.callBitwig("application.duplicate", Collections.emptyList());
            case "application_select_all":
                return bitwigClient.callBitwig("application.select_all", Collections.emptyList());
            case "application_select_none":
                return bitwigClient.callBitwig("application.select_none", Collections.emptyList());
            case "application_arrow_key":
                return bitwigClient.callBitwig("application.arrow_key", List.of(args.get("direction")));
            case "application_enter":
                return bitwigClient.callBitwig("application.enter", Collections.emptyList());
            case "application_escape":
                return bitwigClient.callBitwig("application.escape", Collections.emptyList());
            case "application_zoom_in":
                return bitwigClient.callBitwig("application.zoom_in", Collections.emptyList());
            case "application_zoom_out":
                return bitwigClient.callBitwig("application.zoom_out", Collections.emptyList());
            case "transport_get_time_signature":
                return bitwigClient.callBitwig("transport.time_signature", Collections.emptyList());
            case "transport_toggle_loop":
                return bitwigClient.callBitwig("transport.toggleLoop", Collections.emptyList());
            case "transport_set_loop_start":
                return bitwigClient.callBitwig("transport.setLoopStart", List.of(args.get("beats")));
            case "transport_set_loop_end":
                return bitwigClient.callBitwig("transport.setLoopEnd", List.of(args.get("beats")));
            case "transport_get_loop_status":
                return bitwigClient.callBitwig("transport.getLoopStatus", Collections.emptyList());
            case "track_bank_get_status":
                return bitwigClient.callBitwig("track.bank.get_status", Collections.emptyList());
            case "track_bank_set_volume":
                return bitwigClient.callBitwig("track.bank.volume", List.of(args.get("index"), args.get("value")));
            case "track_bank_set_pan":
                return bitwigClient.callBitwig("track.bank.pan", List.of(args.get("index"), args.get("value")));
            case "track_bank_set_mute":
                return bitwigClient.callBitwig("track.bank.mute", List.of(args.get("index"), args.get("state")));
            case "track_bank_set_solo":
                return bitwigClient.callBitwig("track.bank.solo", List.of(args.get("index"), args.get("state")));
            case "track_bank_select":
                return bitwigClient.callBitwig("track.bank.select", List.of(args.get("index")));
            case "track_delete":
                return bitwigClient.callBitwig("track.delete", List.of(args.get("index")));
            case "track_rename":
                return bitwigClient.callBitwig("track.rename", List.of(args.get("index"), args.get("name")));
            case "track_duplicate":
                return bitwigClient.callBitwig("track.duplicate", List.of(args.get("index")));
            case "track_set_color":
                return bitwigClient.callBitwig("track.set_color", List.of(args.get("index"), args.get("red"), args.get("green"), args.get("blue")));
            case "track_list":
                return bitwigClient.callBitwig("track.list", Collections.emptyList());
            case "track_get_info":
                return bitwigClient.callBitwig("track.get_info", List.of(args.get("index")));
            case "track_scroll_into_view":
                return bitwigClient.callBitwig("track.scroll_into_view", List.of(args.get("index")));
            case "track_bank_scroll_forward":
                return bitwigClient.callBitwig("track.bank.scroll_forward", Collections.emptyList());
            case "track_bank_scroll_backward":
                return bitwigClient.callBitwig("track.bank.scroll_backward", Collections.emptyList());
            case "track_bank_scroll_to_position":
                return bitwigClient.callBitwig("track.bank.scroll_to_position", List.of(args.get("position")));
            case "clip_launch":
                return bitwigClient.callBitwig("clip.launch", List.of(args.get("trackIndex"), args.get("slotIndex")));
            case "clip_record":
                return bitwigClient.callBitwig("clip.record", List.of(args.get("trackIndex"), args.get("slotIndex")));
            case "clip_stop":
                return bitwigClient.callBitwig("clip.stop", List.of(args.get("trackIndex")));
            case "clip_get_status":
                return bitwigClient.callBitwig("clip.get_status", List.of(args.get("trackIndex"), args.get("sceneIndex")));
            case "clip_get_grid":
                return bitwigClient.callBitwig("clip.get_grid", Collections.emptyList());
            case "clip_set_color":
                return bitwigClient.callBitwig("clip.set_color", List.of(args.get("trackIndex"), args.get("sceneIndex"), args.get("r"), args.get("g"), args.get("b")));
            case "clip_get_color":
                return bitwigClient.callBitwig("clip.get_color", List.of(args.get("trackIndex"), args.get("sceneIndex")));
            case "scene_launch":
                return bitwigClient.callBitwig("scene.launch", List.of(args.get("sceneIndex")));
            case "scene_list":
                return bitwigClient.callBitwig("scene.list", Collections.emptyList());
            case "scene_create":
                return bitwigClient.callBitwig("scene.create", Collections.emptyList());
            case "scene_delete":
                return bitwigClient.callBitwig("scene.delete", List.of(args.get("sceneIndex")));
            case "scene_rename":
                return bitwigClient.callBitwig("scene.rename", List.of(args.get("sceneIndex"), args.get("name")));
            case "scene_select":
                return bitwigClient.callBitwig("scene.select", List.of(args.get("sceneIndex")));
            case "scene_create_from_playing":
                return bitwigClient.callBitwig("scene.create_from_playing", Collections.emptyList());
            case "clip_duplicate":
                return bitwigClient.callBitwig("clip.duplicate", List.of(args.get("trackIndex"), args.get("slotIndex")));
            case "clip_slot_select":
                return bitwigClient.callBitwig("clip.select_slot", List.of(args.get("trackIndex"), args.get("slotIndex")));
            case "clip_create":
                return bitwigClient.callBitwig("clip.create", List.of(args.get("trackIndex"), args.get("slotIndex"), args.get("lengthBeats")));
            case "clip_delete":
                return bitwigClient.callBitwig("clip.delete", List.of(args.get("trackIndex"), args.get("slotIndex")));
            case "clip_browse_insert":
                return bitwigClient.callBitwig("clip.browse_insert", List.of(args.get("trackIndex"), args.get("slotIndex")));
            case "track_selected_get_status":
                return bitwigClient.callBitwig("track.selected.get_status", Collections.emptyList());
            case "track_selected_set_volume":
                return bitwigClient.callBitwig("track.selected.volume", List.of(args.get("value")));
            case "track_selected_set_pan":
                return bitwigClient.callBitwig("track.selected.pan", List.of(args.get("value")));
            case "track_selected_set_mute":
                return bitwigClient.callBitwig("track.selected.mute", List.of(args.get("state")));
            case "track_selected_set_solo":
                return bitwigClient.callBitwig("track.selected.solo", List.of(args.get("state")));
            case "track_selected_set_arm":
                return bitwigClient.callBitwig("track.selected.arm", List.of(args.get("state")));
            case "cursor_track_get_status":
                return bitwigClient.callBitwig("cursor_track.get_status", Collections.emptyList());
            case "cursor_device_get_status":
                return bitwigClient.callBitwig("cursor_device.get_status", Collections.emptyList());
            case "cursor_clip_get_status":
                return bitwigClient.callBitwig("cursor_clip.get_status", Collections.emptyList());
            case "application_create_instrument_track":
                return bitwigClient.callBitwig("application.createInstrumentTrack", Collections.emptyList());
            case "application_create_audio_track":
                return bitwigClient.callBitwig("application.createAudioTrack", Collections.emptyList());
            case "application_create_effect_track":
                return bitwigClient.callBitwig("application.createEffectTrack", Collections.emptyList());
            case "device_get_status":
                return bitwigClient.callBitwig("device.get_status", Collections.emptyList());
            case "device_toggle_window":
                return bitwigClient.callBitwig("device.toggle_window", Collections.emptyList());
            case "device_toggle_expanded":
                return bitwigClient.callBitwig("device.toggle_expanded", Collections.emptyList());
            case "device_list":
                return bitwigClient.callBitwig("device.list", List.of(args.get("trackIndex")));
            case "device_bypass":
                return bitwigClient.callBitwig("device.bypass", List.of(args.get("trackIndex"), args.get("deviceIndex"), args.get("bypass")));
            case "device_delete":
                return bitwigClient.callBitwig("device.delete", List.of(args.get("trackIndex"), args.get("deviceIndex")));
            case "device_get_remote_controls":
                return bitwigClient.callBitwig("device.get_remote_controls", Collections.emptyList());
            case "device_set_remote_control":
                return bitwigClient.callBitwig("device.set_remote_control", List.of(args.get("index"), args.get("value")));
            case "device_page_next":
                return bitwigClient.callBitwig("device.page_next", Collections.emptyList());
            case "device_page_previous":
                return bitwigClient.callBitwig("device.page_previous", Collections.emptyList());
            case "device_select_next":
                return bitwigClient.callBitwig("device.select_next", Collections.emptyList());
            case "device_select_previous":
                return bitwigClient.callBitwig("device.select_previous", Collections.emptyList());
            case "device_select_first":
                return bitwigClient.callBitwig("device.select_first", Collections.emptyList());
            case "device_select_last":
                return bitwigClient.callBitwig("device.select_last", Collections.emptyList());
            case "device_browse_insert_before":
                return bitwigClient.callBitwig("device.browse_insert_before", Collections.emptyList());
            case "device_browse_insert_after":
                return bitwigClient.callBitwig("device.browse_insert_after", Collections.emptyList());
            case "device_browse_replace":
                return bitwigClient.callBitwig("device.browse_replace", Collections.emptyList());
            case "clip_get_info":
                return bitwigClient.callBitwig("clip.get_info", Collections.emptyList());
            case "clip_set_note":
                return bitwigClient.callBitwig("clip.set_note", List.of(args.get("step"), args.get("pitch"), args.get("velocity"), args.get("duration")));
            case "clip_clear_note":
                return bitwigClient.callBitwig("clip.clear_note", List.of(args.get("step"), args.get("pitch")));
            case "clip_toggle_note":
                return bitwigClient.callBitwig("clip.toggle_note", List.of(args.get("step"), args.get("pitch"), args.get("velocity")));
            case "clip_get_notes":
                return bitwigClient.callBitwig("clip.get_notes", List.of(args.get("startStep"), args.get("stepCount"), args.get("pitch")));
            case "mixer_get_master_volume":
                return bitwigClient.callBitwig("mixer.master.get_volume", Collections.emptyList());
            case "mixer_set_master_volume":
                return bitwigClient.callBitwig("mixer.master.set_volume", List.of(args.get("value")));
            case "mixer_get_send_level":
                return bitwigClient.callBitwig("mixer.track.get_send", List.of(args.get("trackIndex"), args.get("sendIndex")));
            case "mixer_set_send_level":
                return bitwigClient.callBitwig("mixer.track.set_send", List.of(args.get("trackIndex"), args.get("sendIndex"), args.get("value")));
            case "mixer_return_list":
                return bitwigClient.callBitwig("mixer.return.list", Collections.emptyList());
            case "mixer_return_set_volume":
                return bitwigClient.callBitwig("mixer.return.volume", List.of(args.get("index"), args.get("value")));
            case "mixer_return_set_pan":
                return bitwigClient.callBitwig("mixer.return.pan", List.of(args.get("index"), args.get("value")));
            case "project_get_summary":
                return bitwigClient.callBitwig("project.get_summary", Collections.emptyList());
            case "midi_send_raw":
                return bitwigClient.callBitwig("note_input.send_raw_midi", List.of(args.get("status"), args.get("data1"), args.get("data2")));
            case "note_on":
                return bitwigClient.callBitwig("note_input.send_note_on", List.of(args.get("channel"), args.get("pitch"), args.get("velocity")));
            case "note_off":
                return bitwigClient.callBitwig("note_input.send_note_off", List.of(args.get("channel"), args.get("pitch"), args.get("velocity")));
            case "note_play":
                return bitwigClient.callBitwig("note_input.send_note_on", List.of(args.get("channel"), args.get("pitch"), args.get("velocity")));
            case "note_input_assign_expression":
                return bitwigClient.callBitwig("note_input.assign_poly_aftertouch_to_expression", List.of(args.get("channel"), args.get("expression"), args.get("pitchRange")));
            case "note_input_set_mpe":
                return bitwigClient.callBitwig("note_input.set_use_expressive_midi", List.of(args.get("enabled"), args.get("baseChannel"), args.get("pitchBendRange")));
            case "note_input_set_key_translation":
                return bitwigClient.callBitwig("note_input.set_key_translation_table", List.of(args.get("table")));
            case "note_input_set_velocity_translation":
                return bitwigClient.callBitwig("note_input.set_velocity_translation_table", List.of(args.get("table")));
            case "drumpad_get_status":
                return bitwigClient.callBitwig("drumpad.get_status", Collections.emptyList());
            case "drumpad_select":
                return bitwigClient.callBitwig("drumpad.select", List.of(args.get("index")));
            case "drumpad_scroll_forward":
                return bitwigClient.callBitwig("drumpad.scroll_forward", Collections.emptyList());
            case "drumpad_scroll_backward":
                return bitwigClient.callBitwig("drumpad.scroll_backward", Collections.emptyList());
            case "drumpad_set_volume":
                return bitwigClient.callBitwig("drumpad.set_volume", List.of(args.get("index"), args.get("value")));
            case "drumpad_set_mute":
                return bitwigClient.callBitwig("drumpad.set_mute", List.of(args.get("index"), args.get("state")));
            case "drumpad_set_solo":
                return bitwigClient.callBitwig("drumpad.set_solo", List.of(args.get("index"), args.get("state")));
            case "groove_get_status":
                return bitwigClient.callBitwig("groove.get_status", Collections.emptyList());
            case "groove_set_enabled":
                return bitwigClient.callBitwig("groove.set_enabled", List.of(args.get("state")));
            case "groove_set_shuffle_amount":
                return bitwigClient.callBitwig("groove.set_shuffle_amount", List.of(args.get("value")));
            case "project_unsolo_all":
                return bitwigClient.callBitwig("project.unsolo_all", Collections.emptyList());
            case "project_unmute_all":
                return bitwigClient.callBitwig("project.unmute_all", Collections.emptyList());
            case "project_unarm_all":
                return bitwigClient.callBitwig("project.unarm_all", Collections.emptyList());
            case "browser_get_status":
                return bitwigClient.callBitwig("browser.get_status", Collections.emptyList());
            case "browser_set_filter":
                return bitwigClient.callBitwig("browser.set_filter", List.of(args.get("text")));
            case "browser_list_results":
                return bitwigClient.callBitwig("browser.list_results", Collections.emptyList());
            case "browser_select_result":
                return bitwigClient.callBitwig("browser.select_result", List.of(args.get("index")));
            case "browser_commit":
                return bitwigClient.callBitwig("browser.commit", Collections.emptyList());
            case "browser_cancel":
                return bitwigClient.callBitwig("browser.cancel", Collections.emptyList());
            case "transport_toggle_metronome":
                return bitwigClient.callBitwig("transport.toggle_metronome", Collections.emptyList());
            case "transport_set_time_signature":
                return bitwigClient.callBitwig("transport.time_signature", List.of(args.get("numerator"), args.get("denominator")));
            case "transport_tap_tempo":
                return bitwigClient.callBitwig("transport.tap_tempo", Collections.emptyList());
            case "transport_toggle_punch_in":
                return bitwigClient.callBitwig("transport.toggle_punch_in", Collections.emptyList());
            case "transport_toggle_punch_out":
                return bitwigClient.callBitwig("transport.toggle_punch_out", Collections.emptyList());
            case "transport_set_punch_in":
                return bitwigClient.callBitwig("transport.set_punch_in", List.of(args.get("state")));
            case "transport_set_punch_out":
                return bitwigClient.callBitwig("transport.set_punch_out", List.of(args.get("state")));
            case "transport_get_punch_status":
                return bitwigClient.callBitwig("transport.get_punch_status", Collections.emptyList());
            case "transport_toggle_arranger_overdub":
                return bitwigClient.callBitwig("transport.toggle_arranger_overdub", Collections.emptyList());
            case "transport_toggle_launcher_overdub":
                return bitwigClient.callBitwig("transport.toggle_launcher_overdub", Collections.emptyList());
            case "transport_get_overdub_status":
                return bitwigClient.callBitwig("transport.get_overdub_status", Collections.emptyList());
            case "transport_continue_playback":
                return bitwigClient.callBitwig("transport.continue_playback", Collections.emptyList());
            case "transport_return_to_zero":
                return bitwigClient.callBitwig("transport.return_to_zero", Collections.emptyList());
            case "transport_fast_forward":
                return bitwigClient.callBitwig("transport.fast_forward", Collections.emptyList());
            case "transport_rewind":
                return bitwigClient.callBitwig("transport.rewind", Collections.emptyList());
            case "transport_nudge_forward":
                return bitwigClient.callBitwig("transport.nudge_forward", Collections.emptyList());
            case "transport_nudge_backward":
                return bitwigClient.callBitwig("transport.nudge_backward", Collections.emptyList());
            default:
                return CompletableFuture.failedFuture(new IllegalArgumentException("Unknown tool: " + name));
        }

    }
}
