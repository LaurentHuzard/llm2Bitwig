# Interface ClipLauncherSlotBank

Instances of this interface represent a scrollable fixed-size window that is connected to a section of the clip launcher slots for a specific track.

## Method Details

### `select`

```java
void select(int slot)
```

Selects the slot with the given index.

**Parameters:**
- slot - the index of the slot within the slot window.
**Since:** API version 1

---

### `record`

```java
void record(int slot)
```

Starts recording into the slot with the given index.

**Parameters:**
- slot - the index of the slot within the slot window.
**Since:** API version 1

---

### `showInEditor`

```java
void showInEditor(int slot)
```

Makes the clip content of the slot with the given index visible in the note or audio editor.

**Parameters:**
- slot - the index of the slot within the slot window.
**Since:** API version 1

---

### `createEmptyClip`

```java
void createEmptyClip(int slot, int lengthInBeats)
```

Creates an new clip in the slot with the given index.

**Parameters:**
- slot - the index of the slot within the slot window.
**Since:** API version 1

---

### `deleteClip`

```java
@Deprecated void deleteClip(int slot)
```

Deletes the clip in the slot with the given index.

**Parameters:**
- slot - the index of the slot within the slot window.
**Since:** API version 1

---

### `duplicateClip`

```java
void duplicateClip(int slot)
```

Duplicates the clip in the slot with the given index.

**Parameters:**
- slot - the index of the slot within the slot window.
**Since:** API version 1

---

### `addIsSelectedObserver`

```java
void addIsSelectedObserver(IndexedBooleanValueChangedCallback callback)
```

Registers an observer that reports selection changes for the slots inside the window.

**Parameters:**
- callback - a callback function that receives two parameters: 1. the slot index (integer), and 2. a boolean parameter indicating if the slot at that index is selected (`true`) or not (`false`)
**Since:** API version 1

---

### `addHasContentObserver`

```java
void addHasContentObserver(IndexedBooleanValueChangedCallback callback)
```

Registers an observer that reports which slots contain clips.

**Parameters:**
- callback - a callback function that receives two parameters: 1. the slot index (integer), and 2. a boolean parameter indicating if the slot at that index contains a clip (`true`) or not (`false`)
**Since:** API version 1

---

### `addPlaybackStateObserver`

```java
void addPlaybackStateObserver(ClipLauncherSlotBankPlaybackStateChangedCallback callback)
```

Registers an observer that reports the playback state of clips / slots. The reported states include `stopped`, `playing`, `recording`, but also `queued for stop`, `queued for playback`, `queued for recording`.

**Parameters:**
- callback - a callback function that receives three parameters: 1. the slot index (integer), 2. the queued or playback state: `0` when stopped, `1` when playing, or `2` when recording, and 3. a boolean parameter indicating if the second argument is referring to the queued state (`true`) or the actual playback state (`false`)
**Since:** API version 1

---

### `addIsPlayingObserver`

```java
void addIsPlayingObserver(IndexedBooleanValueChangedCallback callback)
```

Registers an observer that reports which slots have clips that are currently playing.

**Parameters:**
- callback - a callback function that receives two parameters: 1. the slot index (integer), and 2. a boolean parameter indicating if the slot at that index has a clip that is currently playing (`true`) or not (`false`)
**Since:** API version 1

---

### `addIsRecordingObserver`

```java
void addIsRecordingObserver(IndexedBooleanValueChangedCallback callback)
```

Registers an observer that reports which slots have clips that are currently recording.

**Parameters:**
- callback - a callback function that receives two parameters: 1. the slot index (integer), and 2. a boolean parameter indicating if the slot at that index has a clip that is currently recording (`true`) or not (`false`)
**Since:** API version 1

---

### `addIsPlaybackQueuedObserver`

```java
void addIsPlaybackQueuedObserver(IndexedBooleanValueChangedCallback callback)
```

Add an observer if clip playback is queued on the slot.

**Parameters:**
- callback - a callback function that receives two parameters: 1. the slot index (integer), and 2. a boolean parameter indicating if the slot at that index has a clip that is currently queued for playback (`true`) or not (`false`)
**Since:** API version 1

---

### `addIsRecordingQueuedObserver`

```java
void addIsRecordingQueuedObserver(IndexedBooleanValueChangedCallback callback)
```

Add an observer if clip recording is queued on the slot.

**Parameters:**
- callback - a callback function that receives two parameters: 1. the slot index (integer), and 2. a boolean parameter indicating if the slot at that index has a clip that is currently queued for recording (`true`) or not (`false`)
**Since:** API version 1

---

### `addIsStopQueuedObserver`

```java
void addIsStopQueuedObserver(IndexedBooleanValueChangedCallback callback)
```

Add an observer if clip playback is queued to stop on the slot.

**Parameters:**
- callback - a callback function that receives two parameters: 1. the slot index (integer), and 2. a boolean parameter indicating if the slot at that index has a clip that is currently queued for stop (`true`) or not (`false`)
**Since:** API version 1

---

### `addIsQueuedObserver`

```java
@Deprecated void addIsQueuedObserver(IndexedBooleanValueChangedCallback callback)
```

**Since:** API version 1

---

### `addColorObserver`

```java
void addColorObserver(IndexedColorValueChangedCallback callback)
```

Registers an observer that reports the colors of clip in the current slot window.

**Parameters:**
- callback - a callback function that receives four parameters: 1. the slot index (integer), 2. the red coordinate of the RBG color value, 3. the green coordinate of the RBG color value, and 4. the blue coordinate of the RBG color value
**Since:** API version 1

---

### `setIndication`

```java
@Deprecated void setIndication(boolean shouldIndicate)
```

Specifies if the Bitwig Studio clip launcher should indicate which slots are part of the window. By default indications are disabled.

**Parameters:**
- shouldIndicate - `true` if visual indications should be enabled, `false` otherwise
**Since:** API version 1

---

### `isMasterTrackContentShownOnTrackGroups`

```java
SettableBooleanValue isMasterTrackContentShownOnTrackGroups()
```

Returns an object that can be used to observe and toggle if the slots on a connected track group show either scenes launch buttons (for launching the content of the track group) or the clips of the group master track. This setting no longer exist.

**Returns:** a boolean value object.

---

