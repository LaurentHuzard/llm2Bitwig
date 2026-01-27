# Interface Track

Instances of this interface represent tracks in Bitwig Studio.

## Method Details

### `position`

```java
IntegerValue position()
```

Value that reports the position of the track within the list of Bitwig Studio tracks.

**Since:** API version 2

---

### `addPositionObserver`

```java
@Deprecated void addPositionObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the position of the track within the list of Bitwig Studio tracks.

**Parameters:**
- callback - a callback function that receives a single integer parameter
**Since:** API version 1

---

### `getClipLauncherSlots`

```java
@Deprecated ClipLauncherSlotBank getClipLauncherSlots()
```

Returns an object that can be used to access the clip launcher slots of the track.

**Returns:** an object that represents the clip launcher slots of the track
**Since:** API version 1

---

### `clipLauncherSlotBank`

```java
ClipLauncherSlotBank clipLauncherSlotBank()
```

Returns an object that can be used to access the clip launcher slots of the track.

**Returns:** an object that represents the clip launcher slots of the track
**Since:** API version 2

---

### `getClipLauncher`

```java
@Deprecated ClipLauncherSlotBank getClipLauncher()
```

**Since:** API version 1

---

### `addIsQueuedForStopObserver`

```java
@Deprecated void addIsQueuedForStopObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the clip launcher slots are queued for stop.

**Parameters:**
- callback - a callback function that receives a single boolean argument.
**Since:** API version 1

---

### `getArm`

```java
@Deprecated SettableBooleanValue getArm()
```

Returns an object that provides access to the arm state of the track.

**Returns:** a boolean value object
**Since:** API version 1

---

### `arm`

```java
SettableBooleanValue arm()
```

Returns an object that provides access to the arm state of the track.

**Returns:** a boolean value object
**Since:** API version 5

---

### `getMonitor`

```java
@Deprecated SettableBooleanValue getMonitor()
```

Returns an object that provides access to the monitoring state of the track.

**Returns:** a boolean value object
**Since:** API version 1

---

### `monitor`

```java
@Deprecated SettableBooleanValue monitor()
```

Returns an object that provides access to the monitoring state of the track.

**Returns:** a boolean value object
**Since:** API version 5

---

### `isMonitoring`

```java
BooleanValue isMonitoring()
```

Returns an object that provides a readout of the monitoring state of the track.

**Returns:** a read-only boolean value object
**Since:** API version 14

---

### `getAutoMonitor`

```java
@Deprecated SettableBooleanValue getAutoMonitor()
```

Returns an object that provides access to the auto-monitoring state of the track.

**Returns:** a boolean value object
**Since:** API version 1

---

### `autoMonitor`

```java
@Deprecated SettableBooleanValue autoMonitor()
```

Returns an object that provides access to the auto-monitoring state of the track.

**Returns:** a boolean value object
**Since:** API version 5

---

### `monitorMode`

```java
SettableEnumValue monitorMode()
```

Returns an object that provides access to the auto-monitoring mode of the track.

**Returns:** a boolean value object
**Since:** API version 14

---

### `getCrossFadeMode`

```java
@Deprecated SettableEnumValue getCrossFadeMode()
```

Returns an object that provides access to the cross-fade mode of the track.

**Returns:** an enum value object that has three possible states: "A", "B", or "AB"
**Since:** API version 1

---

### `crossFadeMode`

```java
SettableEnumValue crossFadeMode()
```

Returns an object that provides access to the cross-fade mode of the track.

**Returns:** an enum value object that has three possible states: "A", "B", or "AB"
**Since:** API version 5

---

### `isStopped`

```java
BooleanValue isStopped()
```

Value that reports if this track is currently stopped. When a track is stopped it is not playing content from the arranger or clip launcher.

**Since:** API version 2

---

### `getIsMatrixStopped`

```java
@Deprecated BooleanValue getIsMatrixStopped()
```

Returns a value object that provides access to the clip launcher playback state of the track.

