/**
 * Mock Bitwig Server for Testing
 * Simulates the TCP JSON-RPC interface of Bitwig Studio.
 */
import net from "net";

const PORT = 8888;
const HOST = "127.0.0.1";

type MockMarker = {
    index: number;
    name: string;
    position: number;
    color: { r: number; g: number; b: number };
};

const mockState = globalThis as typeof globalThis & {
    mockMarkers?: MockMarker[];
};

const server = net.createServer((socket) => {
    console.log("Mock Bitwig: Client connected");

    let buffer = Buffer.alloc(0);

    socket.on("data", (data) => {
        buffer = Buffer.concat([buffer, data]);

        while (true) {
            if (buffer.length < 4) {
                return; // Need more data for header
            }

            const messageLength = buffer.readUInt32BE(0);

            if (buffer.length < 4 + messageLength) {
                return; // Need more data for full message
            }

            // Extract the message
            const messageBuf = buffer.slice(4, 4 + messageLength);

            // Advance buffer
            buffer = buffer.slice(4 + messageLength);

            try {
                const request = JSON.parse(messageBuf.toString());
                console.log("Mock Bitwig received:", request);

                if (request.method) {
                    console.log(`Mock Bitwig processing method: '${request.method}'`);
                    processRequest(socket, request);
                }
            } catch (err) {
                console.error("Mock Bitwig: Error parsing JSON", err);
            }
        }
    });

    socket.on("end", () => {
        console.log("Mock Bitwig: Client disconnected");
    });
});

function processRequest(
    socket: net.Socket,
    request: { id?: number; method?: string; params?: unknown }
): void {
    const { id, method } = request;
    if (!method) return;
    let result: unknown = {};

    // Simulate responses based on method
    if (method.startsWith("transport_")) {
        if (method === "transport_get_tempo") {
            result = 120.0;
        } else if (method === "transport_playing_status") {
            result = true;
        } else if (method === "transport_get_position") {
            result = 16.0;
        } else {
            result = "OK"; // Generic success for void methods
        }
    } else if (method.startsWith("track_")) {
        if (method === "track_list") {
            result = [{ name: "Track 1", type: "Audio" }, { name: "Track 2", type: "Instrument" }];
        }
        else if (method === "track_bank_get_status") {
            result = {
                tracks: Array(8).fill({ name: "Track", volume: 0.7, pan: 0.5, mute: false, solo: false })
            }
        }
        else {
            result = "OK";
        }
    } else if (method.startsWith("browser.")) {
        if (method === "browser.get_status") {
            result = { exists: true, active: true };
        } else {
            result = "OK";
        }
    } else if (method.startsWith("clip_")) {
        if (method === "clip_get_grid") {
            // Return 8x8 grid of empty slots
            const grid = [];
            for (let t = 0; t < 8; t++) {
                const track = [];
                for (let s = 0; s < 8; s++) {
                    track.push({
                        hasClip: false,
                        isPlaying: false,
                        isRecording: false,
                        color: null,
                        name: "Clip " + t + "-" + s
                    });
                }
                grid.push(track);
            }
            result = grid;
        } else if (method === "clip_get_status") {
            result = { hasClip: false, isPlaying: false, isRecording: false };
        } else {
            result = "OK";
        }
    } else if (method.startsWith("arranger.")) {
        if (method === "arranger.cues.list") {
            // Mock markers
            if (!mockState.mockMarkers) {
                mockState.mockMarkers = [
                    { index: 0, name: "Intro", position: 0.0, color: { r: 0.5, g: 0.5, b: 0.5 } },
                    { index: 1, name: "Verse", position: 32.0, color: { r: 0.2, g: 0.8, b: 0.2 } }
                ];
            }
            result = mockState.mockMarkers;
        } else if (method === "arranger.cues.rename") {
            // request.params is [index, name]
            // We need to parse params from the request object if possible, but mock implementation here is rudimentary.
            // The loop above parses JSON but processRequest arg is just { id, method, params }.
            // But params in MCP server is passed as [arg1, arg2...] array to callBitwig?
            // server-mcp/index.ts calls callBitwig(method, [args...])
            // So params here is an array.
            const params = request.params as any[];
            if (mockState.mockMarkers && params && params.length >= 2) {
                const index = params[0];
                const name = params[1];
                const m = mockState.mockMarkers.find((m) => m.index === index);
                if (m) m.name = name;
            }
            result = "OK";
        } else if (method === "arranger.cues.color") {
            const params = request.params as any[];
            if (mockState.mockMarkers && params && params.length >= 4) {
                const index = params[0];
                const r = params[1];
                const g = params[2];
                const b = params[3];
                const m = mockState.mockMarkers.find((m) => m.index === index);
                if (m) m.color = { r, g, b };
            }
            result = "OK";
        } else {
            result = "OK";
        }
    } else if (method === "transport.add_cue_marker") {
        if (!mockState.mockMarkers) mockState.mockMarkers = [];
        mockState.mockMarkers.push({
            index: mockState.mockMarkers.length,
            name: "New Marker",
            position: 16.0, // Hardcoded for test
            color: { r: 1, g: 1, b: 0 }
        });
        result = "OK";
    } else if (method.startsWith("application.")) {
        result = "OK";
    } else {
        result = "OK";
    }

    const response = {
        jsonrpc: "2.0",
        id: id,
        result: result
    };

    socket.write(JSON.stringify(response) + "\n");
}

server.listen(PORT, HOST, () => {
    console.log(`Mock Bitwig Server listening on ${HOST}:${PORT}`);
});

// Handle termination signals to close the socket properly
process.on("SIGTERM", () => {
    server.close();
    process.exit(0);
});

process.on("SIGINT", () => {
    server.close();
    process.exit(0);
});
