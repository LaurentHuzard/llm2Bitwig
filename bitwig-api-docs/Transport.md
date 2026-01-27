# Interface Transport

An interface representing the transport section in Bitwig Studio.

## Method Details

### `play`

```java
void play()
```

Starts playback in the Bitwig Studio transport.

**Since:** API version 1

---

### `continuePlayback`

```java
void continuePlayback()
```

Continues the playback in the Bitwig Studio transport.

**Since:** API version 10

---

### `playAction`

```java
HardwareActionBindable playAction()
```

Action that can be used to play the transport.

**Since:** API version 10

---

### `continuePlaybackAction`

```java
HardwareActionBindable continuePlaybackAction()
```

Action that can be used to continue the transport.

**Since:** API version 10

---

### `stop`

```java
void stop()
```

Stops playback in the Bitwig Studio transport.

**Since:** API version 1

---

### `stopAction`

```java
HardwareActionBindable stopAction()
```

Action that can be used to stop the transport.

**Since:** API version 10

---

### `togglePlay`

```java
void togglePlay()
```

Toggles the transport playback state between playing and stopped.

**Since:** API version 1

---

### `restart`

```java
void restart()
```

When the transport is stopped, calling this function starts transport playback, otherwise the transport is first stopped and the playback is restarted from the last play-start position.

**Since:** API version 1

---

### `restartAction`

```java
HardwareActionBindable restartAction()
```

Action that can be used to restart the transport.

**Since:** API version 10

---

### `record`

```java
void record()
```

Starts recording in the Bitwig Studio transport.

**Since:** API version 1

---

### `recordAction`

```java
HardwareActionBindable recordAction()
```

Action that can be used to start recording

**Since:** API version 10

---

### `rewind`

```java
void rewind()
```

Rewinds the Bitwig Studio transport to the beginning of the arrangement.

**Since:** API version 1

---

### `rewindAction`

```java
HardwareActionBindable rewindAction()
```

Action that can be used to rewind the transport.

**Since:** API version 10

---

### `fastForward`

```java
void fastForward()
```

Calling this function is equivalent to pressing the fast forward button in the Bitwig Studio transport.

**Since:** API version 1

---

### `fastForwardAction`

```java
HardwareActionBindable fastForwardAction()
```

Action that can be used to fast forward the transport.

**Since:** API version 10

---

### `tapTempo`

```java
void tapTempo()
```

When calling this function multiple times, the timing of those calls gets evaluated and causes adjustments to the project tempo.

**Since:** API version 1

---

### `tapTempoAction`

```java
HardwareActionBindable tapTempoAction()
```

Action that can be used to tap the tempo.

**Since:** API version 10

---

### `isPlaying`

```java
SettableBooleanValue isPlaying()
```

Value that reports if the Bitwig Studio transport is playing.

**Since:** API version 2

---

### `addIsPlayingObserver`

```java
@Deprecated void addIsPlayingObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the Bitwig Studio transport is playing.

**Parameters:**
- callback - a callback function that receives a single boolean argument (`true` if playing, `false` otherwise).
**Since:** API version 1

---

### `isArrangerRecordEnabled`

```java
SettableBooleanValue isArrangerRecordEnabled()
```

Value that reports if the Bitwig Studio transport is recording.

**Since:** API version 2

---

### `addIsRecordingObserver`

```java
@Deprecated void addIsRecordingObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the Bitwig Studio transport is recording.

**Parameters:**
- callback - a callback function that receives a single boolean argument (`true` if recording, `false` otherwise).
**Since:** API version 1

---

### `isArrangerOverdubEnabled`

```java
SettableBooleanValue isArrangerOverdubEnabled()
```

Value that reports if overdubbing is enabled in Bitwig Studio.

**Since:** API version 2

---

### `addOverdubObserver`

```java
@Deprecated void addOverdubObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if over-dubbing is enabled in Bitwig Studio.

**Parameters:**
- callback - a callback function that receives a single boolean argument (`true` if over-dubbing is enabled, `false` otherwise).
**Since:** API version 1

---

### `isClipLauncherOverdubEnabled`

```java
SettableBooleanValue isClipLauncherOverdubEnabled()
```

Value reports if clip launcher overdubbing is enabled in Bitwig Studio.

**Since:** API version 2

---

### `addLauncherOverdubObserver`

```java
@Deprecated void addLauncherOverdubObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if clip launcher over-dubbing is enabled in Bitwig Studio.

