# Interface ShortMidiMessageReceivedCallback

Callback for receiving short (normal) MIDI messages on this MIDI input port.

## Method Details

### `midiReceived`

```java
void midiReceived(ShortMidiMessage msg)
```

Callback for receiving short (normal) MIDI messages on this MIDI input port.

**Since:** API version 2

---

### `midiReceived`

```java
default void midiReceived(int statusByte, int data1, int data2)
```

Description copied from interface: ShortMidiDataReceivedCallback


---

