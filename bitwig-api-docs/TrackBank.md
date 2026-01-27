# Interface TrackBank

A track bank provides access to a range of tracks and their scenes (clip launcher slots) in Bitwig Studio. Instances of track bank are configured with a fixed number of tracks and scenes and represent an excerpt of a larger list of tracks and scenes. Various methods are provided for scrolling to different sections of the track/scene list. It basically acts like a 2-dimensional window moving over the grid of tracks and scenes. To receive an instance of track bank that supports all kinds of tracks call ControllerHost.createTrackBank(int, int, int). Additional methods are provided in the ControllerHost interface to create track banks that include only main tracks (ControllerHost.createMainTrackBank(int, int, int)) or only effect tracks (ControllerHost.createEffectTrackBank(int, int, int)).

## Method Details

### `getTrack`

```java
@Deprecated Track getTrack(int indexInBank)
```

**Since:** API version 1

---

### `getChannel`

```java
@Deprecated Track getChannel(int indexInBank)
```

Returns the track at the given index within the bank.

**Parameters:**
- indexInBank - the track index within this bank, not the index within the list of all Bitwig Studio tracks. Must be in the range [0..sizeOfBank-1].
**Returns:** the requested track object
**Since:** API version 1

---

### `setTrackScrollStepSize`

```java
@Deprecated void setTrackScrollStepSize(int stepSize)
```

---

### `scrollTracksPageUp`

```java
@Deprecated void scrollTracksPageUp()
```

---

### `scrollTracksPageDown`

```java
@Deprecated void scrollTracksPageDown()
```

---

### `scrollTracksUp`

```java
@Deprecated void scrollTracksUp()
```

---

### `scrollTracksDown`

```java
@Deprecated void scrollTracksDown()
```

---

### `scrollToTrack`

```java
@Deprecated void scrollToTrack(int position)
```

---

### `addTrackScrollPositionObserver`

```java
@Deprecated void addTrackScrollPositionObserver(IntegerValueChangedCallback callback, int valueWhenUnassigned)
```

---

### `sceneBank`

```java
SceneBank sceneBank()
```

SceneBank that represents a view on the scenes in this TrackBank.

**Since:** API version 2

---

### `scrollScenesPageUp`

```java
@Deprecated void scrollScenesPageUp()
```

Scrolls the scenes one page up.

**Since:** API version 1

---

### `scrollScenesPageDown`

```java
@Deprecated void scrollScenesPageDown()
```

Scrolls the scenes one page down.

**Since:** API version 1

---

### `scrollScenesUp`

```java
@Deprecated void scrollScenesUp()
```

Scrolls the scenes one step up.

**Since:** API version 1

---

### `scrollScenesDown`

```java
@Deprecated void scrollScenesDown()
```

Scrolls the scenes one step down.

**Since:** API version 1

---

### `scrollToScene`

```java
@Deprecated void scrollToScene(int position)
```

Makes the scene with the given position visible in the track bank.

**Parameters:**
- position - the position of the scene within the underlying full list of scenes
**Since:** API version 1

---

### `addSceneScrollPositionObserver`

```java
@Deprecated void addSceneScrollPositionObserver(IntegerValueChangedCallback callback, int valueWhenUnassigned)
```

Registers an observer that reports the current scene scroll position.

**Parameters:**
- callback - a callback function that takes a single integer parameter
**Since:** API version 1

---

### `addCanScrollTracksUpObserver`

```java
@Deprecated void addCanScrollTracksUpObserver(BooleanValueChangedCallback callback)
```

---

### `addCanScrollTracksDownObserver`

```java
@Deprecated void addCanScrollTracksDownObserver(BooleanValueChangedCallback callback)
```

---

### `addCanScrollScenesUpObserver`

```java
@Deprecated void addCanScrollScenesUpObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the scene window can be scrolled further up.

**Parameters:**
- callback - a callback function that takes a single boolean parameter
**Since:** API version 1

---

### `addCanScrollScenesDownObserver`

```java
@Deprecated void addCanScrollScenesDownObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the scene window can be scrolled further down.

**Parameters:**
- callback - a callback function that takes a single boolean parameter
**Since:** API version 1

---

### `addSceneCountObserver`

```java
@Deprecated void addSceneCountObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the underlying total scene count (not the number of scenes available in the bank window).

**Parameters:**
- callback - a callback function that receives a single integer parameter
**Since:** API version 1

---

### `getClipLauncherScenes`

```java
@Deprecated ClipLauncherSlotOrSceneBank getClipLauncherScenes()
```

Returns an object that provides access to the clip launcher scenes of the track bank.

**Returns:** an object that provides access to the clip launcher scenes of the track bank.
**Since:** API version 1

---

### `launchScene`

```java
@Deprecated void launchScene(int indexInWindow)
```

Launches the scene with the given bank index.

**Parameters:**
- indexInWindow - the scene index within the bank, not the position of the scene withing the underlying full list of scenes.
**Since:** API version 1

---

### `followCursorTrack`

```java
void followCursorTrack(CursorTrack cursorTrack)
```

Causes this bank to follow the supplied cursor. When the cursor moves to a new item the bank will be scrolled so that the cursor is within the bank, if possible.

**Parameters:**
- cursorTrack - The CursorTrack that this bank should follow.
**Since:** API version 2

---

### `setShouldShowClipLauncherFeedback`

```java
void setShouldShowClipLauncherFeedback(boolean value)
```

Decides if Bitwig Studio's clip launcher should indicate the area being controlled by this controller or not.

**Since:** API versian 17

---

### `setFlatteningMode`

```java
void setFlatteningMode(TrackBankFlatteningMode mode)
```

Beta API - this method might not be available in a future version of Bitwig Studio

**Parameters:**
- mode -

---

### `setShouldIncludeAllMixerChannels`

```java
void setShouldIncludeAllMixerChannels(boolean shouldSkip)
```

Beta API - this method might not be available in a future version of Bitwig Studio Sets whether to include all channels that are visible in the mixer. When off, only tracks and groups are included; when on, drum pads and FX layers are included in addition. Disabled by default.

**Since:** API version 24

---

