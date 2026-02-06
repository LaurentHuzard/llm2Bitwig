import { TestClient } from "./TestClient.js";
import assert from "assert";

type PunchStatus = { punchIn?: boolean; punchOut?: boolean };
type OverdubStatus = { arranger?: boolean; launcher?: boolean };
type TrackInfo = { name?: string; exists?: boolean };
type CursorTrack = { exists?: boolean; name?: string; color?: unknown };
type CursorDevice = { exists?: boolean; isEnabled?: boolean };
type CursorClip = { exists?: boolean };
type ProjectSummary = {
  transport?: {
    isPlaying?: boolean;
    tempo?: number;
    loop?: unknown;
    punch?: unknown;
    overdub?: unknown;
  };
  tracks?: unknown[];
  scenes?: unknown[];
  selection?: { track?: unknown; device?: unknown; clip?: unknown };
  mixer?: unknown;
};

async function run() {
  console.log("=== Starting Phase 1 Features Tests ===");
  const client = new TestClient();

  try {
    await client.connect();
    console.log("Connected.");

    console.log("\n--- Transport Extended Tests ---");
    
    console.log("Testing transport_tap_tempo...");
    await client.callTool("transport_tap_tempo");
    
    console.log("Testing transport punch in/out...");
    await client.callTool("transport_toggle_punch_in");
    await client.callTool("transport_set_punch_in", { state: true });
    const punchStatus = await client.callTool<PunchStatus>("transport_get_punch_status");
    assert.strictEqual(typeof punchStatus.punchIn, "boolean");
    assert.strictEqual(typeof punchStatus.punchOut, "boolean");
    
    console.log("Testing transport overdub...");
    await client.callTool("transport_toggle_arranger_overdub");
    const overdubStatus = await client.callTool<OverdubStatus>("transport_get_overdub_status");
    assert.strictEqual(typeof overdubStatus.arranger, "boolean");
    assert.strictEqual(typeof overdubStatus.launcher, "boolean");
    
    console.log("Testing transport navigation...");
    await client.callTool("transport_return_to_zero");
    await client.callTool("transport_nudge_forward");
    await client.callTool("transport_nudge_backward");

    console.log("\n--- Track Management Tests ---");
    
    console.log("Testing track_list...");
    const trackList = await client.callTool<unknown[]>("track_list");
    assert(Array.isArray(trackList), "track_list should return array");
    
    if (trackList.length > 0) {
      console.log("Testing track_get_info...");
      const trackInfo = await client.callTool<TrackInfo>("track_get_info", { index: 0 });
      assert.strictEqual(typeof trackInfo.name, "string");
      assert.strictEqual(typeof trackInfo.exists, "boolean");
      
      console.log("Testing track_scroll_into_view...");
      await client.callTool("track_scroll_into_view", { index: 0 });
    }
    
    console.log("Testing track bank scrolling...");
    await client.callTool("track_bank_scroll_forward");
    await client.callTool("track_bank_scroll_backward");
    await client.callTool("track_bank_scroll_to_position", { position: 0 });

    console.log("\n--- Cursor Status Tests ---");
    
    console.log("Testing cursor_track_get_status...");
    const cursorTrack = await client.callTool<CursorTrack>("cursor_track_get_status");
    assert.strictEqual(typeof cursorTrack.exists, "boolean");
    assert.strictEqual(typeof cursorTrack.name, "string");
    assert(cursorTrack.color, "cursor track should have color");
    
    console.log("Testing cursor_device_get_status...");
    const cursorDevice = await client.callTool<CursorDevice>("cursor_device_get_status");
    assert.strictEqual(typeof cursorDevice.exists, "boolean");
    assert.strictEqual(typeof cursorDevice.isEnabled, "boolean");
    
    console.log("Testing cursor_clip_get_status...");
    const cursorClip = await client.callTool<CursorClip>("cursor_clip_get_status");
    assert.strictEqual(typeof cursorClip.exists, "boolean");

    console.log("\n--- Project Summary Test ---");
    
    console.log("Testing project_get_summary...");
    const summary = await client.callTool<ProjectSummary>("project_get_summary");
    assert(summary.transport, "Summary should include transport");
    assert(Array.isArray(summary.tracks), "Summary should include tracks array");
    assert(Array.isArray(summary.scenes), "Summary should include scenes array");
    assert(summary.selection, "Summary should include selection");
    assert(summary.selection.track, "Summary selection should include track");
    assert(summary.selection.device, "Summary selection should include device");
    assert(summary.selection.clip, "Summary selection should include clip");
    assert(summary.mixer, "Summary should include mixer");
    
    console.log("Verifying comprehensive transport state...");
    assert.strictEqual(typeof summary.transport.isPlaying, "boolean");
    assert.strictEqual(typeof summary.transport.tempo, "number");
    assert(summary.transport.loop, "Transport should include loop status");
    assert(summary.transport.punch, "Transport should include punch status");
    assert(summary.transport.overdub, "Transport should include overdub status");

    console.log("\n=== Phase 1 Features Tests Passed ===");
  } catch (error) {
    console.error("Test Failed:", error);
    process.exit(1);
  } finally {
    await client.disconnect();
  }
}

run();