**Returns:** a boolean value object that indicates if the clip launcher is stopped for this track
**Since:** API version 1

---

### `getIsMatrixQueuedForStop`

```java
@Deprecated BooleanValue getIsMatrixQueuedForStop()
```

Returns a value object that provides access to the clip launcher's queue-for-stop state on this track. A clip is considered to be queued for stop when playback has been requested to be stopped on that clip, but the playback has not stopped yet due to the current launch quantization settings.

**Returns:** a boolean value object that indicates if the clip launcher slots have been queued for stop
**Since:** API version 1

---

### `isQueuedForStop`

```java
BooleanValue isQueuedForStop()
```

Value that reports if the clip launcher slots are queued for stop.

**Since:** API version 2

---

### `getSourceSelector`

```java
@Deprecated SourceSelector getSourceSelector()
```

Returns the source selector for the track, which is shown in the IO section of the track in Bitwig Studio and lists either note or audio sources or both depending on the track type.

**Returns:** a source selector object
**Since:** API version 1

---

### `sourceSelector`

```java
SourceSelector sourceSelector()
```

Returns the source selector for the track, which is shown in the IO section of the track in Bitwig Studio and lists either note or audio sources or both depending on the track type.

**Returns:** a source selector object
**Since:** API version 5

---

### `stop`

```java
void stop()
```

Stops playback of the track.

**Since:** API version 1

---

### `stopAction`

```java
HardwareActionBindable stopAction()
```

Action to call stop().

**Since:** API version 10

---

### `stopAlt`

```java
void stopAlt()
```

Stops playback of the track using alternative quantization.

**Since:** API version 18

---

### `stopAltAction`

```java
HardwareActionBindable stopAltAction()
```

Action to call stopAlt().

**Since:** API version 18

---

### `returnToArrangement`

```java
void returnToArrangement()
```

Calling this method causes the arrangement sequencer to take over playback.

**Since:** API version 1

---

### `setName`

```java
void setName(String name)
```

Updates the name of the track.

**Parameters:**
- name - the new track name
**Since:** API version 1

---

### `addPitchNamesObserver`

```java
void addPitchNamesObserver(IndexedStringValueChangedCallback callback)
```

Registers an observer that reports names for note key values on this track. The track might provide special names for certain keys if it contains instruments that support that features, such as the Bitwig Drum Machine.

**Parameters:**
- callback - a callback function that receives two arguments: 1. the key value in the range [0..127], and 2. the name string
**Since:** API version 1

---

### `playNote`

```java
void playNote(int key, int velocity)
```

Plays a note on the track with a default duration and the given key and velocity.

**Parameters:**
- key - the key value of the played note
**Since:** API version 1

---

### `startNote`

```java
void startNote(int key, int velocity)
```

Starts playing a note on the track with the given key and velocity.

**Parameters:**
- key - the key value of the played note
**Since:** API version 1

---

### `stopNote`

```java
void stopNote(int key, int velocity)
```

Stops playing a currently played note.

**Parameters:**
- key - the key value of the playing note
**Since:** API version 1

---

### `sendMidi`

```java
void sendMidi(int status, int data1, int data2)
```

Sends a MIDI message to the hardware device.

**Parameters:**
- status - the status byte of the MIDI message
**Since:** API version 2

---

### `trackType`

```java
StringValue trackType()
```

Value that reports the track type. Possible reported track types are `Group`, `Instrument`, `Audio`, `Hybrid`, `Effect` or `Master`.

**Since:** API version 2

---

### `addTrackTypeObserver`

```java
@Deprecated void addTrackTypeObserver(int numChars, String textWhenUnassigned, StringValueChangedCallback callback)
```

Registers an observer that reports the track type. Possible reported track types are `Group`, `Instrument`, `Audio`, `Hybrid`, `Effect` or `Master`.

**Parameters:**
- numChars - the maximum number of characters used for the reported track type
**Since:** API version 1

---

### `isGroup`

```java
BooleanValue isGroup()
```

Value that reports if the track may contain child tracks, which is the case for group tracks.

