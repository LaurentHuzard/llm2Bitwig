# Must-Have Features for the Bitwig MCP Connector

This document crystallizes the **core functionality any LLM driver needs first**—playback control, track/clip scaffolding, and real-time awareness—then breaks each feature into concrete tasks/subtasks for the Node.js MCP server and the Bitwig controller script.

## 1. Transport & Playback Control
### Goal
Give the LLM deterministic control over transport (play, stop, record, restart, tempo) and immediate feedback when Bitwig’s transport state changes.

### Tasks
- **1.1 Design transport command schema**
  - Define the method names (`transport.play`, `transport.stop`, `transport.record`, `transport.setTempo`, `transport.gotoStart`, etc.) and their payload shapes so MCP clients can emit them.
  - Document expected responses (`status`, `timestamp`, `error`) for Node-side logging.
- **1.2 Extend MCP server command routing**
  - Map the schema to existing handlers in `index.js`, adding a dispatcher that delegates to transport-specific handlers before other domains.
  - Implement validation (e.g., tempo range) and response formatting.
- **1.3 Harden the controller script**
  - Add `transport` handlers mirroring the schema, call the appropriate `Transport` interface methods, and send acknowledgments over the existing UDP/TCP channel.
  - Subscribe to `transport` observers (e.g., `LinearValue` for tempo, `BooleanValue` for playing) and stream state updates back to the server so the LLM can confirm state.

## 2. Track & Device Management
### Goal
Allow the LLM to create tracks, insert devices, select the right target, and read the current track hierarchy for safe decision-making.

### Tasks
- **2.1 Add track creation and navigation commands**
  - Define MCP methods such as `tracks.create`, `tracks.select`, `tracks.rename`, and `tracks.delete` with optional metadata (type, position).
  - Extend `index.js` to handle those commands, optionally queuing them when Bitwig is busy.
- **2.2 Surface track metadata**
  - Build a poll/observer in the controller script that serializes `Track` + `TrackBank` summaries (name, type, armed status, solo/mute state) and streams them to the MCP server.
  - Have the Node server cache the snapshot and expose it on an MCP `context` tool so the LLM knows what tracks exist before issuing commands.
- **2.3 Device insertion/select commands**
  - Add commands for `devices.insertInstrument`, `devices.insertEffect`, `devices.select`, and `devices.browsePresets` that traverse `Device`, `DeviceBank`, and `DeviceLayer`. Ensure each command accepts the target track identifier from the cached context.

## 3. Clip Creation & Live Playback
### Goal
Enable the LLM to spawn clips, trigger/stop them, and record performances, which is critical for immediate musical feedback.

### Tasks
- **3.1 Clip lifecycle commands**
  - Define `clips.create`, `clips.launch`, `clips.stop`, `clips.record`, and `clips.quantize` along with parameters such as length, start grid, and whether to overdub.
  - Implement server-side queueing so clips are created in response to transport/track state (e.g., only when track armed).
- **3.2 Controller script clip handlers**
  - Wire the script to `ClipLauncherSlot`/`Clip` APIs, handling creation, recording, looping, and stopping while sending status updates (e.g., clip is playing, recording, has new notes).
  - Use `ClipLauncherSlotBankPlaybackStateChangedCallback` to emit playback feedback, which the MCP server surfaces as part of the `context` tool.
- **3.3 Recording safety checks**
  - Add logic in the Node server to guard against issuing clip record commands if the transport is not in record-ready state (use cached transport state) and return a helpful error message for the LLM.

## 4. Observability & Feedback Loop (Supporting Infrastructure)
### Goal
Provide the LLM confidence that Bitwig is executing the requested actions and inform it of failures or modal state changes.

### Tasks
- **4.1 State streaming channel**
  - Create a lightweight telemetry stream from the controller script (transport state, active clip, current tempo) to `index.js` over the existing socket.
  - Have the MCP server expose this state via MCP context so clients can query `bitwig.state` before issuing commands.
- **4.2 Error handling/logging**
  - Ensure every handler in the controller script wraps API calls in `try/catch` and reports errors back to the Node server, which logs them and exposes them to the LLM via `mcp.status` updates.
- **4.3 Command sequencing**
  - In the Node server, add sequence numbers or UUIDs to commands so responses can be matched, avoiding race conditions when multiple features issue commands simultaneously.

The above must-have roadmap delivers the foundation for stable, aware LLM control. Once these pieces ship we can layer the nice-to-have and killer features that follow.
