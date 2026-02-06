# Bitwig MCP POC

**A Proof of Concept bridging [Bitwig Studio](https://www.bitwig.com/) with the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/).**

## 🎯 Goal
The goal of this project is to demonstrate how an AI Agent can control a Digital Audio Workstation (DAW) like Bitwig Studio. By exposing Bitwig's API through an MCP Server, Large Language Models (LLMs) can directly interact with the music production environment to perform tasks like:
- Creating tracks
- Controlling transport (Play, Stop, Restart)
- *(Future)* Modifying devices, arranging clips, and mixing.

## 🏗 Architecture
The project consists of two main components communicating over a local TCP socket:

1.  **MCP Server (`server-mcp/index.ts`, build output in `dist/index.js`)**
    - A Node.js application that implements the Model Context Protocol.
    - It listens for instructions from an MCP Client (like an AI Assistant).
    - It acts as a TCP Server on port `8888` to relay commands to Bitwig.

2.  **Bitwig Controller Script (`BitwigPOC.control.ts`, compiled to `.control.js`)**
    - A Java/JavaScript extension running inside Bitwig Studio.
    - It connects to the MCP Server via TCP.
    - It executes the API commands (e.g., `application.createInstrumentTrack()`) received from the server.

```mermaid
graph LR
    A[AI Agent / MCP Client] -->|MCP Protocol| B[Node.js MCP Server]
    B -->|TCP :8888| C[Bitwig Controller Script]
    C -->|Bitwig API| D[Bitwig Studio]
```

## ✨ Features / Tools

The following MCP tools are currently implemented:

### Transport
- `transport_play`: Start playback
- `transport_stop`: Stop playback
- `transport_restart`: Restart playback
- `transport_record`: Toggle recording
- `transport_get_tempo` / `transport_set_tempo`: Manage BPM
- `transport_get_position` / `transport_set_position`: Manage playhead position
- `transport_playing_status`: Check if transport is playing
- `transport_toggle_loop`: Toggle loop on/off
- `transport_set_loop_start` / `transport_set_loop_end`: Set loop region
- `transport_get_loop_status`: Query loop state (enabled, start, end)
- `transport_tap_tempo`: Tap to match BPM via rhythmic input
- `transport_get_punch_status` / `transport_set_punch_in` / `transport_set_punch_out`: Read and control punch-in/out recording gates
- `transport_toggle_punch_in` / `transport_toggle_punch_out`: Flip the punch gate state
- `transport_get_overdub_status` / `transport_toggle_arranger_overdub` / `transport_toggle_launcher_overdub`: Inspect and toggle arranger/launcher overdub modes
- `transport_continue_playback`, `transport_return_to_zero`, `transport_fast_forward`, `transport_rewind`, `transport_nudge_forward`, `transport_nudge_backward`: Navigate the timeline without restarting playback

### Track & Mixer
- `track_bank_get_status`: Get info (name/vol/pan/mute/solo) for 8 tracks
- `track_bank_set_volume`, `_pan`, `_mute`, `_solo`: Control tracks by bank index
- `track_bank_select`: Select a track in the bank
- `track_delete`: Delete a track
- `track_rename`: Rename a track
- `track_duplicate`: Duplicate a track
- `track_set_color`: Set track color (RGB)
- `track_selected_get_status`: Get info for the currently selected track
- `track_selected_set_volume`, `_pan`, `_mute`, `_solo`, `_arm`: Control the selected track
- `track_list`: Enumerate the current bank of 8 tracks with metadata (name, type, position, group flag, color)
- `track_get_info`: Get deep metadata and state (volume/pan/mute/solo/arm) for a single track index
- `track_scroll_into_view`: Make a specific track visible in the arranger and mixer
- `track_bank_scroll_forward` / `_backward` / `_to_position`: Scroll the bank through the overall track list

### Cursor & Selection
- `cursor_track_get_status`: Read the selected track's metadata, transport state, color, and mix settings
- `cursor_device_get_status`: Inspect the currently selected device (expanded, enabled, window state)
- `cursor_clip_get_status`: Inspect the currently selected clip (loop positions, play region, color)

### Testing
- Phase 1 is covered by new automated tests:
  - `tests/test_phase1.ts` exercises the combined transport, browser, and track tools delivered so far.
  - `tests/test_transport.ts` now validates tap tempo, punch/overdub controls, and navigation tools.
  - `tests/test_browser.ts` now asserts the updated `browser_set_filter` behavior.

## 🚀 Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Bitwig Studio](https://www.bitwig.com/) installed

### 2. Install Dependencies
Clone this repository and install the Node.js dependencies:
```bash
npm install
```

### 3. Install Bitwig Controller Script
You need to install the controller script so Bitwig can load it.

**Option A: Symbol Link (Recommended for development)**
Symlink the `bitwig-controller/BitwigPOC` folder into your Bitwig Controller Scripts directory.
*Likely location on Linux/Mac:* `~/Documents/Bitwig Studio/Controller Scripts/`
*Likely location on Windows:* `%USERPROFILE%\Documents\Bitwig Studio\Controller Scripts\`

```bash
# Example for Linux/Mac
ln -s "$(pwd)/bitwig-controller/BitwigPOC" "$HOME/Documents/Bitwig Studio/Controller Scripts/"
```

**Option B: Manual Copy**
Copy the `bitwig-controller/BitwigPOC` folder into your Bitwig Controller Scripts directory.

### 4. Enable in Bitwig
1. Open Bitwig Studio.
2. Go to **Settings** > **Controllers**.
3. Choose **Add controller manually**.
4. Select **Bitwig POC** > **Bitwig POC**.
5. The script should load and attempt to connect to the server (it will retry if the server isn't running).

## 💻 Usage

### 1. Start the MCP Server
Run the Node.js server. It will start listening on the standard input/output for MCP and on TCP port 19561 for Bitwig.

```bash
node dist/index.js
```

### 2. Connect your AI Agent
Configure your MCP Client (e.g., Claude Desktop, Zed, or other MCP-compliant tools) to run the command above.

### 3. Example Prompts
Once connected, you can ask your AI Agent:
> "Add a new instrument track in Bitwig."
> "Start playback."
> "Stop the music."

## 🧪 LLM Test Environment

For testing the MCP server with an actual LLM agent flow (simulated via CLI), use the dedicated test environment.

### Quick Start
```bash
./tests/test-env/run-llm-test.sh
```

See the [Test Environment Documentation](test-env/README.md) for more details and example prompts.
