import { TestClient } from "./TestClient.js";

async function run() {
    console.log("Starting MCP Clip Launcher Test...");
    const client = new TestClient();

    try {
        await client.connect();
        console.log("Connected to MCP Server.");

        // --- Test 1: Get Project Summary ---
        console.log("Testing project_get_summary...");
        const summary = await client.callTool("project_get_summary");
        console.log("Project Summary:", summary);

        // --- Test 2: Get Clip Grid ---
        console.log("Testing clip_get_grid...");
        const grid = await client.callTool("clip_get_grid");
        console.log("Clip Grid retrieved. First clip name:", grid[0][0].name);
        if (grid[0][0].name !== "Clip 0-0") throw new Error("Clip name mismatch: " + grid[0][0].name);

        // --- Test 3: Create Clip on Track 0, Slot 0 ---
        console.log("Testing clip_create (T0, S0, 4 beats)...");
        await client.callTool("clip_create", {
            trackIndex: 0,
            slotIndex: 0,
            lengthBeats: 4
        });
        console.log("Clip created.");

        // --- Test 4: Select Clip Slot ---
        console.log("Testing clip_slot_select (T0, S0)...");
        await client.callTool("clip_slot_select", {
            trackIndex: 0,
            slotIndex: 0
        });
        console.log("Clip slot selected.");

        // --- Test 5: Launch Clip ---
        console.log("Testing clip_launch (T0, S0)...");
        await client.callTool("clip_launch", {
            trackIndex: 0,
            slotIndex: 0
        });
        console.log("Clip launched.");

        // --- Test 6: Duplicate Clip ---
        console.log("Testing clip_duplicate (T0, S0 -> S1)...");
        await client.callTool("clip_duplicate", {
            trackIndex: 0,
            slotIndex: 0
        });
        console.log("Clip duplicated.");

        // --- Test 7: Scene Select ---
        console.log("Testing scene_select (Scene 0)...");
        await client.callTool("scene_select", {
            sceneIndex: 0
        });
        console.log("Scene 0 selected.");

    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    } finally {
        await client.disconnect();
    }
}

run();
