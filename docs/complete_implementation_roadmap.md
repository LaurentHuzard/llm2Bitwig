# Comprehensive Bitwig API Implementation Roadmap

This roadmap outlines the path to full coverage of the Bitwig Studio API within the MCP controller. The goal is to implement **all** available API interfaces, exposing them as MCP tools and state inspectors.

## 🟢 Phase 1: Core Foundation (Current Status)
*Focus: Essential navigation, playback, mixing, and basic device control.*
- [x] **Transport**: Play, stop, record, tempo, position.
- [x] **TrackBank**: Volume, pan, mute, solo, arm, selection, banking.
- [x] **Mixer**: Master track, effect tracks, returns.
- [x] **Device**: Device banking, remote controls, bypassing, browsing (basic).
- [x] **Clip Launcher**: Slot interaction, scene launching, basic step data.
- [x] **Cursor**: `CursorTrack`, `CursorDevice`, `CursorClip` navigation.

---

## 🟡 Phase 2: Hardware & MIDI Integration
*Focus: Enabling physical hardware integration and raw MIDI/OSC communication.*

### Issue 2.1: Advanced Hardware Abstraction
**Objective**: Map physical controls to Bitwig parameters dynamically.
- [x] **Subtask 2.1.1**: Implement `HardwareSurface` creation/management.
- [x] **Subtask 2.1.2**: Implement `AbsoluteHardwareControl` and `AbsoluteHardwareKnob`.
- [x] **Subtask 2.1.3**: Implement `RelativeHardwareControl` and `RelativeHardwareKnob`.
- [x] **Subtask 2.1.4**: Implement `HardwareButton` and `HardwareLight` (with `HardwareLightVisualState`).
- [ ] **Subtask 2.1.5**: Implement `HardwareTextDisplay` and `HardwarePixelDisplay`.
- [x] **Subtask 2.1.6**: Bind controls using `HardwareActionBindable` and `HardwareActionBinding`.

### Issue 2.2: MIDI & OSC Connectivity
**Objective**: Allow raw MIDI I/O and Open Sound Control messaging.
- [x] **Subtask 2.2.1**: Implement `MidiIn` with `ShortMidiMessageReceivedCallback` and `SysexMidiDataReceivedCallback`.
- [x] **Subtask 2.2.2**: Implement `MidiOut` for sending Short MIDI and Sysex.
- [x] **Subtask 2.2.3**: Implement `OscServer` management (start/stop/configure).
- [x] **Subtask 2.2.4**: Create `OscAddressSpace` registering and `OscMethod` callbacks.
- [x] **Subtask 2.2.5**: Handle `OscMessage`, `OscBundle`, and `OscPacket` parsing/sending.

---

## 🟠 Phase 3: Arranger & Timeline Mastery
*Focus: Deep control over the linear arrangement and timeline markers.*

### Issue 3.1: Arranger Control
**Objective**: Manipulate the arrangement view programmatically.
- [ ] **Subtask 3.1.1**: Implement `Arranger` interface (cue visibility, playback follow).
- [ ] **Subtask 3.1.2**: Add `Arranger` clips manipulation (move/copy/delete clips on timeline).
- [ ] **Subtask 3.1.3**: Implement `TimelineEditor` specific interactions (zoom/scroll).

### Issue 3.2: Cue Markers
**Objective**: Navigation via song sections.
- [ ] **Subtask 3.2.1**: Implement `CueMarkerBank` for listing markers.
- [ ] **Subtask 3.2.2**: Tool to create `CueMarker` at current position.
- [ ] **Subtask 3.2.3**: Tools to jump to, rename, and color markers.

---

## 🔵 Phase 4: Creative Note & Audio Tools
*Focus: Generating music, handling inputs, and detailed editing.*

### Issue 4.1: Note Input & Expressions
**Objective**: Advanced note entry and MPE support.
- [ ] **Subtask 4.1.1**: Implement `NoteInput` with `NoteExpression` (Poly Aftertouch, Timbre, etc.).
- [ ] **Subtask 4.1.2**: Implement `DrumPadBank` and `DrumPad` interactions (scrolling/layers).
- [ ] **Subtask 4.1.3**: Implement `PianoKeyboard` layout awareness.

### Issue 4.2: Groove & Quantization
**Objective**: Rhythmic feel and timing.
- [ ] **Subtask 4.2.1**: Implement `Groove` object control (shuffle info, accent).

---

## 🟣 Phase 5: Deep Browser & System Access
*Focus: Finding sounds and managing the global environment.*

### Issue 5.1: Specialized Browsing Sessions
**Objective**: Granular search for specific content types.
- [ ] **Subtask 5.1.1**: Implement `BitwigBrowsingSession` base methods.
- [ ] **Subtask 5.1.2**: Implement dedicated sessions: `DeviceBrowsingSession`, `SampleBrowsingSession`, `PresetBrowsingSession`, `MultiSampleBrowsingSession`, `ClipBrowsingSession`, `MusicBrowsingSession`.
- [ ] **Subtask 5.1.3**: Implement `BrowserFilterColumn` and `BrowserResultsColumn` navigation.

### Issue 5.2: Settings & Preferences
**Objective**: Configuring the DAW environment.
- [ ] **Subtask 5.2.1**: Implement `Preferences` access (read/write defined settings).
- [ ] **Subtask 5.2.2**: Implement `Settings` API for extending controller settings.
- [ ] **Subtask 5.2.3**: Access `Signal` for monitoring audio levels globally.

---

## ⚪ Phase 6: Visuals & UI Feedback
*Focus: Displaying information back to the user/AI.*

### Issue 6.1: Graphics Output
**Objective**: Rendering visuals for hardware displays (or virtual equivalents).
- [ ] **Subtask 6.1.1**: Implement `GraphicsOutput` buffering/drawing context.
- [ ] **Subtask 6.1.2**: handling `Bitmap` loading and manipulation.
- [ ] **Subtask 6.1.3**: Define `FontOptions`, `TextExtents` for rendering text.

### Issue 6.2: IO Configuration
**Objective**: Managing audio/MIDI interfaces.
- [ ] **Subtask 6.2.1**: Implement `AudioHardwareIoInfo` query.
- [ ] **Subtask 6.2.2**: Implement `AudioIoDeviceMatcher` for auto-configuration.
- [ ] **Subtask 6.2.3**: Implement `UsbDeviceMatcher` and related connection callbacks.

---

## 🟤 Phase 7: Application Actions & Automation
*Focus: Triggering global commands and automation curves.*

### Issue 7.1: Global Actions
**Objective**: Accessing the "F1" Action list.
- [ ] **Subtask 7.1.1**: Implement `Application.getActions()` to list all available IDs.
- [ ] **Subtask 7.1.2**: Create `Action` execution tool.
- [ ] **Subtask 7.1.3**: Organize by `ActionCategory`.

### Issue 7.2: Automation & Envelopes
**Objective**: Detailed parameter movement.
- [ ] **Subtask 7.2.1**: Implement `SimpleEnvelope` or automation writing via `Parameter`.
- [ ] **Subtask 7.2.2**: Handle `ModulationSource` mapping.

---

## 🏁 Execution Strategy for Devs
1. **Pick an Issue**: Start with **Phase 2** (Hardware/MIDI) or **Phase 3** (Arranger) as they open the most new capabilities.
2. **Scope**: Each Subtask should ideally correspond to a single PR or module update.
3. **Verify**: Use the `view_file` tool on `bitwig-api-docs/<ClassName>.md` before implementation to understand methods.
4. **Test**: Create a reproduction script ensuring the new tool affects the Bitwig state correctly.
