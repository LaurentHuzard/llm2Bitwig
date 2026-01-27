# Interface MidiOut

Instances of this interface are used to send MIDI messages to a specific MIDI hardware.

## Method Details

### `sendMidi`

```java
void sendMidi(int status, int data1, int data2)
```

Sends a MIDI message to the hardware device.

**Parameters:**
- status - the status byte of the MIDI message, system messages are not permitted.
**Since:** API version 1

---

### `sendSysex`

```java
void sendSysex(String hexString)
```

Sends a MIDI SysEx message to the hardware device. Starting from API version 19, sending invalid sysex will crash the ControllerExtension.

**Parameters:**
- hexString - the sysex message formatted as hexadecimal value string
**Since:** API version 1

---

### `sendSysex`

```java
void sendSysex(byte[] data)
```

Sends a MIDI SysEx message to the hardware device. Starting from API version 19, sending invalid sysex will crash the ControllerExtension.

**Parameters:**
- data - the array of bytes to send
**Since:** API version 2

---

### `sendSysexBytes`

```java
void sendSysexBytes(byte[] data)
```

Sends a MIDI SysEx message to the hardware device. This method is identical to sendSysex(byte[]) but exists so that Javascript controllers can explicitly call this method instead of relying on some intelligent overload resolution of the Javascript engine based on its loose type system. Starting from API version 19, sending invalid sysex will crash the ControllerExtension.

**Parameters:**
- data - the array of bytes to send
**Since:** API version 2

---

### `setShouldSendMidiBeatClock`

```java
@Deprecated void setShouldSendMidiBeatClock(boolean shouldSendClock)
```

Enables or disables sending MIDI beat clock messages to the hardware depending on the given parameter. Typically MIDI devices that run an internal sequencer such as hardware step sequencers would be interested in MIDI clock messages.

**Parameters:**
- shouldSendClock - `true` in case the hardware should receive MIDI clock messages, `false` otherwise
**Since:** API version 1

---

