# Interface NoteLatch

Creates a proxy object to the NoteInput's NoteLatch component.

## Method Details

### `isEnabled`

```java
SettableBooleanValue isEnabled()
```

Returns an object to enable or disable the note latch component.

**Since:** API version 10

---

### `mode`

```java
SettableEnumValue mode()
```

Returns an object to configure the note latch mode. Possible values: - chord - toggle - velocity

**Since:** API version 10

---

### `mono`

```java
SettableBooleanValue mono()
```

Only one note at a time.

**Since:** API version 10

---

### `velocityThreshold`

```java
SettableIntegerValue velocityThreshold()
```

The velocity threshold used by the velocity latch mode.

**Since:** API version 10

---

### `activeNotes`

```java
IntegerValue activeNotes()
```

How many notes are being latched.

**Since:** API version 10

---

### `releaseNotes`

```java
void releaseNotes()
```

Release all notes being latched.

**Since:** API version 10

---