**Parameters:**
- callback - a callback function that receives a single boolean argument (`true` if clip launcher over-dubbing is enabled, `false` otherwise).
**Since:** API version 1

---

### `automationWriteMode`

```java
SettableEnumValue automationWriteMode()
```

Value that reports the current automation write mode. Possible values are `"latch"`, `"touch"` or `"write"`.

**Since:** API version 2

---

### `addAutomationWriteModeObserver`

```java
@Deprecated void addAutomationWriteModeObserver(EnumValueChangedCallback callback)
```

Registers an observer that reports the current automation write mode.

**Parameters:**
- callback - a callback function that receives a single string argument. Possible values are `"latch"`, `"touch"` or `"write"`.
**Since:** API version 1

---

### `isArrangerAutomationWriteEnabled`

```java
SettableBooleanValue isArrangerAutomationWriteEnabled()
```

Value that reports if automation write is currently enabled for the arranger.

**Since:** API version 2

---

### `addIsWritingArrangerAutomationObserver`

```java
@Deprecated void addIsWritingArrangerAutomationObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if Bitwig Studio is currently writing arranger automation.

**Parameters:**
- callback - a callback function that receives a single boolean argument (`true` when arranger automation write is enabled, `false` otherwise).
**Since:** API version 1

---

### `isClipLauncherAutomationWriteEnabled`

```java
@Deprecated SettableBooleanValue isClipLauncherAutomationWriteEnabled()
```

Value that reports if automation write is currently enabled on the clip launcher.

**Since:** API version 2

---

### `addIsWritingClipLauncherAutomationObserver`

```java
@Deprecated void addIsWritingClipLauncherAutomationObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if Bitwig Studio is currently writing clip launcher automation.

**Parameters:**
- callback - a callback function that receives a single boolean argument (`true` when clip launcher automation write is enabled, `false` otherwise).
**Since:** API version 1

---

### `isAutomationOverrideActive`

```java
BooleanValue isAutomationOverrideActive()
```

Value that indicates if automation override is currently on.

**Since:** API version 2

---

### `addAutomationOverrideObserver`

```java
@Deprecated void addAutomationOverrideObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if automation is overridden in Bitwig Studio.

**Parameters:**
- callback - a callback function that receives a single boolean argument (`true` if overridden, `false` otherwise).
**Since:** API version 1

---

### `isArrangerLoopEnabled`

```java
SettableBooleanValue isArrangerLoopEnabled()
```

Value that indicates if the loop is currently active or not.

**Since:** API version 2

---

### `arrangerLoopStart`

```java
SettableBeatTimeValue arrangerLoopStart()
```

Value that corresponds to the start time of the arranger loop

**Since:** API version 15

---

### `arrangerLoopDuration`

```java
SettableBeatTimeValue arrangerLoopDuration()
```

Value that corresponds to the duration of the arranger loop

**Since:** API version 15

---

### `addIsLoopActiveObserver`

```java
@Deprecated void addIsLoopActiveObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if arranger looping is enabled in Bitwig Studio.

**Parameters:**
- callback - a callback function that receives a single boolean argument (`true` when enabled, `false` otherwise).
**Since:** API version 1

---

### `isPunchInEnabled`

```java
SettableBooleanValue isPunchInEnabled()
```

Value that reports if punch-in is enabled in the Bitwig Studio transport.

**Since:** API version 2

---

### `addPunchInObserver`

```java
@Deprecated void addPunchInObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if punch-in is enabled in the Bitwig Studio transport.

**Parameters:**
- callback - a callback function that receives a single boolean argument (`true` when punch-in is enabled, `false` otherwise).
**Since:** API version 1

---

### `isPunchOutEnabled`

```java
SettableBooleanValue isPunchOutEnabled()
```

Value that reports if punch-in is enabled in the Bitwig Studio transport.

**Since:** API version 2

---

### `addPunchOutObserver`

```java
@Deprecated void addPunchOutObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if punch-out is enabled in the Bitwig Studio transport.

**Parameters:**
- callback - a callback function that receives a single boolean argument (`true` when punch-out is enabled, `false` otherwise).
**Since:** API version 1

---

### `isMetronomeEnabled`

```java
SettableBooleanValue isMetronomeEnabled()
```

Value that reports if the metronome is enabled in Bitwig Studio.

**Since:** API version 2

---

### `addClickObserver`

