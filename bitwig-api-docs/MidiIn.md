# Interface MidiIn

Instances of this interface are used to setup handler functions for incoming MIDI messages from a specific MIDI hardware. Expressions can be used to generate matchers for various MIDI events that can then be used to update hardware control states (see createActionMatcher(String) and HardwareControl). The expression language supports these operators in the same way that C, Java, C++ do: +, -, *, /, %, <<, >>, &&, ||, &, |, ^, <, <=, >, >=, ==, != The following variables are also defined for matching parts of the event: status - Value of the status byte data1 - Value of the first data byte data2 - Value of the second data byte event - Integer value of the whole MIDI event with data2 byte in the least significant bits Integers can be represented in hex using same syntax as C. 'true' and 'false' keywords are also defined.

## Method Details

### `setMidiCallback`

```java
void setMidiCallback(ShortMidiDataReceivedCallback callback)
```

Registers a callback for receiving short (normal) MIDI messages on this MIDI input port.

**Parameters:**
- callback - a callback function that receives three integer parameters: 1. the status byte 2. the data1 value 2. the data2 value
**Since:** API version 1

---

### `setSysexCallback`

```java
void setSysexCallback(SysexMidiDataReceivedCallback callback)
```

Registers a callback for receiving sysex MIDI messages on this MIDI input port.

**Parameters:**
- callback - a callback function that takes a single string argument
**Since:** API version 1

---

### `createNoteInput`

```java
NoteInput createNoteInput(String name, String... masks)
```

Creates a note input that appears in the track input choosers in Bitwig Studio. This method must be called within the `init()` function of the script. The messages matching the given mask parameter will be fed directly to the application, and are not processed by the script.

**Parameters:**
- name - the name of the note input as it appears in the track input choosers in Bitwig Studio
**Returns:** the object representing the requested note input
**Since:** API version 1

---

### `createAbsoluteCCValueMatcher`

```java
AbsoluteHardwareValueMatcher createAbsoluteCCValueMatcher(int channel, int controlNumber)
```

Creates a matcher that matches the absolute value of a MIDI CC message.

**Since:** API version 10

---

### `createAbsoluteCCValueMatcher`

```java
AbsoluteHardwareValueMatcher createAbsoluteCCValueMatcher(int controlNumber)
```

Creates a matcher that matches the absolute value of a MIDI CC message regardless of its channel.

**Since:** API version 11

---

### `createPolyAftertouchValueMatcher`

```java
AbsoluteHardwareValueMatcher createPolyAftertouchValueMatcher(int channel, int note)
```

Creates a matcher that matches the absolute value of a Poly AT message.

**Since:** API version 10

---

### `createRelativeSignedBitCCValueMatcher`

```java
RelativeHardwareValueMatcher createRelativeSignedBitCCValueMatcher(int channel, int controlNumber, int valueAmountForOneFullRotation)
```

Creates a matcher that matches the relative value of a MIDI CC message encoded using signed bit.

