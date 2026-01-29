#!/usr/bin/env node

/**
 * Bitwig MCP Server
 * Connects to Bitwig Studio via TCP (JSON-RPC) and exposes tools to an LLM.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import net from "net";
import { WebSocketServer } from "ws";

// --- Bitwig Connection Configuration ---
const BITWIG_HOST = "127.0.0.1";
const BITWIG_PORT = 8888;
let client = null;
let requestId = 0;
const pendingRequests = new Map();
const WS_PORT = 8080;
let wss = null;

// --- TCP Client Setup ---
function connectToBitwig() {
  return new Promise((resolve, reject) => {
    client = new net.Socket();

    client.connect(BITWIG_PORT, BITWIG_HOST, () => {
      console.error(`Connected to Bitwig at ${BITWIG_HOST}:${BITWIG_PORT}`);
      // Give Bitwig a moment to register callbacks
      setTimeout(resolve, 500);
    });

    client.on("data", (data) => {
      // Handle incoming data (stream handling needed for robust impl, simplistic for now)
      const lines = data.toString().split("\n");
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const response = JSON.parse(line);
          if (response.id !== undefined && pendingRequests.has(response.id)) {
            const { resolve, reject } = pendingRequests.get(response.id);
            if (response.error) {
              reject(new Error(response.error.message));
            } else {
              resolve(response.result);
            }
            pendingRequests.delete(response.id);
          } else {
            // Broadcast to WebSocket clients (events from Bitwig)
            if (wss) {
              broadcastToClients(response);
            }
          }
        } catch (err) {
          console.error("Error parsing response from Bitwig:", err);
        }
      }
    });

    client.on("close", () => {
      console.error("Connection to Bitwig closed");
      client = null;
    });

    client.on("error", (err) => {
      console.error("Bitwig connection error:", err);
    });
  });
}

// --- JSON-RPC Helper ---
function callBitwig(method, params = []) {
  return new Promise(async (resolve, reject) => {
    if (!client) {
      try {
        await connectToBitwig();
      } catch (err) {
        return reject(new Error("Could not connect to Bitwig. Is it running?"));
      }
    }

    const id = requestId++;
    const request = {
      jsonrpc: "2.0",
      method,
      params,
      id
    };

    pendingRequests.set(id, { resolve, reject });

    const msg = JSON.stringify(request);
    const msgBuf = Buffer.from(msg, "utf8");
    const header = Buffer.alloc(4);
    header.writeUInt32BE(msgBuf.length, 0);
    client.write(Buffer.concat([header, msgBuf]));

    // Timeout
    setTimeout(() => {
      if (pendingRequests.has(id)) {
        pendingRequests.get(id).reject(new Error("Timeout waiting for Bitwig response"));
        pendingRequests.delete(id);
      }
    }, 5000);
  });
}


// --- MCP Server Setup ---
const server = new Server(
  {
    name: "bitwig-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// --- WebSocket Server Setup ---
function startWebSocketServer() {
  wss = new WebSocketServer({ port: WS_PORT });
  console.error(`WebSocket server listening on port ${WS_PORT}`);

  wss.on("connection", (ws) => {
    console.error("New WebSocket connection");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        // Expecting { method: "...", params: [...] } from UI
        // We can reuse callBitwig (which wraps in JSON-RPC) or send raw if the UI sends raw JSON-RPC
        // For simplicity, let's assume UI sends { action: "call", method: "...", params: [...] }

        if (data.action === "call") {
          // Use shared tool execution logic
          executeTool(data.method, data.params || {})
            .then(result => {
              ws.send(JSON.stringify({ id: data.id, result }));
            })
            .catch(err => {
              ws.send(JSON.stringify({ id: data.id, error: err.message }));
            });
        }
      } catch (err) {
        console.error("Error processing WS message:", err);
      }
    });
  });
}

function broadcastToClients(data) {
  if (!wss) return;
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(msg);
    }
  });
}

startWebSocketServer();

// --- Tool Definitions ---

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "transport_play",
        description: "Start playback in Bitwig",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_stop",
        description: "Stop playback in Bitwig",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_restart",
        description: "Restart playback from the beginning",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_record",
        description: "Toggle recording",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_get_tempo",
        description: "Get the current tempo (BPM)",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_set_tempo",
        description: "Set the tempo (BPM)",
        inputSchema: {
          type: "object",
          properties: {
            bpm: { type: "number", description: "Tempo in Beats Per Minute" },
          },
          required: ["bpm"],
        },
      },
      {
        name: "transport_get_position",
        description: "Get current playhead position in beats",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_set_position",
        description: "Set playhead position in beats",
        inputSchema: {
          type: "object",
          properties: {
            beats: { type: "number", description: "Position in beats" },
          },
          required: ["beats"],
        },
      },
      {
        name: "transport_playing_status",
        description: "Check if transport is currently playing",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_toggle_loop",
        description: "Toggle loop on/off",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_set_loop_start",
        description: "Set loop start position in beats",
        inputSchema: {
          type: "object",
          properties: {
            beats: { type: "number", description: "Loop start position in beats" },
          },
          required: ["beats"],
        },
      },
      {
        name: "transport_set_loop_end",
        description: "Set loop end position in beats",
        inputSchema: {
          type: "object",
          properties: {
            beats: { type: "number", description: "Loop end position in beats" },
          },
          required: ["beats"],
        },
      },
      {
        name: "transport_get_loop_status",
        description: "Get current loop status (enabled, start, end)",
        inputSchema: { type: "object", properties: {} },
      },
      // --- Track Bank Tools ---
      {
        name: "track_bank_get_status",
        description: "Get status (vol/pan/mute/solo) of all 8 tracks in the current bank window",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "track_bank_set_volume",
        description: "Set volume for a track in the bank 0-7",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Track index 0-7" },
            value: { type: "number", description: "Volume value 0.0 to 1.0" },
          },
          required: ["index", "value"],
        },
      },
      {
        name: "track_bank_set_pan",
        description: "Set pan for a track in the bank 0-7",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Track index 0-7" },
            value: { type: "number", description: "Pan value 0.0 to 1.0 (0.5 is center)" },
          },
          required: ["index", "value"],
        },
      },
      {
        name: "track_bank_set_mute",
        description: "Set mute for a track in the bank 0-7",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Track index 0-7" },
            state: { type: "boolean", description: "True to mute, False to unmute" },
          },
          required: ["index", "state"],
        },
      },
      {
        name: "track_bank_set_solo",
        description: "Set solo for a track in the bank 0-7",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Track index 0-7" },
            state: { type: "boolean", description: "True to solo, False to unsolo" },
          },
          required: ["index", "state"],
        },
      },
      {
        name: "track_bank_select",
        description: "Select a track in the bank 0-7",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Track index 0-7" },
          },
          required: ["index"],
        },
      },
      {
        name: "track_delete",
        description: "Delete a track from the bank (0-7) (REQUIRES_CONFIRMATION)",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Track index 0-7" },
          },
          required: ["index"],
        },
      },
      {
        name: "track_rename",
        description: "Rename a track",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Track index 0-7" },
            name: { type: "string", description: "New name" },
          },
          required: ["index", "name"],
        },
      },
      {
        name: "track_duplicate",
        description: "Duplicate a track",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Track index 0-7" },
          },
          required: ["index"],
        },
      },
      {
        name: "track_set_color",
        description: "Set track color",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Track index 0-7" },
            red: { type: "number", description: "Red (0.0-1.0)" },
            green: { type: "number", description: "Green (0.0-1.0)" },
            blue: { type: "number", description: "Blue (0.0-1.0)" },
          },
          required: ["index", "red", "green", "blue"],
        },
      },
      // --- Clip & Scene Tools ---
      {
        name: "clip_launch",
        description: "Launch a clip in a track's slot",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
            slotIndex: { type: "number", description: "Slot index 0-7" },
          },
          required: ["trackIndex", "slotIndex"],
        },
      },
      {
        name: "clip_record",
        description: "Trigger record on a clip slot",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
            slotIndex: { type: "number", description: "Slot index 0-7" },
          },
          required: ["trackIndex", "slotIndex"],
        },
      },
      {
        name: "clip_stop",
        description: "Stop clips playing on a track",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
          },
          required: ["trackIndex"],
        },
      },
      {
        name: "clip_get_status",
        description: "Get the status of a specific clip slot",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
            sceneIndex: { type: "number", description: "Scene index 0-7" },
          },
          required: ["trackIndex", "sceneIndex"],
        },
      },
      {
        name: "clip_get_grid",
        description: "Get the entire 8x8 clip launcher grid state",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "clip_set_color",
        description: "Set the color of a clip",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
            sceneIndex: { type: "number", description: "Scene index 0-7" },
            r: { type: "number", description: "Red 0.0-1.0" },
            g: { type: "number", description: "Green 0.0-1.0" },
            b: { type: "number", description: "Blue 0.0-1.0" },
          },
          required: ["trackIndex", "sceneIndex", "r", "g", "b"],
        },
      },
      {
        name: "clip_delete",
        description: "Delete a clip from a slot (REQUIRES_CONFIRMATION)",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
            slotIndex: { type: "number", description: "Slot index 0-7" },
          },
          required: ["trackIndex", "slotIndex"],
        },
      },
      {
        name: "clip_browse_insert",
        description: "Open browser to insert a clip in a slot",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
            slotIndex: { type: "number", description: "Slot index 0-7" },
          },
          required: ["trackIndex", "slotIndex"],
        },
      },
      {
        name: "clip_get_color",
        description: "Get the color of a clip",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
            sceneIndex: { type: "number", description: "Scene index 0-7" },
          },
          required: ["trackIndex", "sceneIndex"],
        },
      },
      {
        name: "scene_launch",
        description: "Launch a scene (horizontal row of clips)",
        inputSchema: {
          type: "object",
          properties: {
            sceneIndex: { type: "number", description: "Scene index 0-7" },
          },
          required: ["sceneIndex"],
        },
      },
      {
        name: "scene_list",
        description: "List available scenes in the current bank",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "scene_create",
        description: "Create a new empty scene",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "scene_delete",
        description: "Delete a scene (REQUIRES_CONFIRMATION)",
        inputSchema: {
          type: "object",
          properties: {
            sceneIndex: { type: "number", description: "Scene index 0-7" },
          },
          required: ["sceneIndex"],
        },
      },
      {
        name: "scene_rename",
        description: "Rename a scene",
        inputSchema: {
          type: "object",
          properties: {
            sceneIndex: { type: "number", description: "Scene index 0-7" },
            name: { type: "string", description: "New name" },
          },
          required: ["sceneIndex", "name"],
        },
      },
      {
        name: "clip_duplicate",
        description: "Duplicate a clip in a slot",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
            slotIndex: { type: "number", description: "Slot index 0-7" },
          },
          required: ["trackIndex", "slotIndex"],
        },
      },
      {
        name: "clip_slot_select",
        description: "Select a clip slot",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
            slotIndex: { type: "number", description: "Slot index 0-7" },
          },
          required: ["trackIndex", "slotIndex"],
        },
      },
      {
        name: "scene_select",
        description: "Select a scene",
        inputSchema: {
          type: "object",
          properties: {
            sceneIndex: { type: "number", description: "Scene index 0-7" },
          },
          required: ["sceneIndex"],
        },
      },
      {
        name: "scene_create_from_playing",
        description: "Create a new scene from currently playing clips",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "clip_create",
        description: "Create an empty clip in a track slot",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
            slotIndex: { type: "number", description: "Slot index 0-7" },
            lengthBeats: { type: "number", description: "Length of clip in beats (e.g., 4, 8, 16)" },
          },
          required: ["trackIndex", "slotIndex", "lengthBeats"],
        },
      },
      // --- Selected Track Tools ---
      {
        name: "track_selected_get_status",
        description: "Get status of the currently selected track",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "track_selected_set_volume",
        description: "Set volume for the selected track",
        inputSchema: {
          type: "object",
          properties: {
            value: { type: "number", description: "Volume value 0.0 to 1.0" },
          },
          required: ["value"],
        },
      },
      {
        name: "track_selected_set_pan",
        description: "Set pan for the selected track",
        inputSchema: {
          type: "object",
          properties: {
            value: { type: "number", description: "Pan value 0.0 to 1.0" },
          },
          required: ["value"],
        },
      },
      {
        name: "track_selected_set_mute",
        description: "Set mute for the selected track",
        inputSchema: {
          type: "object",
          properties: {
            state: { type: "boolean", description: "True to mute" },
          },
          required: ["state"],
        },
      },
      {
        name: "track_selected_set_solo",
        description: "Set solo for the selected track",
        inputSchema: {
          type: "object",
          properties: {
            state: { type: "boolean", description: "True to solo" },
          },
          required: ["state"],
        },
      },
      {
        name: "track_selected_set_arm",
        description: "Set arm (record enable) for the selected track",
        inputSchema: {
          type: "object",
          properties: {
            state: { type: "boolean", description: "True to arm" },
          },
          required: ["state"],
        },
      },
      {
        name: "device_select_next",
        description: "Select next device in chain",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "device_select_previous",
        description: "Select previous device in chain",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "device_browse_insert_before",
        description: "Open browser to insert device before selected",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "device_browse_insert_after",
        description: "Open browser to insert device after selected",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "device_browse_replace",
        description: "Open browser to replace selected device",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "project_get_summary",
        description: "Get a high-level summary of the project state (transport, tracks, scenes, selection)",
        inputSchema: { type: "object", properties: {} },
      },
      // --- Application Tools ---
      {
        name: "application_create_instrument_track",
        description: "Create a new instrument track",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "application_create_audio_track",
        description: "Create a new audio track",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "application_create_effect_track",
        description: "Create a new effect (return) track",
        inputSchema: { type: "object", properties: {} },
      },
      // --- Device Tools ---
      {
        name: "device_get_status",
        description: "Get status of the currently selected device",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "device_toggle_window",
        description: "Toggle the device window",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "device_toggle_expanded",
        description: "Toggle the device expanded view",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "device_list",
        description: "List devices on a specific track",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
          },
          required: ["trackIndex"],
        },
      },
      {
        name: "device_bypass",
        description: "Toggle device bypass state",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
            deviceIndex: { type: "number", description: "Device index 0-7" },
            bypass: { type: "boolean", description: "True to bypass (disable), False to enable" },
          },
          required: ["trackIndex", "deviceIndex", "bypass"],
        },
      },
      {
        name: "device_delete",
        description: "Delete a device from a track (REQUIRES_CONFIRMATION)",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
            deviceIndex: { type: "number", description: "Device index 0-7" },
          },
          required: ["trackIndex", "deviceIndex"],
        },
      },
      {
        name: "device_get_remote_controls",
        description: "Get the 8 remote control parameters for the current page",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "device_set_remote_control",
        description: "Set value for a remote control parameter",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Parameter index 0-7" },
            value: { type: "number", description: "Value 0.0 to 1.0" },
          },
          required: ["index", "value"],
        },
      },
      {
        name: "device_page_next",
        description: "Select next remote controls page",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "device_page_previous",
        description: "Select previous remote controls page",
        inputSchema: { type: "object", properties: {} },
      },
      // --- Clip Tools ---
      {
        name: "clip_get_info",
        description: "Get information about the currently selected clip",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "clip_set_note",
        description: "Set a note at a specific step in the clip",
        inputSchema: {
          type: "object",
          properties: {
            step: { type: "number", description: "Step position (0-based)" },
            pitch: { type: "number", description: "MIDI pitch (0-127)" },
            velocity: { type: "number", description: "Velocity (0.0-1.0)" },
            duration: { type: "number", description: "Duration in steps" },
          },
          required: ["step", "pitch", "velocity", "duration"],
        },
      },
      {
        name: "clip_clear_note",
        description: "Clear a note at a specific step",
        inputSchema: {
          type: "object",
          properties: {
            step: { type: "number", description: "Step position (0-based)" },
            pitch: { type: "number", description: "MIDI pitch (0-127)" },
          },
          required: ["step", "pitch"],
        },
      },
      {
        name: "clip_toggle_note",
        description: "Toggle a note on/off at a specific step",
        inputSchema: {
          type: "object",
          properties: {
            step: { type: "number", description: "Step position (0-based)" },
            pitch: { type: "number", description: "MIDI pitch (0-127)" },
            velocity: { type: "number", description: "Velocity if creating (0.0-1.0), default 1.0" },
          },
          required: ["step", "pitch"],
        },
      },
      {
        name: "clip_get_notes",
        description: "Get notes in a step range (placeholder - requires observer pattern)",
        inputSchema: {
          type: "object",
          properties: {
            startStep: { type: "number", description: "Starting step (0-based)" },
            stepCount: { type: "number", description: "Number of steps to read" },
            pitch: { type: "number", description: "MIDI pitch (0-127)" },
          },
          required: ["startStep", "stepCount", "pitch"],
        },
      },
      // --- Mixer Tools ---
      {
        name: "mixer_get_master_volume",
        description: "Get the current master volume (0.0 to 1.0)",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "mixer_set_master_volume",
        description: "Set the master volume",
        inputSchema: {
          type: "object",
          properties: {
            value: { type: "number", description: "Volume value 0.0 to 1.0" },
          },
          required: ["value"],
        },
      },
      {
        name: "mixer_get_send_level",
        description: "Get send level for a track",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number", description: "Track index 0-7" },
            sendIndex: { type: "number", description: "Send index 0-1" },
          },
          required: ["trackIndex", "sendIndex"],
        },
      },
      {
        name: "mixer_set_send_level",
        description: "Set send level for a track",
        inputSchema: {
          type: "object",
          required: ["trackIndex", "sendIndex", "value"],
        },
      },
      {
        name: "mixer_return_list",
        description: "List all return (effect) tracks",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "mixer_return_set_volume",
        description: "Set volume for a return track",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Return track index 0-7" },
            value: { type: "number", description: "Volume value 0.0 to 1.0" },
          },
          required: ["index", "value"],
        },
      },
      {
        name: "mixer_return_set_pan",
        description: "Set pan for a return track",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Return track index 0-7" },
            value: { type: "number", description: "Pan value 0.0 to 1.0" },
          },
          required: ["index", "value"],
        },
      },
      // --- Browser Tools ---
      {
        name: "browser_get_status",
        description: "Check if the browser is currently open and get filter text",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "browser_list_results",
        description: "List current search results in the browser (up to 100 items)",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "browser_select_result",
        description: "Select a result from the list by index (Note: Limited support in v1)",
        inputSchema: {
          type: "object",
          properties: { index: { type: "number" } },
          required: ["index"]
        },
      },
      {
        name: "browser_commit",
        description: "Confirm selection (Insert) and close browser",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "browser_cancel",
        description: "Close browser without inserting",
        inputSchema: { type: "object", properties: {} },
      },
      // --- Transport Extras ---
      {
        name: "transport_toggle_metronome",
        description: "Toggle the metronome click",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_set_time_signature",
        description: "Set the transport time signature (e.g., 4/4)",
        inputSchema: {
          type: "object",
          properties: {
            numerator: { type: "number" },
            denominator: { type: "number" }
          },
          required: ["numerator", "denominator"]
        }
      },
    ],


  };
});

// --- Shared Tool Execution Logic ---
async function executeTool(name, args) {
  let result;

  switch (name) {
    case "transport_play":
      result = await callBitwig("transport.play");
      break;
    case "transport_stop":
      result = await callBitwig("transport.stop");
      break;
    case "transport_restart":
      result = await callBitwig("transport.restart");
      break;
    case "transport_record":
      result = await callBitwig("transport.record");
      break;
    case "transport_get_tempo":
      result = await callBitwig("transport.getTempo");
      break;
    case "transport_set_tempo":
      result = await callBitwig("transport.setTempo", [args.bpm]);
      break;
    case "transport_get_position":
      result = await callBitwig("transport.getPosition");
      break;
    case "transport_set_position":
      result = await callBitwig("transport.setPosition", [args.beats]);
      break;
    case "transport_playing_status":
      result = await callBitwig("transport.getIsPlaying");
      break;
    case "transport_toggle_loop":
      result = await callBitwig("transport.toggleLoop");
      break;
    case "transport_set_loop_start":
      result = await callBitwig("transport.setLoopStart", [args.beats]);
      break;
    case "transport_set_loop_end":
      result = await callBitwig("transport.setLoopEnd", [args.beats]);
      break;
    case "transport_get_loop_status":
      result = await callBitwig("transport.getLoopStatus");
      break;

    // --- Track Bank Tools ---
    case "track_bank_get_status":
      result = await callBitwig("track.bank.get_status");
      break;
    case "track_bank_set_volume":
      result = await callBitwig("track.bank.volume", [args.index, args.value]);
      break;
    case "track_bank_set_pan":
      result = await callBitwig("track.bank.pan", [args.index, args.value]);
      break;
    case "track_bank_set_mute":
      result = await callBitwig("track.bank.mute", [args.index, args.state]);
      break;
    case "track_bank_set_solo":
      result = await callBitwig("track.bank.solo", [args.index, args.state]);
      break;
    case "track_bank_select":
      result = await callBitwig("track.bank.select", [args.index]);
      break;
    case "track_delete":
      result = await callBitwig("track.delete", [args.index]);
      break;
    case "track_rename":
      result = await callBitwig("track.rename", [args.index, args.name]);
      break;
    case "track_duplicate":
      result = await callBitwig("track.duplicate", [args.index]);
      break;
    case "track_set_color":
      result = await callBitwig("track.set_color", [args.index, args.red, args.green, args.blue]);
      break;

    // --- Clip & Scene Tools ---
    case "clip_launch":
      result = await callBitwig("clip.launch", [args.trackIndex, args.slotIndex]);
      break;
    case "clip_record":
      result = await callBitwig("clip.record", [args.trackIndex, args.slotIndex]);
      break;
    case "clip_stop":
      result = await callBitwig("clip.stop", [args.trackIndex]);
      break;
    case "clip_get_status":
      result = await callBitwig("clip.get_status", [args.trackIndex, args.sceneIndex]);
      break;
    case "clip_get_grid":
      result = await callBitwig("clip.get_grid");
      break;
    case "clip_set_color":
      result = await callBitwig("clip.set_color", [args.trackIndex, args.sceneIndex, args.r, args.g, args.b]);
      break;
    case "clip_get_color":
      result = await callBitwig("clip.get_color", [args.trackIndex, args.sceneIndex]);
      break;
    case "scene_launch":
      result = await callBitwig("scene.launch", [args.sceneIndex]);
      break;
    case "scene_list":
      result = await callBitwig("scene.list");
      break;
    case "scene_create":
      result = await callBitwig("scene.create");
      break;
    case "scene_delete":
      result = await callBitwig("scene.delete", [args.sceneIndex]);
      break;
    case "scene_rename":
      result = await callBitwig("scene.rename", [args.sceneIndex, args.name]);
      break;
    case "scene_select":
      result = await callBitwig("scene.select", [args.sceneIndex]);
      break;
    case "scene_create_from_playing":
      result = await callBitwig("scene.create_from_playing");
      break;
    case "clip_duplicate":
      result = await callBitwig("clip.duplicate", [args.trackIndex, args.slotIndex]);
      break;
    case "clip_slot_select":
      result = await callBitwig("clip.select_slot", [args.trackIndex, args.slotIndex]);
      break;

    case "clip_create":
      result = await callBitwig("clip.create", [args.trackIndex, args.slotIndex, args.lengthBeats]);
      break;
    case "clip_delete":
      result = await callBitwig("clip.delete", [args.trackIndex, args.slotIndex]);
      break;
    case "clip_browse_insert":
      result = await callBitwig("clip.browse_insert", [args.trackIndex, args.slotIndex]);
      break;

    // --- Selected Track Tools ---
    case "track_selected_get_status":
      result = await callBitwig("track.selected.get_status");
      break;
    case "track_selected_set_volume":
      result = await callBitwig("track.selected.volume", [args.value]);
      break;
    case "track_selected_set_pan":
      result = await callBitwig("track.selected.pan", [args.value]);
      break;
    case "track_selected_set_mute":
      result = await callBitwig("track.selected.mute", [args.state]);
      break;
    case "track_selected_set_solo":
      result = await callBitwig("track.selected.solo", [args.state]);
      break;
    case "track_selected_set_arm":
      result = await callBitwig("track.selected.arm", [args.state]);
      break;

    // --- Application Tools ---
    case "application_create_instrument_track":
      result = await callBitwig("application.createInstrumentTrack");
      break;
    case "application_create_audio_track":
      result = await callBitwig("application.createAudioTrack");
      break;
    case "application_create_effect_track":
      result = await callBitwig("application.createEffectTrack");
      break;

    // --- Device Tools ---
    case "device_get_status":
      result = await callBitwig("device.get_status");
      break;
    case "device_toggle_window":
      result = await callBitwig("device.toggle_window");
      break;
    case "device_toggle_expanded":
      result = await callBitwig("device.toggle_expanded");
      break;
    case "device_list":
      result = await callBitwig("device.list", [args.trackIndex]);
      break;
    case "device_bypass":
      result = await callBitwig("device.bypass", [args.trackIndex, args.deviceIndex, args.bypass]);
      break;
    case "device_delete":
      result = await callBitwig("device.delete", [args.trackIndex, args.deviceIndex]);
      break;
    case "device_get_remote_controls":
      result = await callBitwig("device.get_remote_controls");
      break;
    case "device_set_remote_control":
      result = await callBitwig("device.set_remote_control", [args.index, args.value]);
      break;
    case "device_page_next":
      result = await callBitwig("device.page_next");
      break;
    case "device_page_previous":
      result = await callBitwig("device.page_previous");
      break;
    case "device_select_next":
      result = await callBitwig("device.select_next");
      break;
    case "device_select_previous":
      result = await callBitwig("device.select_previous");
      break;
    case "device_browse_insert_before":
      result = await callBitwig("device.browse_insert_before");
      break;
    case "device_browse_insert_after":
      result = await callBitwig("device.browse_insert_after");
      break;
    case "device_browse_replace":
      result = await callBitwig("device.browse_replace");
      break;

    // --- Clip Tools ---
    case "clip_get_info":
      result = await callBitwig("clip.get_info");
      break;
    case "clip_set_note":
      result = await callBitwig("clip.set_note", [args.step, args.pitch, args.velocity, args.duration]);
      break;
    case "clip_clear_note":
      result = await callBitwig("clip.clear_note", [args.step, args.pitch]);
      break;
    case "clip_toggle_note":
      result = await callBitwig("clip.toggle_note", [args.step, args.pitch, args.velocity]);
      break;
    case "clip_get_notes":
      result = await callBitwig("clip.get_notes", [args.startStep, args.stepCount, args.pitch]);
      break;

    // --- Mixer Tools ---
    case "mixer_get_master_volume":
      result = await callBitwig("mixer.master.get_volume");
      break;
    case "mixer_set_master_volume":
      result = await callBitwig("mixer.master.set_volume", [args.value]);
      break;
    case "mixer_get_send_level":
      result = await callBitwig("mixer.send.get_level", [args.trackIndex, args.sendIndex]);
      break;
    case "mixer_set_send_level":
      result = await callBitwig("mixer.send.set_level", [args.trackIndex, args.sendIndex, args.value]);
      break;
    case "mixer_return_list":
      result = await callBitwig("mixer.return.list");
      break;
    case "mixer_return_set_volume":
      result = await callBitwig("mixer.return.volume", [args.index, args.value]);
      break;
    case "mixer_return_set_pan":
      result = await callBitwig("mixer.return.pan", [args.index, args.value]);
      break;

    case "project_get_summary":
      result = await callBitwig("project.get_summary");
      break;

    // --- Browser Tools ---
    case "browser_get_status":
      result = await callBitwig("browser.get_status");
      break;
    case "browser_list_results":
      result = await callBitwig("browser.list_results");
      break;
    case "browser_select_result":
      result = await callBitwig("browser.select_result", [args.index]);
      break;
    case "browser_commit":
      result = await callBitwig("browser.commit");
      break;
    case "browser_cancel":
      result = await callBitwig("browser.cancel");
      break;

    // --- Transport Extras ---
    case "transport_toggle_metronome":
      result = await callBitwig("transport.toggle_metronome");
      break;
    case "transport_set_time_signature":
      result = await callBitwig("transport.time_signature", [args.numerator, args.denominator]);
      break;

    default:
      throw new Error(`Unknown tool: ${name}`);
  }

  return result;
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    const result = await executeTool(name, args);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Bitwig MCP Server running on stdio");
}

runServer().catch(console.error);