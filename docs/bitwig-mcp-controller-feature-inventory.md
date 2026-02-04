# Bitwig MCP Controller Feature Inventory

This document maps what the Bitwig Controller API makes possible to expose through an MCP server. It is based on the API surface in `docs/`.

## 1) Core connectivity, lifecycle, and settings
- Controller extension registration and lifecycle via `ControllerHost` (define controller, MIDI ports, device discovery, restart).
- Preferences and document-scoped settings via `Preferences`, `DocumentState`, and `Settings`.
- Host and platform info via `Host` (API version, product/version, platform).

## 2) Transport, timeline, and automation
- Playback/record controls: play, stop, continue, restart, record, tap tempo via `Transport`.
- Timeline position and navigation: play-start position, jump, set/increment position, punch in/out, loop start/duration via `Transport`.
- Tempo and time signature control via `Transport.tempo()` and `Transport.timeSignature()`.
- Metronome and automation write modes via `Transport` (arranger/launcher overdub, write modes, automation override).

## 3) Tracks, channels, and mixer-level control
- Create tracks (audio, instrument, effect) via `Application`.
- Track banks and navigation windows via `TrackBank` and `ChannelBank`.
- Channel controls: volume, pan, mute, solo, sends, color, VU meter via `Channel` and `SendBank`.
- Track-specific controls: arm, monitor, crossfade, clip launcher slots, stopped state via `Track`.
- Project-wide operations: unmute/unsolo/unarm all, cue mix/volume via `Project`.

## 4) Clip launcher (session view)
- Scene and clip-slot access via `Scene`, `SceneBank`, `ClipLauncherSlot`, `ClipLauncherSlotBank`.
- Clip/scene launch with quantization/options via `ClipLauncherSlotOrScene`.
- Create/duplicate clips, record into slots, show in editor, browse-to-insert clips via `ClipLauncherSlot` and `ClipLauncherSlotBank`.
- Playback/recording state observation of slots and scenes via bank observers.

## 5) Clip content editing (step sequencer)
- Grid navigation: scroll keys/steps, set grid size via `Clip`.
- Note editing: toggle/set/clear/move steps, clear rows/columns, select step contents via `Clip`.
- Step data and playback observers via `Clip` (step data callbacks, playing step).
- Clip-level properties: name, shuffle, accent, play start via `Clip`.

## 6) Devices, remote controls, and parameters
- Device chain navigation and banking via `DeviceChain` and `DeviceBank`.
- Device states: window open, expanded, remote controls section visibility via `Device`.
- Remote control pages via `RemoteControlsPage` and `CursorRemoteControlsPage`.
- Parameters and automation interaction via `Parameter` (value, name, reset, touch, automation).
- Device browsing/insert via `DeviceBank.browseToInsertDevice` and `Browser` sessions.

## 7) Browsing and content insertion
- Contextual browser sessions via `Browser` (device, preset, sample, clip, music, multisample).
- Session banks, filters, result lists via `BrowsingSession*`, `BrowserFilter*`, `BrowserResults*`.
- Commit/cancel browsing, audition toggles, minimized state via `Browser`.

## 8) Selection, cursors, and navigation helpers
- Cursor track/device/clip for focused control via `CursorTrack`, `CursorDevice`, `CursorClip`.
- Follow modes and navigation behaviors via `CursorDeviceFollowMode` and `CursorNavigationMode`.
- Cursor-based remote controls and clip focus for LLM-friendly “current selection” control.

## 9) MIDI I/O and performance input
- Note input with translation tables, MPE/expressive MIDI, arpeggiator, latch via `NoteInput`.
- Raw MIDI send into instruments via `NoteInput.sendRawMidiEvent`.
- MIDI ports, message callbacks, and note playback observation via `MidiIn`, `MidiOut`, `Channel.playingNotes`.

## 10) UI panel control and visual feedback
- Arranger visibility/zoom controls via `Arranger`.
- Mixer visibility/zoom controls via `Mixer`.
- Cue markers and timeline helpers via `Arranger` and `CueMarkerBank`.

## 11) Networking and OSC for bridging
- TCP remote connections via `ControllerHost.connectToRemoteHost` and `RemoteConnection`.
- OSC server and connections via `OscModule`, `OscServer`, `OscConnection` for external control pathways.

## 12) Hardware surface integration (optional for MCP)
- Hardware controls, lights, displays, graphics output via `Hardware*`, `GraphicsOutput`, `Bitmap`, `Image`.
- Useful if you later want to mirror LLM actions to a physical controller.

