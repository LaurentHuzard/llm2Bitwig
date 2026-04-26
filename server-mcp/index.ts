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
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import net from "net";
import { WebSocketServer, type RawData, type WebSocket } from "ws";

type PendingRequest = {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
};

type ToolArgs = Record<string, unknown>;
type ToolRequest = { params: { name: string; arguments?: ToolArgs } };
type WsCallMessage = { action: "call"; method: string; params?: ToolArgs; id?: string | number };

// --- Bitwig Connection Configuration ---
const BITWIG_HOST = "127.0.0.1";
const BITWIG_PORT = 8888;
let client: net.Socket | null = null;
let requestId = 0;
const pendingRequests = new Map<number, PendingRequest>();
const WS_PORT = Number(process.env.BITWIG_MCP_WS_PORT ?? 2624);
let wss: WebSocketServer | null = null;

// --- TCP Client Setup ---
function connectToBitwig(): Promise<void> {
  return new Promise((resolve, reject) => {
    client = new net.Socket();

    client.connect(BITWIG_PORT, BITWIG_HOST, () => {
      console.error(`Connected to Bitwig at ${BITWIG_HOST}:${BITWIG_PORT}`);
      // Give Bitwig a moment to register callbacks
      setTimeout(() => resolve(), 500);
    });

    client.on("data", (data) => {
      // Handle incoming data (stream handling needed for robust impl, simplistic for now)
      const lines = data.toString().split("\n");
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const response = JSON.parse(line) as {
            id?: number;
            error?: { message?: string };
            result?: unknown;
            method?: string;
            params?: unknown;
          };
          const responseId = response.id;
          const pending =
            responseId !== undefined ? pendingRequests.get(responseId) : undefined;
          if (pending && responseId !== undefined) {
            if (response.error) {
              pending.reject(new Error(response.error.message ?? "Unknown error"));
            } else {
              pending.resolve(response.result);
            }
            pendingRequests.delete(responseId);
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
      reject(err);
    });
  });
}

async function ensureConnected(): Promise<void> {
  if (!client) {
    await connectToBitwig();
  }
}

// --- JSON-RPC Helper ---
function callBitwig(method: string, params: unknown[] = []): Promise<unknown> {
  return new Promise((resolve, reject) => {
    ensureConnected()
      .then(() => {
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
        client?.write(Buffer.concat([header, msgBuf]));

        // Timeout
        setTimeout(() => {
          const pending = pendingRequests.get(id);
          if (pending) {
            pending.reject(new Error("Timeout waiting for Bitwig response"));
            pendingRequests.delete(id);
          }
        }, 5000);
      })
      .catch(() => {
        reject(new Error("Could not connect to Bitwig. Is it running?"));
      });
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
      resources: {},
      prompts: {},
    },
  }
);

// --- Ear Service Client ---
const EAR_SERVICE_URL = "http://127.0.0.1:8001";

async function callEarService(endpoint: string, method: string = "GET"): Promise<unknown> {
  try {
    const response = await fetch(`${EAR_SERVICE_URL}${endpoint}`, { method });
    if (!response.ok) {
      throw new Error(`Ear service returned ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to contact Ear Service: ${String(error)}. Is it running?`);
  }
}

// --- WebSocket Server Setup ---
function startWebSocketServer(): void {
  wss = new WebSocketServer({ port: WS_PORT });
  console.error(`WebSocket server listening on port ${WS_PORT}`);

  wss.on("connection", (ws: any) => {
    console.error("New WebSocket connection");

    ws.on("message", (message: RawData) => {
      try {
        const data = JSON.parse(String(message)) as WsCallMessage;
        if (data.action === "call") {
          executeTool(data.method, (data.params ?? {}) as ToolArgs)
            .then(result => {
              ws.send(JSON.stringify({ id: data.id, result }));
            })
            .catch(err => {
              const errorMessage = err instanceof Error ? err.message : "Unknown error";
              ws.send(JSON.stringify({ id: data.id, error: errorMessage }));
            });
        }
      } catch (err) {
        console.error("Error processing WS message:", err);
      }
    });
  });
}

function broadcastToClients(data: unknown): void {
  if (!wss) return;
  const msg = JSON.stringify(data);
  wss.clients.forEach((clientSocket: WebSocket) => {
    if (clientSocket.readyState === 1) { // OPEN
      clientSocket.send(msg);
    }
  });
}

if (process.argv.includes("--stdio")) {
  console.error("Bitwig MCP Server running on stdio (WebSocket disabled)");
} else {
  startWebSocketServer();
}

// --- Resource Implementation ---
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "bitwig://project/summary",
        name: "Project Summary",
        mimeType: "application/json",
        description: "Overview of the current project state (transport, selection, etc.)"
      },
      {
        uri: "bitwig://tracks",
        name: "Track List",
        mimeType: "application/json",
        description: "List of all tracks in the current bank"
      },
      {
        uri: "bitwig://devices",
        name: "Device List",
        mimeType: "application/json",
        description: "List of devices on the currently selected track"
      }
    ]
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  let content = "";

  try {
    if (uri === "bitwig://project/summary") {
      const data = await callBitwig("project.get_summary");
      content = JSON.stringify(data, null, 2);
    } else if (uri === "bitwig://tracks") {
      const data = await callBitwig("track.list");
      content = JSON.stringify(data, null, 2);
    } else if (uri === "bitwig://devices") {
      const data = await callBitwig("device.list");
      content = JSON.stringify(data, null, 2);
    }

    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: content,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to read resource ${uri}: ${String(error)}`);
  }
});

// --- Tool Implementation ---
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // --- Ear Tools ---
      {
        name: "ear_status",
        description: "Get the current status and levels from the ear-service",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "ear_get_levels",
        description: "Get real-time peak and RMS levels",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "ear_list_devices",
        description: "List available audio input devices for the ear",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "ear_set_device",
        description: "Set the active audio input device",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Device index from ear_list_devices" },
          },
          required: ["index"],
        },
      },
      {
        name: "ear_listen",
        description: "Capture the last N seconds of audio as base64 WAV",
        inputSchema: {
          type: "object",
          properties: {
            seconds: { type: "number", description: "Seconds to capture (max 10)", default: 5 },
          },
        },
      },
      {
        name: "ear_analyze",
        description: "Analyze the last N seconds of audio (BPM, Key, Spectral Energy)",
        inputSchema: {
          type: "object",
          properties: {
            seconds: { type: "number", description: "Seconds to analyze", default: 1.0 },
          },
        },
      },
      // --- Transport Tools ---
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
        description: "Restart playback from current position",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_record",
        description: "Toggle arranger recording",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_get_tempo",
        description: "Get the project tempo (BPM)",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_set_tempo",
        description: "Set the project tempo (BPM)",
        inputSchema: {
          type: "object",
          properties: {
            bpm: { type: "number", description: "BPM value" },
          },
          required: ["bpm"],
        },
      },
      {
        name: "transport_get_position",
        description: "Get the current playhead position in beats",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_set_position",
        description: "Set the current playhead position in beats",
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
        description: "Check if Bitwig is currently playing",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_get_recording_status",
        description: "Check if Bitwig is currently recording",
        inputSchema: { type: "object", properties: {} },
      },
      // --- Track Bank Tools ---
      {
        name: "track_bank_get_status",
        description: "Get status of the tracks in the current bank (0-7)",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "track_bank_set_volume",
        description: "Set track volume in the bank",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Track index (0-7)" },
            value: { type: "number", description: "Normalized volume (0.0 - 1.0)" },
          },
          required: ["index", "value"],
        },
      },
      {
        name: "track_bank_set_pan",
        description: "Set track panning in the bank",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number" },
            value: { type: "number", description: "Pan (-1.0 to 1.0)" },
          },
          required: ["index", "value"],
        },
      },
      {
        name: "track_bank_set_mute",
        description: "Set track mute state in the bank",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number" },
            state: { type: "boolean" },
          },
          required: ["index", "state"],
        },
      },
      {
        name: "track_bank_set_solo",
        description: "Set track solo state in the bank",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number" },
            state: { type: "boolean" },
          },
          required: ["index", "state"],
        },
      },
      {
        name: "track_bank_select",
        description: "Select a track in the bank",
        inputSchema: {
          type: "object",
          properties: { index: { type: "number" } },
          required: ["index"],
        },
      },
      {
        name: "track_delete",
        description: "Delete a track by bank index",
        inputSchema: {
          type: "object",
          properties: { index: { type: "number" } },
          required: ["index"]
        }
      },
      {
        name: "track_rename",
        description: "Rename a track",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number" },
            name: { type: "string" }
          },
          required: ["index", "name"]
        }
      },
      {
        name: "track_duplicate",
        description: "Duplicate a track",
        inputSchema: {
          type: "object",
          properties: { index: { type: "number" } },
          required: ["index"]
        }
      },
      {
        name: "track_set_color",
        description: "Set track color (0-1)",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number" },
            red: { type: "number" },
            green: { type: "number" },
            blue: { type: "number" }
          },
          required: ["index", "red", "green", "blue"]
        }
      },
      {
        name: "track_list",
        description: "List all tracks in the current project (visible bank)",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "track_get_info",
        description: "Get detailed information for a track by index",
        inputSchema: {
          type: "object",
          properties: { index: { type: "number" } },
          required: ["index"]
        }
      },
      {
        name: "track_scroll_into_view",
        description: "Scroll a track into view",
        inputSchema: {
          type: "object",
          properties: { index: { type: "number" } },
          required: ["index"]
        }
      },
      {
        name: "track_bank_scroll_forward",
        description: "Scroll track bank forward",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "track_bank_scroll_backward",
        description: "Scroll track bank backward",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "track_bank_scroll_to_position",
        description: "Scroll track bank to a position",
        inputSchema: {
          type: "object",
          properties: { position: { type: "number" } },
          required: ["position"]
        }
      },
      // --- Clip & Scene Tools ---
      {
        name: "clip_launch",
        description: "Launch a clip slot",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number" },
            slotIndex: { type: "number" }
          },
          required: ["trackIndex", "slotIndex"]
        }
      },
      {
        name: "clip_record",
        description: "Record into a clip slot",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number" },
            slotIndex: { type: "number" }
          },
          required: ["trackIndex", "slotIndex"]
        }
      },
      {
        name: "clip_stop",
        description: "Stop playing clips on a track",
        inputSchema: {
          type: "object",
          properties: { trackIndex: { type: "number" } },
          required: ["trackIndex"]
        }
      },
      {
        name: "clip_get_status",
        description: "Get status of a clip slot",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number" },
            sceneIndex: { type: "number" }
          },
          required: ["trackIndex", "sceneIndex"]
        }
      },
      {
        name: "clip_get_grid",
        description: "Get the 8x8 clip launcher grid status",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "clip_set_color",
        description: "Set clip color",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number" },
            sceneIndex: { type: "number" },
            r: { type: "number" },
            g: { type: "number" },
            b: { type: "number" }
          },
          required: ["trackIndex", "sceneIndex", "r", "g", "b"]
        }
      },
      {
        name: "clip_get_color",
        description: "Get clip color",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number" },
            sceneIndex: { type: "number" }
          },
          required: ["trackIndex", "sceneIndex"]
        }
      },
      {
        name: "scene_launch",
        description: "Launch a scene",
        inputSchema: {
          type: "object",
          properties: { sceneIndex: { type: "number" } },
          required: ["sceneIndex"]
        }
      },
      {
        name: "scene_list",
        description: "List all scenes",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "scene_create",
        description: "Create a new scene",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "scene_delete",
        description: "Delete a scene",
        inputSchema: {
          type: "object",
          properties: { sceneIndex: { type: "number" } },
          required: ["sceneIndex"]
        }
      },
      {
        name: "scene_rename",
        description: "Rename a scene",
        inputSchema: {
          type: "object",
          properties: {
            sceneIndex: { type: "number" },
            name: { type: "string" }
          },
          required: ["sceneIndex", "name"]
        }
      },
      {
        name: "scene_select",
        description: "Select a scene",
        inputSchema: {
          type: "object",
          properties: { sceneIndex: { type: "number" } },
          required: ["sceneIndex"]
        }
      },
      {
        name: "scene_create_from_playing",
        description: "Create a scene from currently playing clips",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "clip_duplicate",
        description: "Duplicate a clip",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number" },
            slotIndex: { type: "number" }
          },
          required: ["trackIndex", "slotIndex"]
        }
      },
      {
        name: "clip_slot_select",
        description: "Select a clip slot",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number" },
            slotIndex: { type: "number" }
          },
          required: ["trackIndex", "slotIndex"]
        }
      },
      {
        name: "clip_create",
        description: "Create an empty clip",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number" },
            slotIndex: { type: "number" },
            lengthBeats: { type: "number" }
          },
          required: ["trackIndex", "slotIndex", "lengthBeats"]
        }
      },
      {
        name: "clip_delete",
        description: "Delete a clip",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number" },
            slotIndex: { type: "number" }
          },
          required: ["trackIndex", "slotIndex"]
        }
      },
      {
        name: "clip_browse_insert",
        description: "Open browser to insert clip at slot",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number" },
            slotIndex: { type: "number" }
          },
          required: ["trackIndex", "slotIndex"]
        }
      },
      // --- Selected Track Tools ---
      {
        name: "track_selected_get_status",
        description: "Get status of the currently selected track",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "track_selected_set_volume",
        description: "Set volume of selected track",
        inputSchema: {
          type: "object",
          properties: { value: { type: "number" } },
          required: ["value"]
        },
      },
      {
        name: "track_selected_set_pan",
        description: "Set pan of selected track",
        inputSchema: {
          type: "object",
          properties: { value: { type: "number" } },
          required: ["value"]
        },
      },
      {
        name: "track_selected_set_mute",
        description: "Set mute of selected track",
        inputSchema: {
          type: "object",
          properties: { state: { type: "boolean" } },
          required: ["state"]
        },
      },
      {
        name: "track_selected_set_solo",
        description: "Set solo of selected track",
        inputSchema: {
          type: "object",
          properties: { state: { type: "boolean" } },
          required: ["state"]
        },
      },
      {
        name: "track_selected_set_arm",
        description: "Set arm of selected track",
        inputSchema: {
          type: "object",
          properties: { state: { type: "boolean" } },
          required: ["state"]
        },
      },
      {
        name: "cursor_track_get_status",
        description: "Get detailed status of the cursor track",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "cursor_device_get_status",
        description: "Get detailed status of the cursor device",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "cursor_clip_get_status",
        description: "Get detailed status of the cursor clip",
        inputSchema: { type: "object", properties: {} }
      },
      // --- Application Tools ---
      {
        name: "application_create_instrument_track",
        description: "Create a new instrument track",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "application_create_audio_track",
        description: "Create a new audio track",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "application_create_effect_track",
        description: "Create a new effect track",
        inputSchema: { type: "object", properties: {} }
      },
      // --- Device Tools ---
      {
        name: "device_get_status",
        description: "Get status of the selected device",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "device_toggle_window",
        description: "Toggle device window visibility",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "device_toggle_expanded",
        description: "Toggle device expanded state",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "device_list",
        description: "List devices on a track",
        inputSchema: {
          type: "object",
          properties: { trackIndex: { type: "number" } },
          required: ["trackIndex"]
        }
      },
      {
        name: "device_bypass",
        description: "Bypass/Enable a device",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number" },
            deviceIndex: { type: "number" },
            bypass: { type: "boolean" }
          },
          required: ["trackIndex", "deviceIndex", "bypass"]
        }
      },
      {
        name: "device_delete",
        description: "Delete a device",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number" },
            deviceIndex: { type: "number" }
          },
          required: ["trackIndex", "deviceIndex"]
        }
      },
      {
        name: "device_get_remote_controls",
        description: "Get current remote control page parameters",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "device_set_remote_control",
        description: "Set a remote control parameter value",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number" },
            value: { type: "number" }
          },
          required: ["index", "value"]
        }
      },
      {
        name: "device_page_next",
        description: "Go to next remote control page",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "device_page_previous",
        description: "Go to previous remote control page",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "device_select_next",
        description: "Select next device in chain",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "device_select_previous",
        description: "Select previous device in chain",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "device_select_first",
        description: "Select first device in chain",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "device_select_last",
        description: "Select last device in chain",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "device_browse_insert_before",
        description: "Open browser to insert device before selected",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "device_browse_insert_after",
        description: "Open browser to insert device after selected",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "device_browse_replace",
        description: "Open browser to replace selected device",
        inputSchema: { type: "object", properties: {} }
      },
      // --- Clip Tools ---
      {
        name: "clip_get_info",
        description: "Get information about the cursor clip",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "clip_set_note",
        description: "Set a note in the cursor clip",
        inputSchema: {
          type: "object",
          properties: {
            step: { type: "number" },
            pitch: { type: "number" },
            velocity: { type: "number" },
            duration: { type: "number" }
          },
          required: ["step", "pitch", "velocity", "duration"]
        }
      },
      {
        name: "clip_clear_note",
        description: "Clear a note at a specific step",
        inputSchema: {
          type: "object",
          properties: {
            step: { type: "number" },
            pitch: { type: "number" }
          },
          required: ["step", "pitch"]
        }
      },
      {
        name: "clip_toggle_note",
        description: "Toggle a note in the cursor clip",
        inputSchema: {
          type: "object",
          properties: {
            step: { type: "number" },
            pitch: { type: "number" },
            velocity: { type: "number" }
          },
          required: ["step", "pitch", "velocity"]
        }
      },
      {
        name: "clip_get_notes",
        description: "List notes in a range",
        inputSchema: {
          type: "object",
          properties: {
            startStep: { type: "number" },
            stepCount: { type: "number" },
            pitch: { type: "number" }
          },
          required: ["startStep", "stepCount", "pitch"]
        }
      },
      // --- Mixer Tools ---
      {
        name: "mixer_get_master_volume",
        description: "Get the master track volume",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "mixer_set_master_volume",
        description: "Set the master track volume",
        inputSchema: {
          type: "object",
          properties: { value: { type: "number" } },
          required: ["value"]
        }
      },
      {
        name: "mixer_get_send_level",
        description: "Get track send level",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number" },
            sendIndex: { type: "number" }
          },
          required: ["trackIndex", "sendIndex"]
        }
      },
      {
        name: "mixer_set_send_level",
        description: "Set track send level",
        inputSchema: {
          type: "object",
          properties: {
            trackIndex: { type: "number" },
            sendIndex: { type: "number" },
            value: { type: "number" }
          },
          required: ["trackIndex", "sendIndex", "value"]
        }
      },
      {
        name: "mixer_return_list",
        description: "List return tracks",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "mixer_return_set_volume",
        description: "Set return track volume",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number" },
            value: { type: "number" }
          },
          required: ["index", "value"]
        }
      },
      {
        name: "mixer_return_set_pan",
        description: "Set return track pan",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number" },
            value: { type: "number" }
          },
          required: ["index", "value"]
        }
      },
      {
        name: "project_get_summary",
        description: "Get project summary",
        inputSchema: { type: "object", properties: {} }
      },
      // --- Arranger Tools ---
      {
        name: "arranger_get_status",
        description: "Get status of the Arranger (visibility, zoom, panels)",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "arranger_set_panel_visibility",
        description: "Set visibility of Arranger panels",
        inputSchema: {
          type: "object",
          properties: {
            panel: { type: "string", description: "Panel name: timeline, io, clip_launcher, effect_tracks, double_row_height, cue_markers, playback_follow" },
            state: { type: "boolean", description: "True to show, False to hide" },
          },
          required: ["panel", "state"],
        },
      },
      {
        name: "arranger_zoom",
        description: "Zoom arranger lanes",
        inputSchema: {
          type: "object",
          properties: {
            action: { type: "string", description: "Action: in_all, out_all, in_selected, out_selected" },
          },
          required: ["action"],
        },
      },
      {
        name: "arranger_get_cue_markers",
        description: "List all cue markers",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "arranger_jump_to_cue_marker",
        description: "Jump to a cue marker by index",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Marker index (0-31)" },
          },
          required: ["index"],
        },
      },
      // --- Note Input Tools ---
      {
        name: "midi_send_raw",
        description: "Send raw MIDI bytes",
        inputSchema: {
          type: "object",
          properties: {
            status: { type: "number", description: "Status byte (e.g., 144 for Note On Ch1)" },
            data1: { type: "number", description: "Data byte 1" },
            data2: { type: "number", description: "Data byte 2" },
          },
          required: ["status", "data1", "data2"],
        },
      },
      {
        name: "note_on",
        description: "Send Note On message",
        inputSchema: {
          type: "object",
          properties: {
            channel: { type: "number", description: "MIDI Channel (0-15)" },
            pitch: { type: "number", description: "MIDI Pitch (0-127)" },
            velocity: { type: "number", description: "Velocity (0-127)" },
          },
          required: ["channel", "pitch", "velocity"],
        },
      },
      {
        name: "note_off",
        description: "Send Note Off message",
        inputSchema: {
          type: "object",
          properties: {
            channel: { type: "number", description: "MIDI Channel (0-15)" },
            pitch: { type: "number", description: "MIDI Pitch (0-127)" },
            velocity: { type: "number", description: "Velocity (0-127)" },
          },
          required: ["channel", "pitch", "velocity"],
        },
      },
      {
        name: "note_play",
        description: "Play a note for a duration (helper method)",
        inputSchema: {
          type: "object",
          properties: {
            channel: { type: "number", description: "MIDI Channel (0-15)" },
            pitch: { type: "number", description: "MIDI Pitch (0-127)" },
            velocity: { type: "number", description: "Velocity (0-127)" },
            duration: { type: "number", description: "Duration in ms" },
          },
          required: ["channel", "pitch", "velocity", "duration"],
        },
      },
      // --- Note Input Advanced ---
      {
        name: "note_input_assign_expression",
        description: "Assign polyphonic aftertouch to a note expression (MPE)",
        inputSchema: {
          type: "object",
          properties: {
            channel: { type: "number", description: "MIDI channel (0-15)" },
            expression: { type: "string", enum: ["NONE", "PITCH", "TIMBRE", "PRESSURE"] },
            pitchRange: { type: "number", description: "Pitch range in semitones" }
          },
          required: ["channel", "expression", "pitchRange"]
        }
      },
      {
        name: "note_input_set_mpe",
        description: "Enable or disable MPE (Multidimensional Polyphonic Expression)",
        inputSchema: {
          type: "object",
          properties: {
            enabled: { type: "boolean" },
            baseChannel: { type: "number", description: "Base channel (0-15)" },
            pitchBendRange: { type: "number", description: "Pitch bend range in semitones" }
          },
          required: ["enabled", "baseChannel", "pitchBendRange"]
        }
      },
      {
        name: "note_input_set_key_translation",
        description: "Set the key translation table (128 entries)",
        inputSchema: {
          type: "object",
          properties: {
            table: { type: "array", items: { type: "number" } }
          },
          required: ["table"]
        }
      },
      {
        name: "note_input_set_velocity_translation",
        description: "Set the velocity translation table (128 entries)",
        inputSchema: {
          type: "object",
          properties: {
            table: { type: "array", items: { type: "number" } }
          },
          required: ["table"]
        }
      },
      // --- Drum Pad Tools ---
      {
        name: "drumpad_get_status",
        description: "Get status of the drum pads for the selected device",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "drumpad_select",
        description: "Select a drum pad by index",
        inputSchema: {
          type: "object",
          properties: { index: { type: "number" } },
          required: ["index"]
        }
      },
      {
        name: "drumpad_scroll_forward",
        description: "Scroll drum pad bank forward",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "drumpad_scroll_backward",
        description: "Scroll drum pad bank backward",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "drumpad_set_volume",
        description: "Set drum pad volume",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number" },
            value: { type: "number", description: "0.0 to 1.0" }
          },
          required: ["index", "value"]
        }
      },
      {
        name: "drumpad_set_mute",
        description: "Set drum pad mute state",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number" },
            state: { type: "boolean" }
          },
          required: ["index", "state"]
        }
      },
      {
        name: "drumpad_set_solo",
        description: "Set drum pad solo state",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number" },
            state: { type: "boolean" }
          },
          required: ["index", "state"]
        }
      },
      // --- Groove Tools ---
      {
        name: "groove_get_status",
        description: "Get global project groove settings",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "groove_set_enabled",
        description: "Enable or disable global groove",
        inputSchema: {
          type: "object",
          properties: { state: { type: "boolean" } },
          required: ["state"]
        }
      },
      {
        name: "groove_set_shuffle_amount",
        description: "Set groove shuffle amount",
        inputSchema: {
          type: "object",
          properties: { value: { type: "number", description: "0.0 to 1.0" } },
          required: ["value"]
        }
      },
      // --- Project Mixer Tools ---
      {
        name: "project_unsolo_all",
        description: "Unsolo all tracks in the project",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "project_unmute_all",
        description: "Unmute all tracks in the project",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "project_unarm_all",
        description: "Unarm all tracks in the project",
        inputSchema: { type: "object", properties: {} }
      },
      // --- Arranger Advanced ---
      {
        name: "arranger_cues_create",
        description: "Create a cue marker at the current playback position",
        inputSchema: { type: "object", properties: {} }
      },
      // --- Browser Tools ---
      {
        name: "browser_get_status",
        description: "Get the status of the popup browser",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "browser_set_filter",
        description: "Set the browser filter/search text",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Filter text to apply" },
          },
          required: ["text"],
        },
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
      {
        name: "transport_tap_tempo",
        description: "Tap tempo to set BPM by rhythm",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_toggle_punch_in",
        description: "Toggle punch in recording mode",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_toggle_punch_out",
        description: "Toggle punch out recording mode",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_set_punch_in",
        description: "Set punch in recording mode state",
        inputSchema: {
          type: "object",
          properties: {
            state: { type: "boolean", description: "True to enable, False to disable" }
          },
          required: ["state"]
        }
      },
      {
        name: "transport_set_punch_out",
        description: "Set punch out recording mode state",
        inputSchema: {
          type: "object",
          properties: {
            state: { type: "boolean", description: "True to enable, False to disable" }
          },
          required: ["state"]
        }
      },
      {
        name: "transport_get_punch_status",
        description: "Get current punch in/out status",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_toggle_arranger_overdub",
        description: "Toggle arranger overdub recording mode",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_toggle_launcher_overdub",
        description: "Toggle clip launcher overdub recording mode",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_get_overdub_status",
        description: "Get current arranger and launcher overdub status",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_continue_playback",
        description: "Continue playback from current position",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_return_to_zero",
        description: "Return playhead to start of project (position 0)",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_fast_forward",
        description: "Fast forward transport",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_rewind",
        description: "Rewind transport",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_nudge_forward",
        description: "Nudge playhead forward by 1 beat",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "transport_nudge_backward",
        description: "Nudge playhead backward by 1 beat",
        inputSchema: { type: "object", properties: {} },
      },
      // --- Arranger Tools ---
      {
        name: "arranger_get_status",
        description: "Get status of the Arranger (visibility, zoom, panels)",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "arranger_set_panel_visibility",
        description: "Set visibility of Arranger panels",
        inputSchema: {
          type: "object",
          properties: {
            panel: { type: "string", description: "Panel name: timeline, io, clip_launcher, effect_tracks, double_row_height, cue_markers, playback_follow" },
            state: { type: "boolean", description: "True to show, False to hide" },
          },
          required: ["panel", "state"],
        },
      },
      {
        name: "arranger_zoom",
        description: "Zoom arranger lanes",
        inputSchema: {
          type: "object",
          properties: {
            action: { type: "string", description: "Action: in_all, out_all, in_selected, out_selected" },
          },
          required: ["action"],
        },
      },
      {
        name: "arranger_cues_list",
        description: "List all cue markers",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "arranger_cues_jump",
        description: "Jump to a cue marker by index",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number", description: "Marker index (0-31)" },
          },
          required: ["index"],
        },
      },
      {
        name: "arranger_cues_rename",
        description: "Rename a cue marker",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number" },
            name: { type: "string" }
          },
          required: ["index", "name"]
        }
      },
      {
        name: "arranger_cues_color",
        description: "Set cue marker color",
        inputSchema: {
          type: "object",
          properties: {
            index: { type: "number" },
            r: { type: "number" },
            g: { type: "number" },
            b: { type: "number" }
          },
          required: ["index", "r", "g", "b"]
        }
      },
      {
        name: "transport_add_cue_marker",
        description: "Add a cue marker at the current playback position",
        inputSchema: { type: "object", properties: {} }
      },
      // --- Application Tools ---
      {
        name: "application_undo",
        description: "Undo last action",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "application_redo",
        description: "Redo last action",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "application_cut",
        description: "Cut selection",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "application_copy",
        description: "Copy selection",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "application_paste",
        description: "Paste from clipboard",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "application_delete",
        description: "Delete selection",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "application_duplicate",
        description: "Duplicate selection",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "application_select_all",
        description: "Select all",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "application_select_none",
        description: "Deselect all",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "application_arrow_key",
        description: "Simulate arrow key press",
        inputSchema: {
          type: "object",
          properties: {
            direction: { type: "string", description: "up, down, left, right" }
          },
          required: ["direction"]
        }
      },
      {
        name: "application_enter",
        description: "Simulate Enter key press",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "application_escape",
        description: "Simulate Escape key press",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "application_zoom_in",
        description: "Zoom in",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "application_zoom_out",
        description: "Zoom out",
        inputSchema: { type: "object", properties: {} }
      },
    ],
  };
});

// --- Shared Tool Execution Logic ---
async function executeTool(name: string, args: ToolArgs) {
  let result;

  switch (name) {
    // --- Ear Tools ---
    case "ear_status":
      try {
        const levels = await callEarService("/levels");
        result = { status: "connected", levels };
      } catch (e) {
        result = { status: "disconnected", error: String(e) };
      }
      break;
    case "ear_get_levels":
      result = await callEarService("/levels");
      break;
    case "ear_list_devices":
      result = await callEarService("/devices");
      break;
    case "ear_set_device":
      result = await callEarService(`/device/${args.index}`, "POST");
      break;
    case "ear_listen":
      {
        const seconds = args.seconds ? Number(args.seconds) : 5;
        result = await callEarService(`/listen?seconds=${seconds}`);
      }
      break;
    case "ear_analyze":
      {
        const seconds = args.seconds ? Number(args.seconds) : 1.0;
        result = await callEarService(`/analyze?seconds=${seconds}`);
      }
      break;

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
    case "transport_get_recording_status":
      result = await callBitwig("transport.getIsRecording");
      break;

    // --- Arranger Tools ---
    case "arranger_get_status":
      result = await callBitwig("arranger.get_status");
      break;
    case "arranger_set_panel_visibility":
      result = await callBitwig("arranger.set_panel_visibility", [args.panel, args.state]);
      break;
    case "arranger_zoom":
      result = await callBitwig("arranger.zoom", [args.action]);
      break;
    case "arranger_cues_list":
      result = await callBitwig("arranger.cues.list");
      break;
    case "arranger_cues_jump":
      result = await callBitwig("arranger.cues.jump", [args.index]);
      break;
    case "arranger_cues_rename":
      result = await callBitwig("arranger.cues.rename", [args.index, args.name]);
      break;
    case "arranger_cues_color":
      result = await callBitwig("arranger.cues.color", [args.index, args.r, args.g, args.b]);
      break;
    case "transport_add_cue_marker":
      result = await callBitwig("transport.add_cue_marker");
      break;
    case "arranger_cues_create":
      result = await callBitwig("arranger.cues.create");
      break;

    // --- Application Tools ---
    case "application_undo": result = await callBitwig("application.undo"); break;
    case "application_redo": result = await callBitwig("application.redo"); break;
    case "application_cut": result = await callBitwig("application.cut"); break;
    case "application_copy": result = await callBitwig("application.copy"); break;
    case "application_paste": result = await callBitwig("application.paste"); break;
    case "application_delete": result = await callBitwig("application.delete"); break;
    case "application_duplicate": result = await callBitwig("application.duplicate"); break;
    case "application_select_all": result = await callBitwig("application.select_all"); break;
    case "application_select_none": result = await callBitwig("application.select_none"); break;
    case "application_arrow_key":
      result = await callBitwig("application.arrow_key", [args.direction]);
      break;
    case "application_enter": result = await callBitwig("application.enter"); break;
    case "application_escape": result = await callBitwig("application.escape"); break;
    case "application_zoom_in": result = await callBitwig("application.zoom_in"); break;
    case "application_zoom_out": result = await callBitwig("application.zoom_out"); break;
    case "transport_get_time_signature":
      result = await callBitwig("transport.time_signature");
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
    case "track_list":
      result = await callBitwig("track.list");
      break;
    case "track_get_info":
      result = await callBitwig("track.get_info", [args.index]);
      break;
    case "track_scroll_into_view":
      result = await callBitwig("track.scroll_into_view", [args.index]);
      break;
    case "track_bank_scroll_forward":
      result = await callBitwig("track.bank.scroll_forward");
      break;
    case "track_bank_scroll_backward":
      result = await callBitwig("track.bank.scroll_backward");
      break;
    case "track_bank_scroll_to_position":
      result = await callBitwig("track.bank.scroll_to_position", [args.position]);
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
    case "cursor_track_get_status":
      result = await callBitwig("cursor_track.get_status");
      break;
    case "cursor_device_get_status":
      result = await callBitwig("cursor_device.get_status");
      break;
    case "cursor_clip_get_status":
      result = await callBitwig("cursor_clip.get_status");
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
    case "device_select_first":
      result = await callBitwig("device.select_first");
      break;
    case "device_select_last":
      result = await callBitwig("device.select_last");
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
      result = await callBitwig("mixer.track.get_send", [args.trackIndex, args.sendIndex]);
      break;
    case "mixer_set_send_level":
      result = await callBitwig("mixer.track.set_send", [args.trackIndex, args.sendIndex, args.value]);
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

    // --- Note Input Tools ---
    case "midi_send_raw":
      result = await callBitwig("note_input.send_raw_midi", [args.status, args.data1, args.data2]);
      break;
    case "note_on":
      result = await callBitwig("note_input.send_note_on", [args.channel, args.pitch, args.velocity]);
      break;
    case "note_off":
      result = await callBitwig("note_input.send_note_off", [args.channel, args.pitch, args.velocity]);
      break;
    case "note_play":
      await callBitwig("note_input.send_note_on", [args.channel, args.pitch, args.velocity]);
      await new Promise(resolve => setTimeout(resolve, args.duration as number));
      result = await callBitwig("note_input.send_note_off", [args.channel, args.pitch, 0]);
      break;

    // --- Note Input Advanced ---
    case "note_input_assign_expression":
      result = await callBitwig("note_input.assign_poly_aftertouch_to_expression", [args.channel, args.expression, args.pitchRange]);
      break;
    case "note_input_set_mpe":
      result = await callBitwig("note_input.set_use_expressive_midi", [args.enabled, args.baseChannel, args.pitchBendRange]);
      break;
    case "note_input_set_key_translation":
      result = await callBitwig("note_input.set_key_translation_table", [args.table]);
      break;
    case "note_input_set_velocity_translation":
      result = await callBitwig("note_input.set_velocity_translation_table", [args.table]);
      break;

    // --- Drum Pad Tools ---
    case "drumpad_get_status":
      result = await callBitwig("drumpad.get_status");
      break;
    case "drumpad_select":
      result = await callBitwig("drumpad.select", [args.index]);
      break;
    case "drumpad_scroll_forward":
      result = await callBitwig("drumpad.scroll_forward");
      break;
    case "drumpad_scroll_backward":
      result = await callBitwig("drumpad.scroll_backward");
      break;
    case "drumpad_set_volume":
      result = await callBitwig("drumpad.set_volume", [args.index, args.value]);
      break;
    case "drumpad_set_mute":
      result = await callBitwig("drumpad.set_mute", [args.index, args.state]);
      break;
    case "drumpad_set_solo":
      result = await callBitwig("drumpad.set_solo", [args.index, args.state]);
      break;

    // --- Groove Tools ---
    case "groove_get_status":
      result = await callBitwig("groove.get_status");
      break;
    case "groove_set_enabled":
      result = await callBitwig("groove.set_enabled", [args.state]);
      break;
    case "groove_set_shuffle_amount":
      result = await callBitwig("groove.set_shuffle_amount", [args.value]);
      break;

    // --- Project Mixer Tools ---
    case "project_unsolo_all":
      result = await callBitwig("project.unsolo_all");
      break;
    case "project_unmute_all":
      result = await callBitwig("project.unmute_all");
      break;
    case "project_unarm_all":
      result = await callBitwig("project.unarm_all");
      break;

    // --- Browser Tools ---
    case "browser_get_status":
      result = await callBitwig("browser.get_status");
      break;
    case "browser_set_filter":
      result = await callBitwig("browser.set_filter", [args.text]);
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
    case "transport_tap_tempo":
      result = await callBitwig("transport.tap_tempo");
      break;
    case "transport_toggle_punch_in":
      result = await callBitwig("transport.toggle_punch_in");
      break;
    case "transport_toggle_punch_out":
      result = await callBitwig("transport.toggle_punch_out");
      break;
    case "transport_set_punch_in":
      result = await callBitwig("transport.set_punch_in", [args.state]);
      break;
    case "transport_set_punch_out":
      result = await callBitwig("transport.set_punch_out", [args.state]);
      break;
    case "transport_get_punch_status":
      result = await callBitwig("transport.get_punch_status");
      break;
    case "transport_toggle_arranger_overdub":
      result = await callBitwig("transport.toggle_arranger_overdub");
      break;
    case "transport_toggle_launcher_overdub":
      result = await callBitwig("transport.toggle_launcher_overdub");
      break;
    case "transport_get_overdub_status":
      result = await callBitwig("transport.get_overdub_status");
      break;
    case "transport_continue_playback":
      result = await callBitwig("transport.continue_playback");
      break;
    case "transport_return_to_zero":
      result = await callBitwig("transport.return_to_zero");
      break;
    case "transport_fast_forward":
      result = await callBitwig("transport.fast_forward");
      break;
    case "transport_rewind":
      result = await callBitwig("transport.rewind");
      break;
    case "transport_nudge_forward":
      result = await callBitwig("transport.nudge_forward");
      break;
    case "transport_nudge_backward":
      result = await callBitwig("transport.nudge_backward");
      break;

    default:
      throw new Error(`Unknown tool: ${name}`);
  }

  return result;
}

server.setRequestHandler(CallToolRequestSchema, async (request: ToolRequest) => {
  try {
    const { name, arguments: requestArgs } = request.params;
    const args = (requestArgs ?? {}) as ToolArgs;
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
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error: ${message}`,
        },
      ],
    };
  }
});

async function runServer(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Bitwig MCP Server running on stdio");
}

runServer().catch(console.error);
