# Interface CueMarker

This interface defines access to the common attributes and operations of cue markers.

## Method Details

### `launch`

```java
void launch(boolean quantized)
```

Launches playback at the marker position.

**Parameters:**
- quantized - Specified if the cue marker should be launched quantized or immediately
**Since:** API version 2

---

### `name`

```java
SettableStringValue name()
```

Gets a representation of the marker name.

**Since:** API version 15

---

### `getColor`

```java
ColorValue getColor()
```

Gets a representation of the marker color.

**Since:** API version 2

---

### `position`

```java
SettableBeatTimeValue position()
```

Gets a representation of the markers beat-time position in quarter-notes.

**Since:** API version 10

---

### `getName`

```java
StringValue getName()
```

Gets a representation of the marker name.

**Since:** API version 2

---