**Since:** API version 2

---

### `isGroupExpanded`

```java
SettableBooleanValue isGroupExpanded()
```

Value that indicates if the group's child tracks are visible.

**Since:** API version 15

---

### `getIsPreFader`

```java
SettableBooleanValue getIsPreFader()
```

If the track is an effect track, returns an object that indicates if the effect track is configured as pre-fader.

**Since:** API version 10

---

### `addIsGroupObserver`

```java
@Deprecated void addIsGroupObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the track may contain child tracks, which is the case for group tracks.

**Parameters:**
- callback - a callback function that receives a single boolean parameter.
**Since:** API version 1

---

### `getCanHoldNoteData`

```java
@Deprecated SettableBooleanValue getCanHoldNoteData()
```

Returns an object that indicates if the track may contain notes.

**Returns:** a boolean value object
**Since:** API version 1

---

### `canHoldNoteData`

```java
SettableBooleanValue canHoldNoteData()
```

Returns an object that indicates if the track may contain notes.

**Returns:** a boolean value object
**Since:** API version 5

---

### `getCanHoldAudioData`

```java
@Deprecated SettableBooleanValue getCanHoldAudioData()
```

Returns an object that indicates if the track may contain audio events.

**Returns:** a boolean value object
**Since:** API version 1

---

### `canHoldAudioData`

```java
SettableBooleanValue canHoldAudioData()
```

Returns an object that indicates if the track may contain audio events.

**Returns:** a boolean value object
**Since:** API version 5

---

### `createCursorDevice`

```java
CursorDevice createCursorDevice()
```

Returns an object that provides access to the cursor item of the track's device selection as shown in the Bitwig Studio user interface.

**Returns:** the requested device selection cursor object
**Since:** API version 1

---

### `createCursorDevice`

```java
CursorDevice createCursorDevice(String name)
```

Creates a named device selection cursor that is independent from the device selection in the Bitwig Studio user interface, assuming the name parameter is not null. When `name` is `null` the result is equal to calling createCursorDevice().

**Parameters:**
- name - the name of the custom device selection cursor, for example "Primary", or `null` to refer to the device selection cursor in the arranger cursor track as shown in the Bitwig Studio user interface.
**Returns:** the requested device selection cursor object
**Since:** API version 1

---

### `createCursorDevice`

```java
CursorDevice createCursorDevice(String name, int numSends)
```

Creates a named device selection cursor that is independent from the device selection in the Bitwig Studio user interface, assuming the name parameter is not null. When `name` is `null` the result is equal to calling createCursorDevice().

**Parameters:**
- name - the name of the custom device selection cursor, for example "Primary", or `null` to refer to the device selection cursor in the arranger cursor track as shown in the Bitwig Studio user interface.
**Returns:** the requested device selection cursor object
**Since:** API version 1

---

### `getPrimaryDevice`

```java
@Deprecated Device getPrimaryDevice()
```

Gets the channels primary device.

**Returns:** an object that provides access to the channels primary device.
**Since:** API version 1

---

### `getPrimaryInstrument`

```java
@Deprecated Device getPrimaryInstrument()
```

**Since:** API version 1

---

### `createTrackBank`

```java
TrackBank createTrackBank(int numTracks, int numSends, int numScenes, boolean hasFlatTrackList)
```

Returns a track bank with the given number of child tracks, sends and scenes. The track bank will only have content if the connected track is a group track. A track bank can be seen as a fixed-size window onto the list of tracks in the connected track group including their sends and scenes, that can be scrolled in order to access different parts of the track list. For example a track bank configured for 8 tracks can show track 1-8, 2-9, 3-10 and so on. The idea behind the `bank pattern` is that hardware typically is equipped with a fixed amount of channel strips or controls, for example consider a mixing console with 8 channels, but Bitwig Studio documents contain a dynamic list of tracks, most likely more tracks than the hardware can control simultaneously. The track bank returned by this function provides a convenient interface for controlling which tracks are currently shown on the hardware. Creating a track bank using this method will consider all tracks in the document, including effect tracks and the master track. Use createMainTrackBank(int, int, int, boolean) or createEffectTrackBank(int, int, boolean) in case you are only interested in tracks of a certain kind.

**Parameters:**
- numTracks - the number of child tracks spanned by the track bank
**Returns:** an object for bank-wise navigation of tracks, sends and scenes
**Since:** API version 1

---

### `createTrackBank`

```java
TrackBank createTrackBank(int numTracks, int numSends, int numScenes, TrackBankFlatteningMode flatteningMode)
```

Beta API - this method might not be available in a future version of Bitwig Studio

**Parameters:**
- flatteningMode - see comments in TrackBankFlatteningMode
**Since:** API version 25

---

### `createMainTrackBank`

```java
TrackBank createMainTrackBank(int numTracks, int numSends, int numScenes, boolean hasFlatTrackList)
```

Returns a track bank with the given number of child tracks, sends and scenes. Only audio tracks, instrument tracks and hybrid tracks are considered. The track bank will only have content if the connected track is a group track. For more information about track banks and the `bank pattern` in general, see the documentation for createTrackBank(int, int, int, boolean).

**Parameters:**
- numTracks - the number of child tracks spanned by the track bank
**Returns:** an object for bank-wise navigation of tracks, sends and scenes
**Since:** API version 1

---

### `createMainTrackBank`

```java
TrackBank createMainTrackBank(int numTracks, int numSends, int numScenes, TrackBankFlatteningMode flatteningMode)
```

Beta API - this method might not be available in a future version of Bitwig Studio

**Parameters:**
- flatteningMode - see comments in TrackBankFlatteningMode
**Since:** API version 25

---

### `createEffectTrackBank`

```java
TrackBank createEffectTrackBank(int numTracks, int numScenes, boolean hasFlatTrackList)
```

Returns a track bank with the given number of child effect tracks and scenes. Only effect tracks are considered. The track bank will only have content if the connected track is a group track. For more information about track banks and the `bank pattern` in general, see the documentation for createTrackBank(int, int, int, boolean).

**Parameters:**
- numTracks - the number of child tracks spanned by the track bank
**Returns:** an object for bank-wise navigation of tracks, sends and scenes
**Since:** API version 1

---

### `createEffectTrackBank`

```java
TrackBank createEffectTrackBank(int numTracks, int numScenes, TrackBankFlatteningMode flatteningMode)
```

Beta API - this method might not be available in a future version of Bitwig Studio

**Parameters:**
- flatteningMode - see comments in TrackBankFlatteningMode
**Since:** API version 25

---

### `createEffectTrackBank`

```java
TrackBank createEffectTrackBank(int numTracks, int numSends, int numScenes, boolean hasFlatTrackList)
```

Returns a track bank with the given number of child effect tracks and scenes. Only effect tracks are considered. The track bank will only have content if the connected track is a group track. For more information about track banks and the `bank pattern` in general, see the documentation for createTrackBank(int, int, int, boolean).

**Parameters:**
- numTracks - the number of child tracks spanned by the track bank
**Returns:** an object for bank-wise navigation of tracks, sends and scenes
**Since:** API version 18

---

### `createEffectTrackBank`

```java
TrackBank createEffectTrackBank(int numTracks, int numSends, int numScenes, TrackBankFlatteningMode flatteningMode)
```

Beta API - this method might not be available in a future version of Bitwig Studio

**Parameters:**
- flatteningMode - see comments in TrackBankFlatteningMode
**Since:** API version 25

---

### `createMasterTrack`

```java
MasterTrack createMasterTrack(int numScenes)
```

Returns an object that represents the master track of the connected track group. The returned object will only have content if the connected track is a group track.

**Parameters:**
- numScenes - the number of scenes for bank-wise navigation of the master tracks clip launcher slots.
**Returns:** an object representing the master track of the connected track group.
**Since:** API version 1

---

### `createSiblingsTrackBank`

```java
TrackBank createSiblingsTrackBank(int numTracks, int numSends, int numScenes, boolean shouldIncludeEffectTracks, boolean shouldIncludeMasterTrack)
```

Returns a bank of sibling tracks with the given number of tracks, sends and scenes. For more information about track banks and the `bank pattern` in general, see the documentation for createTrackBank(int, int, int, boolean).

**Parameters:**
- numTracks - the number of child tracks spanned by the track bank
**Returns:** an object for bank-wise navigation of sibling tracks
**Since:** API version 1

---

### `afterTrackInsertionPoint`

```java
InsertionPoint afterTrackInsertionPoint()
```

InsertionPoint that can be used to insert after this track.

**Since:** API version 7

---

### `beforeTrackInsertionPoint`

```java
InsertionPoint beforeTrackInsertionPoint()
```

InsertionPoint that can be used to insert after this track.

**Since:** API version 7

---

### `createParentTrack`

```java
Track createParentTrack(int numSends, int numScenes)
```

Creates an object that represent the parent track.

**Since:** API version 10

---

### `addNoteSource`

```java
void addNoteSource(NoteInput noteInput)
```

Routes the given noteInput directly to the track regardless of monitoring.

**Since:** API version 10

---

### `removeNoteSource`

```java
void removeNoteSource(NoteInput noteInput)
```

Removes a routing operated by addNoteSource(NoteInput)

**Since:** API version 10

---

### `createNewLauncherClip`

```java
void createNewLauncherClip(int slotIndex, int lengthInBeats)
```

Will create a new empty clip at or after slot index. If necessary, a new scene will be created. The new clip will be selected.

**Parameters:**
- slotIndex - absolute slot index in the track (unrelated to banks)
**Since:** API version 10

---

### `createNewLauncherClip`

```java
void createNewLauncherClip(int slotIndex)
```

Will create a new empty clip at or after slot index. It will use the default clip length. If necessary, a new scene will be created. The new clip will be selected.

**Parameters:**
- slotIndex - absolute slot index in the track (unrelated to banks)
**Since:** API version 10

---

### `recordNewLauncherClip`

```java
void recordNewLauncherClip(int slotIndex)
```

Will start recording a new clip at or after slot index. If necessary, a new scene will be created. The new clip will be selected.

**Parameters:**
- slotIndex - absolute slot index in the track (unrelated to banks)
**Since:** API version 10

---

### `selectSlot`

```java
void selectSlot(int slotIndex)
```

Selects the slot at the given index.

**Parameters:**
- slotIndex - absolute slot index in the track (unrelated to banks)
**Since:** API version 10

---

### `launchLastClipWithOptions`

```java
void launchLastClipWithOptions(String quantization, String launchMode)
```

Launches the last clip with the given options:

**Parameters:**
- quantization - possible values are "default", "none", "8", "4", "2", "1", "1/2", "1/4", "1/8", "1/16"
**Since:** API version 16

---

### `launchLastClipWithOptionsAction`

```java
HardwareActionBindable launchLastClipWithOptionsAction(String quantization, String launchMode)
```

---

### `createCursorRemoteControlsPage`

```java
CursorRemoteControlsPage createCursorRemoteControlsPage(int parameterCount)
```

Creates a cursor for the selected remote controls page in the device with the supplied number of parameters. This section will follow the current page selection made by the user in the application.

**Parameters:**
- parameterCount - The number of parameters the remote controls should contain
**Since:** API version 18

---

### `createCursorRemoteControlsPage`

```java
CursorRemoteControlsPage createCursorRemoteControlsPage(String name, int parameterCount, String filterExpression)
```

Creates a cursor for a remote controls page in the device with the supplied number of parameters. This section will be independent from the current page selected by the user in Bitwig Studio's user interface. The supplied filter is an expression that can be used to match pages this section is interested in. The expression is matched by looking at the tags added to the pages. If the expression is empty then no filtering will occur.

**Parameters:**
- name - A name to associate with this section. This will be used to remember manual mappings made by the user within this section.
**Since:** API version 18

---