```java
@Deprecated void addClickObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the metronome is enabled in Bitwig Studio.

**Parameters:**
- callback - a callback function that receives a single boolean argument (`true` when the metronome is enabled, `false` otherwise).
**Since:** API version 1

---

### `isMetronomeTickPlaybackEnabled`

```java
SettableBooleanValue isMetronomeTickPlaybackEnabled()
```

Value that reports if the metronome has tick playback enabled.

**Since:** API version 2

---

### `addMetronomeTicksObserver`

```java
@Deprecated void addMetronomeTicksObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the metronome has tick playback enabled.

**Parameters:**
- callback - a callback function that receives a single boolean argument (`true` if metronome ticks, are enabled, `false` otherwise).
**Since:** API version 1

---

### `metronomeVolume`

```java
SettableRangedValue metronomeVolume()
```

Value that reports the metronome volume.

**Since:** API version 2

---

### `addMetronomeVolumeObserver`

```java
@Deprecated void addMetronomeVolumeObserver(DoubleValueChangedCallback callback)
```

Registers an observer that reports the metronome volume.

**Parameters:**
- callback - a callback function that receives a single numeric argument.
**Since:** API version 1

---

### `isMetronomeAudibleDuringPreRoll`

```java
SettableBooleanValue isMetronomeAudibleDuringPreRoll()
```

Value that reports if the metronome is audible during pre-roll.

**Since:** API version 2

---

### `addPreRollClickObserver`

