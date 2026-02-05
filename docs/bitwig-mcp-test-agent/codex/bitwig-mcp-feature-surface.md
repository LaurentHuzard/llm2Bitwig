# Bitwig MCP Controller Feature Surface

This document organizes the high-level capabilities exposed by Bitwig Studio’s controller API (see the `.md` files in `docs/`) so we can quickly understand what any MCP bridge can control.

## 1. Application and Project Lifecycle
- **Project/session commands**: `Application` exposes project tab navigation, engine activation/deactivation, global actions, and flexible action lookup so the server can make decisions based on what Bitwig can currently do.
- **Track scaffolding**: create instrument, audio, or effect tracks at any index (`createInstrumentTrack`, `createAudioTrack`, `createEffectTrack`) while tracking engine health (`hasActiveEngine`) for reliability.
- **Document snapshots**: `DocumentState`, `Project`, and `Document` APIs let us capture/save the UI state and any relevant metadata so a connector can stay in sync with Bitwig.

## 2. Transport and Playback Control
- **Transport basics** (`Transport.md`): play, stop, continue, restart, record, rewind, fast-forward, toggle play, and tap tempo keep LLMs in perfect sync with the arrangement.
- **Low-latency actions**: hardware bindings such as `playAction`, `recordAction`, and `stopAction` mirror the physical controller buttons and can be triggered by MCP clients for consistent automation.
- **Time-manipulation helpers**: the BeatTime and CueMarker APIs (e.g., `BeatTimeValue`, `CueMarker`, `TimeSignatureValue`) allow precise transport positioning, tempo changes, and marker navigation.

## 3. Track, Mixer, and Channel Management
- **Track browsing and selection**: `TrackBank`, `CursorTrack`, and `ChannelBank` provide architecture for paging through the track list, selecting, and monitoring tracks along with their meters and sends.
- **Mixer control**: mixer primitives (`Mixer`, `Channel`, `Send`, `SoloValue`, `MuteValue`, `VolumeValue`, `PanValue`) open up LLM-level control over levels, routing, and monitoring states.
- **Track lifecycle**: `Track` objects expose clip banks, playback states, and automation readiness so MCP commands can arm, select, collapse, or hide tracks during composition.

## 4. Clip Launcher and Arrangement
- **Clip creation and launch**: `ClipLauncherSlot`, `ClipLauncherSlotBank`, `ClipLauncherSlotOrScene`, and `Clip` expose all clip operations—create, start, stop, loop, record, and quantize—for live performance control.
- **Scene and arrangement navigation**: `Scene`/`SceneBank` plus `Arranger`, `TimelineEditor`, `InsertionPoint`, and `CueMarker` allow jumping between scenes and arranging material directly on the timeline.
- **Playback state observation**: `ClipLauncherSlotBankPlaybackStateChangedCallback` and similar listeners provide feedback on clip progress, enabling the connector to report context to the LLM.

## 5. Devices, Modulation, and Automation
- **Device trees**: `Device`, `DeviceBank`, `DeviceChain`, `DeviceLayer`, and `DeviceSlot` let a connector traverse instrument/effect racks, insert devices, and select layers for parameter editing.
- **Parameter control**: `Parameter`, `RemoteControlsPage`, `Macro`, and `SettableRangedValue` can read and write values, toggle booleans, and route automation targets for creative parameter modulation.
- **Modulation and expression**: `ModulationSource`, `NoteExpression`, and the `NoteInput.NoteExpression` API allow the MCP path to inject or respond to expressive gestures and multi-dimensional parameter data.
- **Automation editing**: `Automation`, `Curve`, and `NoteStep` objects provide handles for writing automation clips, drawing curves, and building step sequences that an LLM could request.

## 6. Browsing, Presets, and Assets
- **Browser navigation**: `Browser`, `BrowserColumn`, `BrowserResultsColumn`, and their `Bank` variants make it possible to step through library categories, filter results, and drill into instruments/presets.
- **Asset selection helpers**: `BrowserFilterItem`, `BrowserItem`, and `BrowserResultsItem` surface metadata, previews, and thumbnails so the bridge can present structured choices back to the LLM.
- **Sample and multi-sample browsing**: `SampleBrowsingSession`, `MultiSampleBrowsingSession`, and `MultiSampleBrowsingSession` let users audition and load samples directly from the API.

## 7. MIDI, OSC, and Hardware Integration
- **Note input and performance**: `NoteInput`, `PlayingNote`, `NoteStep`, `NoteOccurrence`, and `NoteInput.NoteExpression` provide the primitives for injecting MIDI/phrasal data or responding to hardware keys.
- **Hardware surfaces**: `HardwareSurface`, `HardwareControl`, `HardwareButton`, `HardwareSlider`, `HardwareLight`, and `HardwareTextDisplay` give MCP clients the ability to map controls, read LEDs, and write text/graphics for feedback loops.
- **OSC and MIDI routing**: `MidiIn`, `MidiOut`, `OscServer`, `OscConnection`, and `OscAddressSpace` expose low-latency streaming channels, enabling remote hardware or OSC-friendly LLM clients.

## 8. Observability, Graphics, and Utility Primitives
- **Value wrappers**: `BooleanValue`, `DoubleValue`, `IntegerValue`, `StringValue`, and `SettableValue` track state with observers (`*ValueChangedCallback`) so the connector can stay reactive.
- **Callback and async helpers**: `Callback`, `DataReceivedCallback`, `ShortMidiMessageReceivedCallback`, and `AsyncTransferCompledCallback` provide hooks for async hardware/file operations that the MCP server might expose as streaming events.
- **Graphics and visual feedback**: `Bitmap`, `GraphicsOutput`, `HardwareTextDisplayLine`, and `GradientPattern` allow scripts to paint UI overlays or telemetry that the LLM bridge can parse/capturing during live sessions.

This matrix demonstrates that every major Bitwig subsystem—from transport down to hardware feedback—can be surfaced through MCP. The next steps are deciding which subset to expose first and formalizing the command schema that our Node.js bridge already understands.
