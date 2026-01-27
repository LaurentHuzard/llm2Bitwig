# Interface Arranger

An interface representing various commands which can be performed on the Bitwig Studio arranger. To receive an instance of the application interface call ControllerHost.createArranger().

## Method Details

### `isPlaybackFollowEnabled`

```java
SettableBooleanValue isPlaybackFollowEnabled()
```

Gets an object that allows to enable/disable arranger playback follow. Observers can be registered on the returned object for receiving notifications when the setting switches between on and off.

**Returns:** a boolean value object that represents the enabled state of arranger playback follow
**Since:** API version 1

---

### `hasDoubleRowTrackHeight`

```java
SettableBooleanValue hasDoubleRowTrackHeight()
```

Gets an object that allows to control the arranger track height. Observers can be registered on the returned object for receiving notifications when the track height changes.

**Returns:** a boolean value object that has the state `true` when the tracks have double row height and `false` when the tracks have single row height.
**Since:** API version 1

---

### `areCueMarkersVisible`

```java
SettableBooleanValue areCueMarkersVisible()
```

Gets an object that allows to show/hide the cue markers in the arranger panel. Observers can be registered on the returned object for receiving notifications when the cue marker lane switches between shown and hidden.

**Returns:** a boolean value object that represents the cue marker section visibility
**Since:** API version 1

---

### `isClipLauncherVisible`

```java
SettableBooleanValue isClipLauncherVisible()
```

Gets an object that allows to show/hide the clip launcher in the arranger panel. Observers can be registered on the returned object for receiving notifications when the clip launcher switches between shown and hidden.

**Returns:** a boolean value object that represents the clip launcher visibility
**Since:** API version 1

---

### `isTimelineVisible`

```java
SettableBooleanValue isTimelineVisible()
```

Gets an object that allows to show/hide the timeline in the arranger panel. Observers can be registered on the returned object for receiving notifications when the timeline switches between shown and hidden.

**Returns:** a boolean value object that represents the timeline visibility
**Since:** API version 1

---

### `isIoSectionVisible`

```java
SettableBooleanValue isIoSectionVisible()
```

Gets an object that allows to show/hide the track input/output choosers in the arranger panel. Observers can be registered on the returned object for receiving notifications when the I/O section switches between shown and hidden.

**Returns:** a boolean value object that represents the visibility of the track I/O section
**Since:** API version 1

---

### `areEffectTracksVisible`

```java
SettableBooleanValue areEffectTracksVisible()
```

Gets an object that allows to show/hide the effect tracks in the arranger panel. Observers can be registered on the returned object for receiving notifications when the effect track section switches between shown and hidden.

**Returns:** a boolean value object that represents the visibility of the effect track section
**Since:** API version 1

---

### `createCueMarkerBank`

```java
CueMarkerBank createCueMarkerBank(int size)
```

Returns an object that provides access to a bank of successive cue markers using a window configured with the given size, that can be scrolled over the list of markers.

**Parameters:**
- size - the number of simultaneously accessible items
**Returns:** the requested item bank object

---

### `zoomInLaneHeightsAllAction`

```java
HardwareActionBindable zoomInLaneHeightsAllAction()
```

Zooms in all arranger lanes, if it the arranger is visible.

**Since:** API version 14

---

### `zoomInLaneHeightsAll`

```java
void zoomInLaneHeightsAll()
```

---

### `zoomOutLaneHeightsAllAction`

```java
HardwareActionBindable zoomOutLaneHeightsAllAction()
```

Zooms out all arranger lanes, if it the arranger is visible.

**Since:** API version 14

---

### `zoomOutLaneHeightsAll`

```java
void zoomOutLaneHeightsAll()
```

---

### `zoomLaneHeightsAllStepper`

```java
RelativeHardwarControlBindable zoomLaneHeightsAllStepper()
```

Same as zoomInLaneHeightsAllAction/zoomOutLaneHeightsAllAction, but as a stepper

**Since:** API version 14

---

### `zoomInLaneHeightsSelectedAction`

```java
HardwareActionBindable zoomInLaneHeightsSelectedAction()
```

Zooms in selected arranger lanes, if it the arranger is visible.

**Since:** API version 14

---

### `zoomInLaneHeightsSelected`

```java
void zoomInLaneHeightsSelected()
```

---

### `zoomOutLaneHeightsSelectedAction`

```java
HardwareActionBindable zoomOutLaneHeightsSelectedAction()
```

Zooms out selected arranger lanes, if it the arranger is visible.

**Since:** API version 14

---

### `zoomOutLaneHeightsSelected`

```java
void zoomOutLaneHeightsSelected()
```

---

### `zoomLaneHeightsSelectedStepper`

```java
RelativeHardwarControlBindable zoomLaneHeightsSelectedStepper()
```

Same as zoomInLaneHeightsSelectedAction/zoomOutLaneHeightsSelectedAction, but as a stepper

**Since:** API version 14

---

### `addPlaybackFollowObserver`

```java
@Deprecated void addPlaybackFollowObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if playback-follow is enabled.

**Parameters:**
- callback - a callback function object that accepts a single bool parameter
**Since:** API version 1

---

### `addTrackRowHeightObserver`

```java
@Deprecated void addTrackRowHeightObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports the current configuration of the arranger track row height.

**Parameters:**
- callback - a callback function object that accepts a single bool parameter. The parameter indicates if the row height is double (`true`) or single (`false`).
**Since:** API version 1

---

### `addCueMarkerVisibilityObserver`

```java
@Deprecated void addCueMarkerVisibilityObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the cue marker lane is visible.

**Parameters:**
- callback - a callback function object that accepts a single bool parameter.
**Since:** API version 1

---

### `togglePlaybackFollow`

```java
@Deprecated void togglePlaybackFollow()
```

Toggles the playback follow state.

**Since:** API version 1

---

### `toggleTrackRowHeight`

```java
@Deprecated void toggleTrackRowHeight()
```

Toggles the arranger track row height between `double` and `single`.

**Since:** API version 1

---

### `toggleCueMarkerVisibility`

```java
@Deprecated void toggleCueMarkerVisibility()
```

Toggles the visibility of the arranger cue marker lane.

**Since:** API version 1

---