```java
@Deprecated void addPreRollClickObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the metronome is audible during pre-roll.

**Parameters:**
- callback - a callback function that receives a single boolean argument.
**Since:** API version 1

---

### `preRoll`

```java
SettableEnumValue preRoll()
```

Value that reports the current pre-roll setting. Possible values are `"none"`, `"one_bar"`, `"two_bars"`, or `"four_bars"`.

**Since:** API version 2

---

### `addPreRollObserver`

```java
@Deprecated void addPreRollObserver(EnumValueChangedCallback callback)
```

Registers an observer that reports the current pre-roll setting.

**Parameters:**
- callback - a callback function that receives a single string argument. Possible values are `"none"`, `"one_bar"`, `"two_bars"`, or `"four_bars"`.
**Since:** API version 1

---

### `toggleLoop`

```java
@Deprecated void toggleLoop()
```

Toggles the enabled state of the arranger loop in Bitwig Studio.

**Since:** API version 1

---

### `setLoop`

```java
@Deprecated void setLoop(boolean isEnabled)
```

Enables of disables the arranger loop according to the given parameter.

**Parameters:**
- isEnabled - `true` to enable the arranger loop, `false` otherwise
**Since:** API version 1

---

### `togglePunchIn`

```java
@Deprecated void togglePunchIn()
```

Toggles the punch-in enabled state of the Bitwig Studio transport.

**Since:** API version 1

---

### `togglePunchOut`

```java
@Deprecated void togglePunchOut()
```

Toggles the punch-out enabled state of the Bitwig Studio transport.

**Since:** API version 1

---

### `toggleClick`

```java
@Deprecated void toggleClick()
```

Toggles the metronome enabled state of the Bitwig Studio transport.

**Since:** API version 1

---

### `setClick`

```java
@Deprecated void setClick(boolean isEnabled)
```

Enables of disables the metronome according to the given parameter.

**Parameters:**
- isEnabled - `true` to enable the metronome, `false` otherwise
**Since:** API version 1

---

### `toggleMetronomeTicks`

```java
@Deprecated void toggleMetronomeTicks()
```

Toggles the enabled state of the metronome ticks.

**Since:** API version 1

---

### `toggleMetronomeDuringPreRoll`

```java
@Deprecated void toggleMetronomeDuringPreRoll()
```

Toggles the enabled state of the metronome during pre-roll.

**Since:** API version 1

---

### `setPreRoll`

```java
@Deprecated void setPreRoll(String value)
```

Updates the transport pre-roll setting according to the given parameter.

**Parameters:**
- value - the new pre-roll setting, either `"none"`, `"one_bar"`, `"two_bars"`, or `"four_bars"`.
**Since:** API version 1

---

### `setMetronomeValue`

```java
@Deprecated void setMetronomeValue(Number amount, Number range)
```

Sets the metronome volume.

**Parameters:**
- amount - the new metronome volume relative to the specified range. Values should be in the range [0..range-1].
**Since:** API version 1

---

### `toggleOverdub`

```java
@Deprecated void toggleOverdub()
```

Toggles the over-dubbing enabled state of the Bitwig Studio transport.

**Since:** API version 1

---

### `setOverdub`

```java
@Deprecated void setOverdub(boolean isEnabled)
```

Enables of disables arranger over-dubbing according to the given parameter.

**Parameters:**
- isEnabled - `true` to enable over-dubbing, `false` otherwise
**Since:** API version 1

---

### `toggleLauncherOverdub`

```java
@Deprecated void toggleLauncherOverdub()
```

Toggles clip launcher overdubbing in Bitwig Studio.

**Since:** API version 1

---

### `setLauncherOverdub`

```java
@Deprecated void setLauncherOverdub(boolean isEnabled)
```

Enables of disables clip launcher over-dubbing according to the given parameter.

**Parameters:**
- isEnabled - `true` to enable the over-dubbing, `false` otherwise
**Since:** API version 1

---

### `setAutomationWriteMode`

```java
@Deprecated void setAutomationWriteMode(String mode)
```

Sets the automation write mode.

**Parameters:**
- mode - the string that identifies the new automation write mode. Possible values are `"latch"`, `"touch"` or `"write"`.
**Since:** API version 1

---

### `toggleLatchAutomationWriteMode`

```java
void toggleLatchAutomationWriteMode()
```

Toggles the latch automation write mode in the Bitwig Studio transport.

**Since:** API version 1

---

### `toggleWriteArrangerAutomation`

```java
void toggleWriteArrangerAutomation()
```

Toggles the arranger automation write enabled state of the Bitwig Studio transport.

**Since:** API version 1

---

### `toggleWriteClipLauncherAutomation`

```java
@Deprecated void toggleWriteClipLauncherAutomation()
```

Toggles the clip launcher automation write enabled state of the Bitwig Studio transport.

**Since:** API version 1

---

### `resetAutomationOverrides`

```java
void resetAutomationOverrides()
```

Resets any automation overrides in Bitwig Studio.

**Since:** API version 1

---

### `returnToArrangement`

```java
void returnToArrangement()
```

Switches playback to the arrangement sequencer on all tracks.

**Since:** API version 1

---

### `getTempo`

```java
@Deprecated Parameter getTempo()
```

Returns an object that provides access to the project tempo.

**Returns:** the requested tempo value object
**Since:** API version 1

---

### `tempo`

```java
Parameter tempo()
```

Returns an object that provides access to the project tempo.

**Returns:** the requested tempo value object
**Since:** API version 1

---

### `increaseTempo`

```java
void increaseTempo(Number amount, Number range)
```

Increases the project tempo value by the given amount, which is specified relative to the given range.

**Parameters:**
- amount - the new tempo value relative to the specified range. Values should be in the range [0..range-1].
**Since:** API version 1

---

### `getPosition`

```java
SettableBeatTimeValue getPosition()
```

Returns an object that provides access to the transport position in Bitwig Studio.

**Returns:** a beat time object that represents the transport position
**Since:** API version 1

---

### `playPosition`

```java
BeatTimeValue playPosition()
```

Returns an object that provides access to the current transport position.

**Returns:** beat-time value
**Since:** API version 10

---

### `playPositionInSeconds`

```java
DoubleValue playPositionInSeconds()
```

Returns an object that provides access to the current transport position in seconds.

**Returns:** value (seconds)
**Since:** API version 10

---

### `playStartPosition`

```java
SettableBeatTimeValue playStartPosition()
```

Returns an object that provides access to the transport's play-start position. (blue triangle)

**Returns:** beat-time value
**Since:** API version 10

---

### `playStartPositionInSeconds`

```java
SettableDoubleValue playStartPositionInSeconds()
```

Returns an object that provides access to the transport's play-start position in seconds. (blue triangle)

**Returns:** value (seconds)
**Since:** API version 10

---

### `launchFromPlayStartPosition`

```java
void launchFromPlayStartPosition()
```

Make the transport jump to the play-start position.

**Since:** API version 10

---

### `launchFromPlayStartPositionAction`

```java
HardwareActionBindable launchFromPlayStartPositionAction()
```

---

### `jumpToPlayStartPosition`

```java
void jumpToPlayStartPosition()
```

Make the transport jump to the play-start position.

**Since:** API version 10

---

### `jumpToPlayStartPositionAction`

```java
HardwareActionBindable jumpToPlayStartPositionAction()
```

---

### `jumpToPreviousCueMarker`

```java
void jumpToPreviousCueMarker()
```

Make the transport jump to the previous cue marker.

**Since:** API version 10

---

### `jumpToPreviousCueMarkerAction`

```java
HardwareActionBindable jumpToPreviousCueMarkerAction()
```

---

### `jumpToNextCueMarker`

```java
void jumpToNextCueMarker()
```

Make the transport jump to the previous cue marker.

**Since:** API version 10

---

### `jumpToNextCueMarkerAction`

```java
HardwareActionBindable jumpToNextCueMarkerAction()
```

---

### `setPosition`

```java
void setPosition(double beats)
```

Sets the transport playback position to the given beat time value.

**Parameters:**
- beats - the new playback position in beats
**Since:** API version 1

---

### `incPosition`

```java
void incPosition(double beats, boolean snap)
```

Increases the transport position value by the given number of beats, which is specified relative to the given range.

**Parameters:**
- beats - the beat time value that gets added to the current transport position. Values have double precision and can be positive or negative.
**Since:** API version 1

---

### `getInPosition`

```java
SettableBeatTimeValue getInPosition()
```

Returns an object that provides access to the punch-in position in the Bitwig Studio transport.

**Returns:** a beat time object that represents the punch-in position
**Since:** API version 1

---

### `getOutPosition`

```java
SettableBeatTimeValue getOutPosition()
```

Returns an object that provides access to the punch-out position in the Bitwig Studio transport.

**Returns:** a beat time object that represents the punch-out position
**Since:** API version 1

---

### `addCueMarkerAtPlaybackPosition`

```java
void addCueMarkerAtPlaybackPosition()
```

Adds a cue marker at the current position

**Since:** API version 15

---

### `addCueMarkerAtPlaybackPositionAction`

```java
HardwareActionBindable addCueMarkerAtPlaybackPositionAction()
```

---

### `getCrossfade`

```java
@Deprecated Parameter getCrossfade()
```

Returns an object that provides access to the cross-fader, used for mixing between A/B-channels as specified on the Bitwig Studio tracks.

**Since:** API version 1

---

### `crossfade`

```java
Parameter crossfade()
```

Returns an object that provides access to the cross-fader, used for mixing between A/B-channels as specified on the Bitwig Studio tracks.

**Since:** API version 5

---

### `getTimeSignature`

```java
@Deprecated TimeSignatureValue getTimeSignature()
```

Returns an object that provides access to the transport time signature.

**Returns:** the time signature value object that represents the transport time signature.
**Since:** API version 1

---

### `timeSignature`

```java
TimeSignatureValue timeSignature()
```

Returns an object that provides access to the transport time signature.

**Returns:** the time signature value object that represents the transport time signature.
**Since:** API version 5

---

### `clipLauncherPostRecordingAction`

```java
SettableEnumValue clipLauncherPostRecordingAction()
```

Value that reports the current clip launcher post recording action. Possible values are `"off"`, `"play_recorded"`, `"record_next_free_slot"`, `"stop"`, `"return_to_arrangement"`, `"return_to_previous_clip"` or `"play_random"`.

**Since:** API version 2

---

### `addClipLauncherPostRecordingActionObserver`

```java
@Deprecated void addClipLauncherPostRecordingActionObserver(EnumValueChangedCallback callback)
```

Registers an observer that reports the current clip launcher post recording action.

**Parameters:**
- callback - a callback function that receives a single string argument. Possible values are `"off"`, `"play_recorded"`, `"record_next_free_slot"`, `"stop"`, `"return_to_arrangement"`, `"return_to_previous_clip"` or `"play_random"`.
**Since:** API version 1

---

### `setClipLauncherPostRecordingAction`

```java
@Deprecated void setClipLauncherPostRecordingAction(String action)
```

Sets the automation write mode.

**Parameters:**
- action - the string that identifies the new automation write mode. Possible values are `"off"`, `"play_recorded"`, `"record_next_free_slot"`, `"stop"`, `"return_to_arrangement"`, `"return_to_previous_clip"` or `"play_random"`.
**Since:** API version 1

---

### `getClipLauncherPostRecordingTimeOffset`

```java
SettableBeatTimeValue getClipLauncherPostRecordingTimeOffset()
```

Returns an object that provides access to the clip launcher post recording time offset.

**Returns:** a beat time object that represents the post recording time offset
**Since:** API version 1

---

### `defaultLaunchQuantization`

```java
SettableEnumValue defaultLaunchQuantization()
```

Setting for the default launch quantization. Possible values are `"none"`, `"8"`, `"4"`, `"2"`, `"1"`, `"1/2"`, `"1/4"`, `"1/8"`, `"1/16"`.

**Since:** API version 8

---

### `isFillModeActive`

```java
SettableBooleanValue isFillModeActive()
```

Value that indicates if the project's fill mode is active or not.

**Since:** API version 14

---

