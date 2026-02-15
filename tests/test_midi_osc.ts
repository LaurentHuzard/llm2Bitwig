import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

type ToolResponse = { content?: Array<{ text?: string }> };

async function main() {
    console.log("Starting MIDI Verification...");

    const transport = new StdioClientTransport({
        command: "node",
        args: ["dist/index.js"],
        env: process.env as Record<string, string>
    });

    const client = new Client(
        {
            name: "midi-test-client",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    await client.connect(transport);
    console.log("Connected to MCP Server.");

    try {
        // 1. Hardware creation (Prerequisite)
        console.log("1. Creating Hardware Controls...");
        await client.callTool({
            name: "hardware_create_slider",
            arguments: { id: "slider-1", label: "Vol", isHorizontal: false }
        });
        await client.callTool({
            name: "hardware_create_button",
            arguments: { id: "btn-1", label: "Play" }
        });
        // Test new create_light
        // await client.callTool({
        //     name: "hardware_create_light",
        //     arguments: { id: "light-1", label: "Status", linkedButtonId: "btn-1" }
        // });
        // The implementation plan mentioned create_light but I added it to HardwareSurface.ts? 
        // Yes I did in Step 59.
        await client.callTool({
            name: "hardware_create_light",
            arguments: { id: "light-1", label: "Status", linkedButtonId: "btn-1" }
        });
        console.log("   -> Hardware created.");

        // 2. MIDI Send
        console.log("2. Sending Short MIDI Message...");
        await client.callTool({
            name: "midi_send_short",
            arguments: { status: 0x90, data1: 60, data2: 100 }
        });
        console.log("   -> MIDI Short sent.");

        console.log("3. Sending SysEx...");
        await client.callTool({
            name: "midi_send_sysex",
            arguments: { hexString: "F07E7F0601F7" }
        });
        console.log("   -> SysEx sent.");

        // 4. OSC Tests
        console.log("4. Starting OSC Server...");
        await client.callTool({
            name: "osc_start_server",
            arguments: { port: 9000 }
        });
        console.log("   -> OSC Server started on 9000.");

        console.log("5. Connecting OSC...");
        await client.callTool({
            name: "osc_connect",
            arguments: { host: "127.0.0.1", port: 9001 } // Connect to dummy port
        });
        console.log("   -> OSC Connected.");

        console.log("6. Sending OSC Message...");
        await client.callTool({
            name: "osc_send",
            arguments: { address: "/test/message", args: [123, "hello"] }
        });
        console.log("   -> OSC Message sent.");

        console.log("PASS: All Hardware, MIDI, and OSC tools called successfully.");

    } catch (e) {
        console.error("Test failed:", e);
        process.exit(1);
    } finally {
        await client.close();
    }
}

main();
