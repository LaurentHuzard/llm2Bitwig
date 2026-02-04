# Bitwig MCP Controller Roadmap

This roadmap turns the Controller API surface into a practical MCP toolset. It assumes a Bitwig controller extension (JS) bridges to a Node MCP server.

## Must-have features (v1)

1) **Transport + timeline control**
- Play/stop/record/continue/restart
- Tempo, time signature, metronome
- Loop, punch in/out, and transport position

2) **Track + mixer control**
- Create audio/instrument/effect tracks
- Select track, arm/monitor, mute/solo
- Volume, pan, sends, color, name, duplicate
- Basic meter readout (VU)

3) **Clip launcher control**
- Scene and clip slot selection
- Launch/stop, record into slots
- Create empty clips, duplicate clips
- Create new scene and scene-from-playing

4) **Device + parameter control**
- Follow selected device, open/close window, expand/collapse
- Remote controls page access + parameter set/reset/touch
- Device chain navigation and insert device via browser

5) **State query + selection**
- List tracks/scenes/slots/devices through banks
- Read current selection (cursor track/device/clip)
- Return structured state to keep the LLM grounded

6) **Observability + event stream**
- Subscribe to transport/track/clip/device changes
- Emit events to MCP server to keep state synced

7) **Safety + guardrails**
- Explicitly confirm destructive actions (delete clip, remove device, unmute all)
- Idempotent operations (e.g., “ensure track exists”)

### Must-have implementation plan (tasks + subtasks)

Task 1 — **Define MCP tool contract**
- Draft tool list + JSON schemas (actions + query tools)
- Decide identifiers: trackId, sceneIndex, slotIndex, deviceIndex
- Standardize return payloads (status, current selection, updated state)
- Add safety flags (requiresConfirmation, isDestructive)

Task 2 — **Bitwig controller extension bridge**
- Instantiate core objects: `Transport`, `Application`, `Project`, `TrackBank`, `SceneBank`, `CursorTrack`, `CursorDevice`, `CursorClip`, `Browser`
- Implement a command router that maps tool calls → API calls
- Build a state cache (tracks/scenes/slots/devices) and update via observers
- Add event emission for key signals (transport, track, slot, device, tempo)

Task 3 — **Node MCP server**
- Implement transport layer (TCP or OSC) to talk to the extension
- Implement MCP tools and map them to bridge commands
- Handle timeouts, reconnection, and error normalization
- Add logging + structured diagnostics for debugging

Task 4 — **End-to-end flows**
- Scripts for “create track → insert device → create clip → play”
- Validate state round-trips and ensure observers update as expected
- Basic regression tests for each tool

Task 5 — **Docs + examples**
- Tool catalog with usage examples
- “Happy path” demos for common workflows

## Nice-to-have features (3) + plans

1) **Step-sequencer clip editing**
Plan:
- Add tools for clip grid focus and bounds (`CursorClip`, `Clip`)
- Expose note operations: set/toggle/clear/move steps
- Add helpers for pattern generation (e.g., 16-step drum grid)
- Create sample scripts: “write 4-bar beat” and “humanize”

2) **Browser assistant for content insertion**
Plan:
- Add tools to start browsing, set filters, audition results
- Expose result lists and allow “insert selected”
- Add presets/samples/clips browsing per tab
- Document typical flows (device → preset → audition → insert)

3) **Performance scene control**
Plan:
- Tools for scene launch with quantization/options
- Capture currently playing clips into a scene
- Scene naming and color helpers
- “Live set” macro commands (next scene, stop all)

## Killer feature: LLM-driven arrangement builder

**Idea:** Generate a full song skeleton from a prompt, create tracks and devices, write clip content, and arrange scenes into a coherent structure—all in Bitwig.

Plan:
1) **High-level planner**
- Define a section model (intro/verse/chorus/break)
- Map section lengths to scene indices and clip lengths

2) **Project scaffolding**
- Create tracks (drums/bass/pads/lead)
- Insert devices via browser (drum machine, synths, sampler)
- Set tempo and time signature

3) **Clip generation**
- Use `CursorClip` and `Clip` step tools to write patterns
- Optionally add variations (fills, breaks)

4) **Arrangement pass**
- Create scenes per section
- Launch or assemble scenes into a timeline
- Optional: write automation for key parameters

5) **QA + iteration**
- Query current state and confirm output
- Provide “regenerate section” and “swap instrument” tools

