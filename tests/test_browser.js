import { TestClient } from "./TestClient.js";
import assert from "assert";

async function run() {
  console.log("=== Starting Browser Tools Tests ===");
  const client = new TestClient();

  try {
    await client.connect();
    console.log("Connected.");

    // 1. Get Browser Status
    console.log("Testing browser_get_status...");
    const status = await client.callTool("browser_get_status");
    assert.strictEqual(typeof status.exists, "boolean", "browser_get_status.exists should be boolean");

    // 2. Set Browser Filter
    console.log("Testing browser_set_filter...");
    const res = await client.callTool("browser_set_filter", { text: "piano" });
    assert.strictEqual(res, "UNSUPPORTED");

    console.log("=== Browser Tools Tests Passed ===");
  } catch (error) {
    console.error("Test Failed:", error);
    process.exit(1);
  } finally {
    await client.disconnect();
  }
}

run();
