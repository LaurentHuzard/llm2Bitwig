# Interface ClipLauncherSlotOrSceneBank<ItemType extends ClipLauncherSlotOrScene>

An abstract interface that represents the clip launcher scenes or slots of a single track.

## Method Details

### `launch`

```java
void launch(int slot)
```

Launches the scene/slot with the given index.

**Parameters:**
- slot - the index of the slot that should be launched
**Since:** API version 1

---

### `launchAlt`

```java
void launchAlt(int slot)
```

Launches the scene/slot with the given index.

**Parameters:**
- slot - the index of the slot that should be launched
**Since:** API version 18

---

### `stop`

```java
void stop()
```

Stops clip launcher playback for the associated track.

**Since:** API version 1

---

### `stopAlt`

```java
void stopAlt()
```

Stops clip launcher playback for the associated track.

**Since:** API version 18

---

### `stopAction`

```java
HardwareActionBindable stopAction()
```

Action to call stop().

**Since:** API version 10

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

Performs a return-to-arrangement operation on the related track, which caused playback to be taken over by the arrangement sequencer.

**Since:** API version 1

---

### `addNameObserver`

```java
void addNameObserver(IndexedStringValueChangedCallback callback)
```

Registers an observer that reports the names of the scenes and slots. The slot names reflect the names of containing clips.

**Parameters:**
- callback - a callback function receiving two parameters: 1. the slot index (integer) within the configured window, and 2. the name of the scene/slot (string)
**Since:** API version 1

---

