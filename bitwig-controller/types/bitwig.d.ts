declare const host: ControllerHost;
declare function loadAPI(version: number): void;
declare function load(path: string): void;
declare function println(message: string): void;

declare const CursorDeviceFollowMode: {
  FOLLOW_SELECTION: number;
};

declare const Orientation: {
  HORIZONTAL: number;
  VERTICAL: number;
};

type ValueObserver<T> = (value: T) => void;

interface BooleanValue {
  markInterested(): void;
  get(): boolean;
  set(value: boolean): void;
  toggle(): void;
  addValueObserver(callback: ValueObserver<boolean>): void;
}

interface StringValue {
  markInterested(): void;
  get(): string;
  set(value: string): void;
  addValueObserver(callback: ValueObserver<string>): void;
}

interface NumberValue {
  markInterested(): void;
  get(): number;
  set(value: number): void;
  addValueObserver(callback: ValueObserver<number>): void;
  addValueObserver(range: number, callback: ValueObserver<number>): void;
}

interface RawNumberValue {
  markInterested(): void;
  getRaw(): number;
  setRaw(value: number): void;
  addRawValueObserver(callback: ValueObserver<number>): void;
}

interface ColorValue {
  markInterested(): void;
  addValueObserver(callback: (red: number, green: number, blue: number) => void): void;
  red(): number;
  green(): number;
  blue(): number;
  set(red: number, green: number, blue: number): void;
}

interface TempoValue {
  value(): RawNumberValue;
}

interface PositionValue {
  markInterested(): void;
  get(): number;
  set(value: number): void;
}

interface Arranger {
  isTimelineVisible(): SettableBooleanValue;
  isIoSectionVisible(): SettableBooleanValue;
  isClipLauncherVisible(): SettableBooleanValue;
  areEffectTracksVisible(): SettableBooleanValue;
  hasDoubleRowTrackHeight(): SettableBooleanValue;
  areCueMarkersVisible(): SettableBooleanValue;
  isPlaybackFollowEnabled(): SettableBooleanValue;
  zoomInLaneHeightsAll(): void;
  zoomOutLaneHeightsAll(): void;
  zoomInLaneHeightsSelected(): void;
  zoomOutLaneHeightsSelected(): void;
  createCueMarkerBank(size: number): CueMarkerBank;
}

interface CueMarker {
  exists(): BooleanValue;
  name(): SettableStringValue;
  position(): SettableBeatTimeValue;
  getColor(): ColorValue;
  launch(quantized: boolean): void;
}

interface CueMarkerBank {
  getItemAt(index: number): CueMarker;
  cursorIndex(): NumberValue;
  itemCount(): NumberValue;
  scrollToMarker(position: number): void;
}

interface SettableBeatTimeValue extends NumberValue {
  set(value: number): void;
  get(): number;
}

interface SettableColorValue extends ColorValue {
  set(red: number, green: number, blue: number): void;
}

interface SettableStringValue extends StringValue {
  set(value: string): void;
}

interface Transport {
  tempo(): TempoValue;
  getPosition(): PositionValue;
  isPlaying(): BooleanValue;
  isArrangerRecordEnabled(): BooleanValue;
  isArrangerLoopEnabled(): BooleanValue;
  getInPosition(): PositionValue;
  getOutPosition(): PositionValue;
  isMetronomeEnabled(): BooleanValue;
  timeSignature(): { numerator(): NumberValue; denominator(): NumberValue; set(numerator: number, denominator: number): void };
  isPunchInEnabled(): BooleanValue;
  isPunchOutEnabled(): BooleanValue;
  isArrangerOverdubEnabled(): BooleanValue;
  isClipLauncherOverdubEnabled(): BooleanValue;
  play(): void;
  stop(): void;
  restart(): void;
  record(): void;
  tapTempo(): void;
  continuePlayback(): void;
  returnToZero(): void;
  fastForward(): void;
  rewind(): void;
  incPosition(deltaBeats: number, snap: boolean): void;
  addCueMarkerAtPlaybackPosition(): void;
}

