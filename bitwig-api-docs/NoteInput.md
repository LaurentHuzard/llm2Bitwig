# Interface NoteInput

Instances of this interface implement note input functionality used for recording notes in Bitwig Studio and for playing the instruments in tracks on hardware keyboards. In Bitwig Studio the note inputs are shown in the input choosers of Bitwig Studio tracks.

## Method Details

### `setShouldConsumeEvents`

```java
void setShouldConsumeEvents(boolean shouldConsumeEvents)
```

Specifies if the note input should consume MIDI notes, or in other words if it should prevent forwarding incoming notes to the MIDI callback registered in MidiIn.setMidiCallback(ShortMidiDataReceivedCallback). This setting is `true` by default.

**Parameters:**
- shouldConsumeEvents - `true` if note events should be consumed, `false` of the events should be additionally sent to the callback registered via MidiIn.setMidiCallback(ShortMidiDataReceivedCallback)
**Since:** API version 1

---

### `setKeyTranslationTable`

```java
void setKeyTranslationTable(Object[] table)
```

Specifies a translation table which defines the actual key value (0-127) of notes arriving in Bitwig Studio for each note key potentially received from the hardware. This is used for note-on/off and polyphonic aftertouch events. Specifying a value of `-1` for a key means that notes with the key value will be filtered out. Typically this method is used to implement transposition or scale features in controller scripts. By default an identity transform table is configured, which means that all incoming MIDI notes keep their original key value when being sent into Bitwig Studio.

**Parameters:**
- table - an array which should contain 128 entries. Each entry should be a note value in the range [0..127] or -1 in case of filtering.
**Since:** API version 1

---

### `setVelocityTranslationTable`

```java
void setVelocityTranslationTable(Object[] table)
```

Specifies a translation table which defines the actual velocity value (0-127) of notes arriving in Bitwig Studio for each note velocity potentially received from the hardware. This is used for note-on events only. Typically this method is used to implement velocity curves or fixed velocity mappings in controller scripts. By default an identity transform table is configured, which means that all incoming MIDI notes keep their original velocity when being sent into Bitwig Studio.

**Parameters:**
- table - an array which should contain 128 entries. Each entry should be a note value in the range [0..127] or -1 in case of filtering.
**Since:** API version 1

---

### `assignPolyphonicAftertouchToExpression`

```java
void assignPolyphonicAftertouchToExpression(int channel, NoteInput.NoteExpression expression, int pitchRange)
```

Assigns polyphonic aftertouch MIDI messages to the specified note expression. Multi-dimensional control is possible by calling this method several times with different MIDI channel parameters. If a key translation table is configured by calling setKeyTranslationTable(Object[]), that table is used for polyphonic aftertouch as well.

**Parameters:**
- channel - the MIDI channel to map, range [0..15]
**Since:** API version 1

---

### `setUseExpressiveMidi`

```java
void setUseExpressiveMidi(boolean useExpressiveMidi, int baseChannel, int pitchBendRange)
```

Enables use of Expressive MIDI mode. (note-per-channel)

**Parameters:**
- useExpressiveMidi - enabled/disable the MPE mode for this note-input

---

### `setUseMultidimensionalPolyphonicExpression`

```java
@Deprecated void setUseMultidimensionalPolyphonicExpression(boolean useMPE, int baseChannel)
```

Enables use of Multidimensional Polyphonic Expression mode. (note-per-channel)

**Parameters:**
- useMPE - enabled/disable the MPE mode for this note-input

---

### `sendRawMidiEvent`

```java
void sendRawMidiEvent(int status, int data0, int data1)
```

Sends MIDI data directly to the note input. This will bypass both the event filter and translation tables. The MIDI channel of the message will be ignored.

**Parameters:**
- status - the status byte of the MIDI message
**Since:** API version 1

---

### `noteLatch`

```java
NoteLatch noteLatch()
```

Creates a proxy object to the NoteInput's NoteLatch component.

**Since:** API version 10

---

### `arpeggiator`

```java
Arpeggiator arpeggiator()
```

Creates a proxy object to the NoteInput's Arpeggiator component.

**Since:** API version 10

---

### `includeInAllInputs`

```java
SettableBooleanValue includeInAllInputs()
```

Should this note input be included in the "All Inputs" note source?

**Since:** API version 10

---

