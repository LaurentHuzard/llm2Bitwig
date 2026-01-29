import { TestClient } from "./TestClient.js";
import assert from "assert";

async function run() {
  console.log("=== Starting Transport Tools Tests ===");
  const client = new TestClient();

  try {
    await client.connect();
    console.log("Connected.");

    // 1. Recording Status
    console.log("Testing transport_get_recording_status...");
    const recording = await client.callTool("transport_get_recording_status");
    assert.strictEqual(typeof recording, "boolean", "Recording status should be boolean");

    console.log("=== Transport Tools Tests Passed ===");
  } catch (error) {
    console.error("Test Failed:", error);
    process.exit(1);
  } finally {
    await client.disconnect();
  }
}

run();