interface ClipLauncherSlot {
  hasContent(): BooleanValue;
  isPlaying(): BooleanValue;
  isRecording(): BooleanValue;
  isPlaybackQueued(): BooleanValue;
  color(): ColorValue;
  name(): StringValue;
  launch(): void;
  record(): void;
  select(): void;
  createEmptyClip(lengthInBeats: number): void;
  deleteClip(): void;
  browseToInsertClip(): void;
}

interface ClipLauncherSlotBank {
  getItemAt(index: number): ClipLauncherSlot;
  duplicateClip(index: number): void;
  select(index: number): void;
  deleteClip(index: number): void;
}

interface SendBank {
  getItemAt(index: number): NumberValue;
}

interface Track {
  volume(): NumberValue;
  pan(): NumberValue;
  mute(): BooleanValue;
  solo(): BooleanValue;
  arm(): BooleanValue;
  name(): StringValue;
  color(): ColorValue;
  exists(): BooleanValue;
  trackType(): StringValue;
  position(): NumberValue;
  isGroup(): BooleanValue;
  sendBank(): SendBank;
  clipLauncherSlotBank(): ClipLauncherSlotBank;
  createDeviceBank(size: number): DeviceBank;
  stop(): void;
  selectInMixer(): void;
  deleteObject(): void;
  duplicate(): void;
  makeVisibleInArranger(): void;
  makeVisibleInMixer(): void;
}

interface CursorTrack extends Track {
  createCursorDevice(id: string, name: string, channelCount: number, followMode: number): CursorDevice;
  createLauncherCursorClip(id: string, name: string, steps: number, pitches: number): CursorClip;
}

interface TrackBank {
  getItemAt(index: number): Track;
  followCursorTrack(track: CursorTrack): void;
  scrollForwards(): void;
  scrollBackwards(): void;
  scrollPosition(): NumberValue;
}

interface CursorClip {
  exists(): BooleanValue;
  getLoopLength(): NumberValue;
  getLoopStart(): NumberValue;
  getPlayStart(): NumberValue;
  getPlayStop(): NumberValue;
  playingStep(): NumberValue;
  color(): ColorValue;
  addStepDataObserver(callback: (step: number, pitch: number, state: number) => void): void;
  addPlayingStepObserver(callback: (step: number) => void): void;
  setStep(channel: number, step: number, pitch: number, velocity: number, duration: number): void;
  clearStep(channel: number, step: number, pitch: number): void;
  toggleStep(step: number, pitch: number, velocity: number): void;
}

interface RemoteControlParameter {
  name(): StringValue;
  value(): NumberValue;
  setIndication(enabled: boolean): void;
}

interface RemoteControlsPage {
  getParameter(index: number): RemoteControlParameter;
  selectNextPage(wrap: boolean): void;
  selectPreviousPage(wrap: boolean): void;
}

interface CursorDevice {
  name(): StringValue;
  isWindowOpen(): BooleanValue;
  isExpanded(): BooleanValue;
  isEnabled(): BooleanValue;
  exists(): BooleanValue;
  position(): NumberValue;
  createCursorRemoteControlsPage(size: number): RemoteControlsPage;
  selectNext(): void;
  selectPrevious(): void;
  selectFirst(): void;
  selectLast(): void;
  browseToInsertBeforeDevice(): void;
  browseToInsertAfterDevice(): void;
  browseToReplaceDevice(): void;
  beforeDeviceInsertionPoint(): InsertionPoint;
  afterDeviceInsertionPoint(): InsertionPoint;
  replaceDeviceInsertionPoint(): InsertionPoint;
}

interface InsertionPoint {
  browse(): void;
}

interface Device {
  name(): StringValue;
  isEnabled(): BooleanValue;
  exists(): BooleanValue;
  deleteObject(): void;
}

interface DeviceBank {
  getItemAt(index: number): Device;
}

