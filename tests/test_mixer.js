import { TestClient } from "./TestClient.js";
import assert from "assert";

async function run() {
  console.log("=== Starting Mixer Tools Tests ===");
  const client = new TestClient();

  try {
    await client.connect();
    console.log("Connected.");

    // 1. Get Send Level
    console.log("Testing mixer_get_send_level...");
    const level = await client.callTool("mixer_get_send_level", {
      trackIndex: 0,
      sendIndex: 0,
    });
    assert.strictEqual(typeof level, "number", "Send level should be a number");

    console.log("=== Mixer Tools Tests Passed ===");
  } catch (error) {
    console.error("Test Failed:", error);
    process.exit(1);
  } finally {
    await client.disconnect();
  }
}

run();
