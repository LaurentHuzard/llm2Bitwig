# Interface ClipLauncherSlot

Starts browsing for content that can be inserted in this slot in Bitwig Studio's popup browser.

## Method Details

### `isSelected`

```java
BooleanValue isSelected()
```

Value that reports whether this slot is selected or not.

**Since:** API version 2

---

### `hasContent`

```java
BooleanValue hasContent()
```

Value that reports whether this slot has content or not.

**Since:** API version 2

---

### `isPlaying`

```java
BooleanValue isPlaying()
```

Value that reports whether this slot is playing or not.

**Since:** API version 2

---

### `isPlaybackQueued`

```java
BooleanValue isPlaybackQueued()
```

Value that reports whether this slot is queued for playback or not.

**Since:** API version 2

---

### `isRecording`

```java
BooleanValue isRecording()
```

Value that reports whether this slot is recording or not.

**Since:** API version 2

---

### `isRecordingQueued`

```java
BooleanValue isRecordingQueued()
```

Value that reports whether this slot is queued for recording or not.

**Since:** API version 2

---

### `isStopQueued`

```java
BooleanValue isStopQueued()
```

Value that reports true if the slot has a clip playing and the track is queued for stop.

**Since:** API version 2

---

### `browseToInsertClip`

```java
void browseToInsertClip()
```

Starts browsing for content that can be inserted in this slot in Bitwig Studio's popup browser.

**Since:** API version 2

---

### `color`

```java
SettableColorValue color()
```

Value that reports the color of this slot.

**Since:** API version 2

---

### `select`

```java
void select()
```

Selects the slot.

**Since:** API version 10

---

### `selectAction`

```java
HardwareActionBindable selectAction()
```

**Since:** API version 10

---

### `record`

```java
void record()
```

Start recording a clip.

**Since:** API version 10

---

### `recordAction`

```java
HardwareActionBindable recordAction()
```

**Since:** API version 10

---

### `showInEditor`

```java
void showInEditor()
```

Makes the clip content of the slot visible in the note or audio editor.

**Since:** API version 10

---

### `createEmptyClip`

```java
void createEmptyClip(int lengthInBeats)
```

Creates an new clip.

**Since:** API version 10

---

### `duplicateClip`

```java
void duplicateClip()
```

Duplicates the clip.

**Since:** API version 10

---

