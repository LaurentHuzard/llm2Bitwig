import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    console.log("Starting MCP Clip Launcher Test...");

    const transport = new StdioClientTransport({
        command: "node",
        args: ["index.js"],
    });

    const client = new Client(
        {
            name: "bitwig-mcp-test-clips",
            version: "0.1.0",
        },
        {
            capabilities: {},
        }
    );

    try {
        await client.connect(transport);
        console.log("Connected to MCP Server.");

        // --- Test 1: Get Project Summary ---
        console.log("Testing project_get_summary...");
        const summary = await client.callTool({
            name: "project_get_summary",
            arguments: {},
        });
        console.log("Project Summary:", summary.content[0].text);

        // --- Test 2: Get Clip Grid ---
        console.log("Testing clip_get_grid...");
        const grid = await client.callTool({
            name: "clip_get_grid",
            arguments: {},
        });
        console.log("Clip Grid retrieved.");

        // --- Test 3: Create Clip on Track 0, Slot 0 ---
        console.log("Testing clip_create (T0, S0, 4 beats)...");
        await client.callTool({
            name: "clip_create",
            arguments: {
                trackIndex: 0,
                slotIndex: 0,
                lengthBeats: 4
            },
        });
        console.log("Clip created.");

        // --- Test 4: Select Clip Slot ---
        console.log("Testing clip_slot_select (T0, S0)...");
        await client.callTool({
            name: "clip_slot_select",
            arguments: {
                trackIndex: 0,
                slotIndex: 0
            },
        });
        console.log("Clip slot selected.");

        // --- Test 5: Launch Clip ---
        console.log("Testing clip_launch (T0, S0)...");
        await client.callTool({
            name: "clip_launch",
            arguments: {
                trackIndex: 0,
                slotIndex: 0
            },
        });
        console.log("Clip launched.");

        // --- Test 6: Duplicate Clip ---
        console.log("Testing clip_duplicate (T0, S0 -> S1)...");
        await client.callTool({
            name: "clip_duplicate",
            arguments: {
                trackIndex: 0,
                slotIndex: 0
            },
        });
        console.log("Clip duplicated.");

        // --- Test 7: Scene Select ---
        console.log("Testing scene_select (Scene 0)...");
        await client.callTool({
            name: "scene_select",
            arguments: {
                sceneIndex: 0
            },
        });
        console.log("Scene 0 selected.");

    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        transport.close();
    }
}

main();
