# Interface Arpeggiator

Proxy to an arpeggiator component.

## Method Details

### `mode`

```java
SettableEnumValue mode()
```

Returns an object to configure the arpeggiator mode. Possible values: - all - up - up-down - up-then-down - down - down-up - down-then-up - flow - random - converge-up - converge-down - diverge-up - diverge-down - thumb-up - thumb-down - pinky-up - pinky-down

**Since:** API version 10

---

### `octaves`

```java
SettableIntegerValue octaves()
```

Returns an object to configure the range in octaves. The range is between 0 and 8.

**Since:** API version 10

---

### `isEnabled`

```java
SettableBooleanValue isEnabled()
```

Returns an object to enable or disable the note repeat component.

**Since:** API version 10

---

### `isFreeRunning`

```java
SettableBooleanValue isFreeRunning()
```

If true the arpeggiator will not try to sync to the transport.

**Since:** API version 10

---

### `shuffle`

```java
SettableBooleanValue shuffle()
```

Return an object to configure the note repeat to use shuffle or not.

**Since:** API version 10

---

### `rate`

```java
SettableDoubleValue rate()
```

Returns an object to configure the note repeat rate in beats.

**Since:** API version 10

---

### `gateLength`

```java
SettableDoubleValue gateLength()
```

Returns an object to configure the note length, expressed as a ratio of the period. Must be between 1/32 and 8.

**Since:** API version 10

---

### `enableOverlappingNotes`

```java
SettableBooleanValue enableOverlappingNotes()
```

Let the arpeggiator play overlapping notes.

**Since:** API version 11

---

### `usePressureToVelocity`

```java
SettableBooleanValue usePressureToVelocity()
```

Will use the note pressure to determine the velocity of arpeggiated notes.

**Since:** API version 10

---

### `releaseNotes`

```java
void releaseNotes()
```

Release all notes being played.

**Since:** API version 10

---

### `humanize`

```java
SettableDoubleValue humanize()
```

Will introduce human-like errors. Between 0 and 1.

**Since:** API version 11

---

### `terminateNotesImmediately`

```java
SettableBooleanValue terminateNotesImmediately()
```

If set to true, it will terminate the playing note as soon as it is released, otherwise it will be held until its computed note-off time.

**Since:** API version 11

---