interface Application {
  createInstrumentTrack(index: number): void;
  createAudioTrack(index: number): void;
  createEffectTrack(index: number): void;
  undo(): void;
  redo(): void;
  cut(): void;
  copy(): void;
  paste(): void;
  duplicate(): void;
  selectAll(): void;
  selectNone(): void;
  remove(): void;
  arrowKeyUp(): void;
  arrowKeyDown(): void;
  arrowKeyLeft(): void;
  arrowKeyRight(): void;
  enter(): void;
  escape(): void;
  zoomIn(): void;
  zoomOut(): void;
}

interface BrowserResultItem {
  name(): StringValue;
  isSelected(): BooleanValue;
}

interface BrowserResultItemBank {
  getItemAt(index: number): BrowserResultItem;
}

interface BrowserResultsColumn {
  createCursorItem(): unknown;
  createItemBank(size: number): BrowserResultItemBank;
}

interface PopupBrowser {
  exists(): BooleanValue;
  resultsColumn(): BrowserResultsColumn;
  smartCollectionColumn(): BrowserFilterColumn;
  selectFirstFile(): void;
  selectLastFile(): void;
  selectNextFile(): void;
  selectPreviousFile(): void;
  commit(): void;
  cancel(): void;
}

interface Project {
  createSceneFromPlayingLauncherClips(): void;
}

interface Scene {
  name(): StringValue;
  sceneIndex(): NumberValue;
  launch(): void;
  selectInEditor(): void;
  deleteObject(): void;
}

interface SceneBank {
  getScene(index: number): Scene;
  createScene(): void;
}

interface MasterTrack {
  volume(): NumberValue;
  pan(): NumberValue;
}

interface EffectTrackBank {
  getItemAt(index: number): Track;
}

interface RemoteConnection {
  setDisconnectCallback(callback: () => void): void;
  setReceiveCallback(callback: (data: number[]) => void): void;
  send(data: number[]): void;
}

interface RemoteSocket {
  setClientConnectCallback(callback: (connection: RemoteConnection) => void): void;
}

interface HardwareControl {
  getName(): string;
  setName(name: string): void;
  setLabel(label: string): void;
  setIndexInGroup(index: number): void;
}

interface HardwareSlider extends HardwareControl {
  setOrientation(orientation: number): void;
  value(): NumberValue;
}

interface AbsoluteHardwareKnob extends HardwareControl {
  value(): NumberValue;
}

interface RelativeHardwareKnob extends HardwareControl {
  setStepSize(stepSize: number): void;
  setSensitivity(sensitivity: number): void;
}

interface HardwareButton extends HardwareControl {
  isPressed(): BooleanValue;
  setAfterTouchInterceptionWindow(value: number): void;
}

interface HardwareSurface {
  createHardwareSlider(id: string): HardwareSlider;
  createAbsoluteHardwareKnob(id: string): AbsoluteHardwareKnob;
  createRelativeHardwareKnob(id: string): RelativeHardwareKnob;
  createHardwareButton(id: string): HardwareButton;
  createMultiStateHardwareLight(id: string): MultiStateHardwareLight;
  updateHardware(): void;
  invalidateHardwareOutputState(): void;
}

interface HardwareActionMatcher { }
interface HardwareInputMatcher { }
interface AbsoluteHardwareValueMatcher extends HardwareInputMatcher { }
interface RelativeHardwareValueMatcher extends HardwareInputMatcher { }

interface HardwareAction {
  setActionMatcher(matcher: HardwareActionMatcher): void;
}

interface HardwareButton extends HardwareControl {
  isPressed(): BooleanValue;
  setAfterTouchInterceptionWindow(value: number): void;
  pressedAction(): HardwareAction;
  releasedAction(): HardwareAction;
  setBackgroundLight(light: HardwareLight): void;
}

interface HardwareLight extends HardwareControl {
  isOn(): BooleanValue;
  color(): ColorValue;
}

interface MultiStateHardwareLight extends HardwareLight { }

interface HardwareSlider extends HardwareControl {
  setOrientation(orientation: number): void;
  value(): NumberValue;
  setAdjustValueMatcher(matcher: Packet | HardwareInputMatcher): void;
}

