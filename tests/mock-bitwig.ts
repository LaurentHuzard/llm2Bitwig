/**
 * Mock Bitwig Server for Testing
 * Simulates the TCP JSON-RPC interface of Bitwig Studio.
 */
import net from "net";

const PORT = 8888;
const HOST = "127.0.0.1";

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
