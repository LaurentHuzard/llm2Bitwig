# Interface PianoKeyboard

Represents a physical piano keyboard on a HardwareSurface.

## Method Details

### `setMidiIn`

```java
void setMidiIn(MidiIn midiIn)
```

The MidiIn where this piano keyboard would send key presses. If set this allows the simulator for the hardware to simulate the note input.

---

### `setNoteInput`

```java
void setNoteInput(NoteInput noteInput)
```

Sets the NoteInput that this keyboard should send notes to.

**Since:** API version 15

---

### `setChannel`

```java
void setChannel(int channel)
```

---

### `setIsVelocitySensitive`

```java
void setIsVelocitySensitive(boolean value)
```

---

### `setSupportsPolyAftertouch`

```java
void setSupportsPolyAftertouch(boolean value)
```

---