interface AbsoluteHardwareKnob extends HardwareControl {
  value(): NumberValue;
  setAdjustValueMatcher(matcher: AbsoluteHardwareValueMatcher): void;
}

interface RelativeHardwareKnob extends HardwareControl {
  setStepSize(stepSize: number): void;
  setSensitivity(sensitivity: number): void;
  setAdjustValueMatcher(matcher: RelativeHardwareValueMatcher): void;
}

interface NoteInput {
  sendRawMidiEvent(status: number, data0: number, data1: number): void;
  sendNoteOn(channel: number, key: number, velocity: number): void;
  sendNoteOff(channel: number, key: number, velocity: number): void;
  sendPolyphonicAftertouch(channel: number, key: number, pressure: number): void;
  setShouldConsumeEvents(shouldConsumeEvents: boolean): void;
}

interface MidiIn {
  createNoteInput(name: string, ...masks: string[]): NoteInput;
  createAbsoluteCCValueMatcher(channel: number, control: number): AbsoluteHardwareValueMatcher;
  createRelativeSignedBitCCValueMatcher(channel: number, control: number, steps: number): RelativeHardwareValueMatcher;
  createCCActionMatcher(channel: number, control: number, value: number): HardwareActionMatcher;
  createNoteOnActionMatcher(channel: number, note: number): HardwareActionMatcher;
  setMidiCallback(callback: (status: number, data1: number, data2: number) => void): void;
  setSysexCallback(callback: (data: string) => void): void;
}

interface MidiOut {
  sendMidi(status: number, data1: number, data2: number): void;
  sendSysex(hexString: string): void;
}

interface OscAddressSpace {
  registerMethod(addressPattern: string, typeTagPattern: string, description: string, callback: (connection: OscConnection, message: OscMessage) => void): void;
  registerDefaultMethod(callback: (connection: OscConnection, message: OscMessage) => void): void;
}

interface OscConnection {
  startBundle(): void;
  endBundle(): void;
  sendMessage(addressPattern: string, ...args: any[]): void;
}

interface OscMessage {
  getAddressPattern(): string;
  getTypeTagPattern(): string;
  getArguments(): any[];
}

interface SystemOscModule {
  createAddressSpace(): OscAddressSpace;
  createUdpServer(port: number, addressSpace: OscAddressSpace): OscConnection; // In docs: void createUdpServer(port, space). But wait, OscConnection is from connectTo.
  // Wait, createUdpServer(port, addressSpace) returns void.
  // createUdpServer(addressSpace) returns OscServer.
  // connectToUdpServer returns OscConnection.
  connectToUdpServer(host: string, port: number, addressSpace: OscAddressSpace): OscConnection;
}

interface OscServer {
  start(port: number): void;
  stop(): void;
}

interface Packet { } // Placeholder

interface Host {
  getOscModule(): SystemOscModule;
}

interface ControllerHost extends Host {
  defineController(name: string, vendor: string, version: string, id: string, author: string): void;
  defineMidiPorts(numInports: number, numOutports: number): void;
  createArranger(): Arranger;
  getMidiInPort(index: number): MidiIn;
  getMidiOutPort(index: number): MidiOut;
  createTransport(): Transport;
  createApplication(): Application;
  createPopupBrowser(): PopupBrowser;
  createCursorClip(steps: number, pitches: number): CursorClip;
  createRemoteConnection(name: string, port: number): RemoteSocket;
  createMainTrackBank(tracks: number, sends: number, scenes: number): TrackBank;
  createCursorTrack(index: number, scenes: number): CursorTrack;
  createCursorTrack(id: string, name: string, tracks: number, scenes: number, followSelection: boolean): CursorTrack;
  createMasterTrack(index: number): MasterTrack;
  createEffectTrackBank(tracks: number, sends: number, scenes: number): EffectTrackBank;
  createSceneBank(size: number): SceneBank;
  getProject(): Project;
  createHardwareSurface(): HardwareSurface;
}
