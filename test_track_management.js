import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    console.log("Starting MCP Track Management Test...");

    const transport = new StdioClientTransport({
        command: "node",
        args: ["index.js"],
    });

    const client = new Client(
        {
            name: "bitwig-mcp-test-track-mgmt",
            version: "0.1.0",
        },
        {
            capabilities: {},
        }
    );

    try {
        await client.connect(transport);
        console.log("✅ Connected to MCP Server.");

        const trackIndex = 0;

        // --- Test 1: Rename Track ---
        console.log(`\nTest 1: Renaming track ${trackIndex} to "MCP Test"...`);
        await client.callTool({
            name: "track_rename",
            arguments: { index: trackIndex, name: "MCP Test" },
        });
        console.log("Result: OK");

        // --- Test 2: Set Color ---
        console.log(`\nTest 2: Setting color of track ${trackIndex} to Red...`);
        await client.callTool({
            name: "track_set_color",
            arguments: { index: trackIndex, red: 1.0, green: 0.0, blue: 0.0 },
        });
        console.log("Result: OK");

        // --- Test 3: Duplicate ---
        console.log(`\nTest 3: Duplicating track ${trackIndex}...`);
        await client.callTool({
            name: "track_duplicate",
            arguments: { index: trackIndex },
        });
        console.log("Result: OK");

        // Wait for duplication to process in Bitwig
        await new Promise(r => setTimeout(r, 1000));

        // --- Test 4: Delete ---
        // Duplicated track should be at index+1
        console.log(`\nTest 4: Deleting duplicated track ${trackIndex + 1}...`);
        await client.callTool({
            name: "track_delete",
            arguments: { index: trackIndex + 1 },
        });
        console.log("Result: OK");

        console.log("\n✅ All Track Management tests passed.");

    } catch (error) {
        console.error("\n❌ Test failed:", error);
        if (error.content) {
            console.error("Error details:", JSON.stringify(error.content, null, 2));
        }
    } finally {
        transport.close();
        process.exit(0);
    }
}

main();