**Parameters:**
- valueAmountForOneFullRotation - The value that would represent one full rotation to the right (should be very similar to the amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of 127 meant it had been rotated to the right by a full rotation then you would pass 127 here. This ensures that RelativeHardwareControls have similar sensitivity to each other and can be mapped and behave in a very similar way to AbsoluteHardwareControls.
**Since:** API version 10

---

### `createRelativeSignedBit2CCValueMatcher`

```java
RelativeHardwareValueMatcher createRelativeSignedBit2CCValueMatcher(int channel, int controlNumber, int valueAmountForOneFullRotation)
```

Creates a matcher that matches the relative value of a MIDI CC message encoded using signed bit 2.

**Parameters:**
- valueAmountForOneFullRotation - The value that would represent one full rotation to the right (should be very similar to the amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of 127 meant it had been rotated to the right by a full rotation then you would pass 127 here. This ensures that RelativeHardwareControls have similar sensitivity to each other and can be mapped and behave in a very similar way to AbsoluteHardwareControls.
**Since:** API version 10

---

### `createRelativeBinOffsetCCValueMatcher`

```java
RelativeHardwareValueMatcher createRelativeBinOffsetCCValueMatcher(int channel, int controlNumber, int valueAmountForOneFullRotation)
```

Creates a matcher that matches the relative value of a MIDI CC message encoded using bin offset.

**Parameters:**
- valueAmountForOneFullRotation - The value that would represent one full rotation to the right (should be very similar to the amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of 127 meant it had been rotated to the right by a full rotation then you would pass 127 here. This ensures that RelativeHardwareControls have similar sensitivity to each other and can be mapped and behave in a very similar way to AbsoluteHardwareControls.
**Since:** API version 10

---

### `createRelative2sComplementCCValueMatcher`

```java
RelativeHardwareValueMatcher createRelative2sComplementCCValueMatcher(int channel, int controlNumber, int valueAmountForOneFullRotation)
```

Creates a matcher that matches the relative value of a MIDI CC message encoded using 2s complement.

**Parameters:**
- valueAmountForOneFullRotation - The value that would represent one full rotation to the right (should be very similar to the amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of 127 meant it had been rotated to the right by a full rotation then you would pass 127 here. This ensures that RelativeHardwareControls have similar sensitivity to each other and can be mapped and behave in a very similar way to AbsoluteHardwareControls.
**Since:** API version 10

---

### `createAbsolutePitchBendValueMatcher`

```java
AbsoluteHardwareValueMatcher createAbsolutePitchBendValueMatcher(int channel)
```

Create a matcher that matches the absolute value of a MIDI pitch bend message.

**Since:** API version 10

---

### `createSequencedValueMatcher`

```java
AbsoluteHardwareValueMatcher createSequencedValueMatcher(AbsoluteHardwareValueMatcher firstValueMatcher, AbsoluteHardwareValueMatcher secondValueMatcher, boolean areMostSignificantBitsInSecondEvent)
```

Creates an absolute value matcher that is defined by 2 separate MIDI events that have to occur in sequence. This can be used to get a much higher precision value that a single MIDI event would allow. Some controllers for example will send 2 CC events for a single value.

**Since:** API version 10

---

### `createAbsoluteValueMatcher`

```java
AbsoluteHardwareValueMatcher createAbsoluteValueMatcher(String eventExpression, String valueExpression, int valueBitCount)
```

Creates a matcher that matches the absolute value of a MIDI CC message by using expressions to filter and extract a value out of the MIDI event.

**Parameters:**
- eventExpression - Expression that must be true in order to extract the value.
**Since:** API version 10

---

### `createRelativeValueMatcher`

```java
RelativeHardwareValueMatcher createRelativeValueMatcher(String eventExpression, double relativeAdjustment)
```

Creates a matcher that applies a relative adjustment when a MIDI event occurs matching an expression.

**Parameters:**
- eventExpression - Expression that must be true in order to extract the value.
**Since:** API version 10

---

### `createRelativeSignedBitValueMatcher`

```java
RelativeHardwareValueMatcher createRelativeSignedBitValueMatcher(String eventExpression, String valueExpression, int valueBitCount, int valueAmountForOneFullRotation)
```

Creates a matcher that matches the relative value (encoded as signed bit) of a MIDI CC message by using expressions to filter and extract a value out of the MIDI event.

**Parameters:**
- eventExpression - Expression that must be true in order to extract the value.
**Since:** API version 10

---

### `createRelativeSignedBitValueMatcher`

```java
RelativeHardwareValueMatcher createRelativeSignedBitValueMatcher(AbsoluteHardwareValueMatcher valueMatcher, int valueAmountForOneFullRotation)
```

Creates a matcher that converts a value matched by an AbsoluteHardwareValueMatcher to a relative value using signed bit.

**Parameters:**
- valueMatcher - Value matcher that matches the value that needs to be converted to a relative value
**Since:** API version 10

---

### `createRelativeSignedBit2ValueMatcher`

```java
RelativeHardwareValueMatcher createRelativeSignedBit2ValueMatcher(String eventExpression, String valueExpression, int valueBitCount, int valueAmountForOneFullRotation)
```

Creates a matcher that matches the relative value (encoded as signed bit 2) of a MIDI CC message by using expressions to filter and extract a value out of the MIDI event.

**Parameters:**
- eventExpression - Expression that must be true in order to extract the value.
**Since:** API version 10

---

### `createRelativeSignedBit2ValueMatcher`

```java
RelativeHardwareValueMatcher createRelativeSignedBit2ValueMatcher(AbsoluteHardwareValueMatcher valueMatcher, int valueAmountForOneFullRotation)
```

Creates a matcher that converts a value matched by an AbsoluteHardwareValueMatcher to a relative value using signed bit 2.

**Parameters:**
- valueAmountForOneFullRotation - The value that would represent one full rotation to the right (should be very similar to the amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of 127 meant it had been rotated to the right by a full rotation then you would pass 127 here. This ensures that RelativeHardwareControls have similar sensitivity to each other and can be mapped and behave in a very similar way to AbsoluteHardwareControls.
**Since:** API version 10

---

### `createRelativeBinOffsetValueMatcher`

```java
RelativeHardwareValueMatcher createRelativeBinOffsetValueMatcher(String eventExpression, String valueExpression, int valueBitCount, int valueAmountForOneFullRotation)
```

Creates a matcher that matches the relative value (encoded as bin offset) of a MIDI CC message by using expressions to filter and extract a value out of the MIDI event.

**Parameters:**
- eventExpression - Expression that must be true in order to extract the value.
**Since:** API version 10

---

### `createRelativeBinOffsetValueMatcher`

```java
RelativeHardwareValueMatcher createRelativeBinOffsetValueMatcher(AbsoluteHardwareValueMatcher valueMatcher, int valueAmountForOneFullRotation)
```

Creates a matcher that converts a value matched by an AbsoluteHardwareValueMatcher to a relative value using bin offset.

**Parameters:**
- valueAmountForOneFullRotation - The value that would represent one full rotation to the right (should be very similar to the amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of 127 meant it had been rotated to the right by a full rotation then you would pass 127 here. This ensures that RelativeHardwareControls have similar sensitivity to each other and can be mapped and behave in a very similar way to AbsoluteHardwareControls.
**Since:** API version 10

---

### `createRelative2sComplementValueMatcher`

```java
RelativeHardwareValueMatcher createRelative2sComplementValueMatcher(String eventExpression, String valueExpression, int valueBitCount, int valueAmountForOneFullRotation)
```

Creates a matcher that matches the relative value (encoded as 2s complement) of a MIDI CC message by using expressions to filter and extract a value out of the MIDI event.

**Parameters:**
- eventExpression - Expression that must be true in order to extract the value.
**Since:** API version 10

---

### `createRelative2sComplementValueMatcher`

```java
RelativeHardwareValueMatcher createRelative2sComplementValueMatcher(AbsoluteHardwareValueMatcher valueMatcher, int valueAmountForOneFullRotation)
```

Creates a matcher that converts a value matched by an AbsoluteHardwareValueMatcher to a relative value using 2s complement.

**Parameters:**
- valueAmountForOneFullRotation - The value that would represent one full rotation to the right (should be very similar to the amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of 127 meant it had been rotated to the right by a full rotation then you would pass 127 here. This ensures that RelativeHardwareControls have similar sensitivity to each other and can be mapped and behave in a very similar way to AbsoluteHardwareControls.
**Since:** API version 10

---

### `createCCActionMatcher`

```java
HardwareActionMatcher createCCActionMatcher(int channel, int controlNumber, int value)
```

Creates a matcher that recognizes an action when getting a MIDI CC event with a specific value.

**Since:** API version 10

---

### `createCCActionMatcher`

```java
HardwareActionMatcher createCCActionMatcher(int channel, int controlNumber)
```

Creates a matcher that recognizes an action when getting a MIDI CC event regardless of the value.

**Since:** API version 10

---

### `createNoteOnActionMatcher`

```java
HardwareActionMatcher createNoteOnActionMatcher(int channel, int note)
```

Creates a matcher that recognizes an action when a MIDI note on event occurs.

**Since:** API version 10

---

### `createNoteOnVelocityValueMatcher`

```java
AbsoluteHardwareValueMatcher createNoteOnVelocityValueMatcher(int channel, int note)
```

Creates a matcher that recognizes a note's on velocity when a MIDI note on event occurs.

**Since:** API version 10

---

### `createNoteOffVelocityValueMatcher`

```java
AbsoluteHardwareValueMatcher createNoteOffVelocityValueMatcher(int channel, int note)
```

Creates a matcher that recognizes a note's off velocity when a MIDI note off event occurs.

**Since:** API version 10

---

### `createNoteOffActionMatcher`

```java
HardwareActionMatcher createNoteOffActionMatcher(int channel, int note)
```

Creates a matcher that recognizes an action when a MIDI note off event occurs.

**Since:** API version 10

---

### `createActionMatcher`

```java
HardwareActionMatcher createActionMatcher(String expression)
```

Creates a matcher that can match an action from a MIDI event. For example, pressing a button based on input of a MIDI CC event.

**Parameters:**
- expression - Expression returns true if the event matches

---

### `hardwareAddress`

```java
String hardwareAddress()
```

**Returns:** The address of the hardware device this port belongs to. If two ports belong to the same physical device, they have the same address.
**Since:** API version 21

---

