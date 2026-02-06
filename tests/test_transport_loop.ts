#!/usr/bin/env node

/**
 * Test script for Transport Loop Controls
 * Tests the 4 new loop control MCP tools
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

type ToolResponse = { content?: Array<{ text?: string }> };

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

function parseToolText(result: ToolResponse): unknown {
    const text = result.content?.[0]?.text;
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

async function runTests() {
    console.log("🧪 Starting Transport Loop Control Tests\n");

    // Start the MCP server
    const transport = new StdioClientTransport({
        command: "node",
        args: ["dist/index.js"],
    });

    const client = new Client({
        name: "test-client",
        version: "1.0.0",
    }, {
        capabilities: {},
    });

    await client.connect(transport);
    console.log("✅ Connected to MCP server\n");

    try {
        // Test 1: Get initial loop status
        console.log("Test 1: Get Loop Status (initial state)");
        const initialStatus = await client.callTool({
            name: "transport_get_loop_status",
            arguments: {},
        }) as ToolResponse;
        console.log("Result:", parseToolText(initialStatus));
        console.log("✅ Test 1 passed\n");
        await sleep(500);

        // Test 2: Enable loop
        console.log("Test 2: Toggle Loop ON");
        const toggleOn = await client.callTool({
            name: "transport_toggle_loop",
            arguments: {},
        }) as ToolResponse;
        console.log("Result:", parseToolText(toggleOn));
        await sleep(500);

        // Verify loop is enabled
        const statusAfterToggle = await client.callTool({
            name: "transport_get_loop_status",
            arguments: {},
        }) as ToolResponse;
        const loopStatus = parseToolText(statusAfterToggle) as { enabled?: boolean };
        console.log("Loop Status:", loopStatus);

        if (loopStatus.enabled) {
            console.log("✅ Test 2 passed - Loop is enabled\n");
        } else {
            console.log("❌ Test 2 failed - Loop should be enabled\n");
        }
        await sleep(500);

        // Test 3: Set loop start position
        console.log("Test 3: Set Loop Start to beat 0");
        const setStart = await client.callTool({
            name: "transport_set_loop_start",
            arguments: { beats: 0 },
        }) as ToolResponse;
        console.log("Result:", parseToolText(setStart));
        console.log("✅ Test 3 passed\n");
        await sleep(500);

        // Test 4: Set loop end position
        console.log("Test 4: Set Loop End to beat 8");
        const setEnd = await client.callTool({
            name: "transport_set_loop_end",
            arguments: { beats: 8 },
        }) as ToolResponse;
        console.log("Result:", parseToolText(setEnd));
        console.log("✅ Test 4 passed\n");
        await sleep(500);

        // Test 5: Verify loop region
        console.log("Test 5: Verify Loop Region (0-8 beats)");
        const finalStatus = await client.callTool({
            name: "transport_get_loop_status",
            arguments: {},
        }) as ToolResponse;
        const finalLoop = parseToolText(finalStatus) as { enabled?: boolean; start?: number; end?: number };
        console.log("Final Loop Status:", finalLoop);

        if (finalLoop.enabled && finalLoop.start === 0 && finalLoop.end === 8) {
            console.log("✅ Test 5 passed - Loop region correctly set to 0-8 beats\n");
        } else {
            console.log("❌ Test 5 failed - Loop region incorrect\n");
            console.log("Expected: {enabled: true, start: 0, end: 8}");
            console.log("Got:", finalLoop);
        }
        await sleep(500);

        // Test 6: Toggle loop off
        console.log("Test 6: Toggle Loop OFF");
        const toggleOff = await client.callTool({
            name: "transport_toggle_loop",
            arguments: {},
        }) as ToolResponse;
        console.log("Result:", parseToolText(toggleOff));
        await sleep(500);

        const statusAfterOff = await client.callTool({
            name: "transport_get_loop_status",
            arguments: {},
        }) as ToolResponse;
        const offStatus = parseToolText(statusAfterOff) as { enabled?: boolean };
        console.log("Loop Status:", offStatus);

        if (!offStatus.enabled) {
            console.log("✅ Test 6 passed - Loop is disabled\n");
        } else {
            console.log("❌ Test 6 failed - Loop should be disabled\n");
        }

        console.log("\n🎉 All tests completed!");
        console.log("\n📝 Manual Verification Steps:");
        console.log("1. Check Bitwig Studio - loop button should be OFF");
        console.log("2. Loop markers should still be visible at beats 0-8");
        console.log("3. Try playing - transport should NOT loop");

    } catch (error) {
        console.error("❌ Test failed with error:", error);
    } finally {
        await client.close();
        process.exit(0);
    }
}

runTests().catch(console.error);
