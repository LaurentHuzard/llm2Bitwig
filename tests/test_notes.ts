
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    console.log("Starting Note Input Verification...");

    const transport = new StdioClientTransport({
        command: "npx",
        args: ["tsx", "server-mcp/index.ts", "--stdio"],
    });

    const client = new Client(
        {
            name: "note-tester",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    try {
        await client.connect(transport);
        console.log("✅ Connected to MCP Server.");

        // 1. Test note_on
        console.log("\n🔍 Testing note_on...");
        try {
            const result = await client.callTool({
                name: "note_on",
                arguments: { channel: 0, pitch: 60, velocity: 100 }
            });
            console.log("✅ Note On (Ch0, C3):", result);
        } catch (e) {
            console.error(`❌ Failed note_on: ${e}`);
        }

        // 2. Test note_off
        console.log("\n🔍 Testing note_off...");
        try {
            await new Promise(r => setTimeout(r, 500)); // Short delay
            const result = await client.callTool({
                name: "note_off",
                arguments: { channel: 0, pitch: 60, velocity: 0 }
            });
            console.log("✅ Note Off (Ch0, C3):", result);
        } catch (e) {
            console.error(`❌ Failed note_off: ${e}`);
        }

        // 3. Test note_play (helper)
        console.log("\n🔍 Testing note_play...");
        try {
            const result = await client.callTool({
                name: "note_play",
                arguments: { channel: 0, pitch: 64, velocity: 100, duration: 250 }
            });
            console.log("✅ Note Play (Ch0, E3, 250ms):", result);
        } catch (e) {
            console.error(`❌ Failed note_play: ${e}`);
        }

        // 4. Test midi_send_raw
        console.log("\n🔍 Testing midi_send_raw (CC)...");
        try {
            const result = await client.callTool({
                name: "midi_send_raw",
                arguments: { status: 176, data1: 1, data2: 127 } // CC 1 on Ch1 -> 127
            });
            console.log("✅ Send Raw MIDI (CC):", result);
        } catch (e) {
            console.error(`❌ Failed midi_send_raw: ${e}`);
        }

    } catch (e) {
        console.error("Test execution failed:", e);
    } finally {
        await client.close();
    }
}

main();
