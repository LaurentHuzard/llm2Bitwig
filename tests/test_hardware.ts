import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

type ToolResponse = { content?: Array<{ text?: string }> };

async function main() {
    console.log("Starting Hardware Verification...");

    const transport = new StdioClientTransport({
        command: "node",
        args: ["dist/index.js"], // Starts the Node MCP server
    });

    const client = new Client(
        {
            name: "hardware-test-client",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    await client.connect(transport);
    console.log("Connected to MCP Server.");

    try {
        console.log("1. Creating Virtual Slider...");
        await client.callTool({
            name: "hardware_create_slider",
            arguments: {
                id: "slider-1",
                label: "Master Volume",
                isHorizontal: false
            }
        });
        console.log("   -> Slider created.");

        console.log("2. Creating Virtual Knob (Absolute)...");
        await client.callTool({
            name: "hardware_create_knob",
            arguments: {
                id: "knob-1",
                label: "Filter Cutoff",
                isAbsolute: true
            }
        });
        console.log("   -> Absolute Knob created.");

        console.log("3. Creating Virtual Button...");
        await client.callTool({
            name: "hardware_create_button",
            arguments: {
                id: "btn-1",
                label: "Play"
            }
        });
        console.log("   -> Button created.");

        console.log("4. Updating Hardware State...");
        await client.callTool({
            name: "hardware_update",
            arguments: {}
        });
        console.log("   -> Hardware updated.");

        console.log("5. Listing Controls...");
        const controls = await client.callTool({
            name: "hardware_get_controls",
            arguments: {}
        }) as ToolResponse;

        const controlsText = controls.content?.[0]?.text;
        console.log("   -> Controls found:", controlsText);

        if (controlsText && controlsText.includes("slider-1") && controlsText.includes("knob-1")) {
            console.log("   PASS: All controls listed.");
        } else {
            console.error("   FAIL: Missing controls in list.");
            process.exit(1);
        }

    } catch (e) {
        console.error("Test failed:", e);
        process.exit(1);
    } finally {
        await client.close();
    }
}

main();
