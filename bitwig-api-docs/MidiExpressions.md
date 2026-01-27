# Interface MidiExpressions

Creates useful MIDI expressions that can be used to match MIDI events.

## Method Details

### `createIsCCExpression`

```java
String createIsCCExpression(int controlNumber)
```

Creates an expression that recognizes a MIDI CC event regardless of its channel.

**Since:** API version 11

---

### `createIsCCExpression`

```java
String createIsCCExpression(int channel, int controlNumber)
```

Creates an expression that recognizes a MIDI CC event.

---

### `createIsCCValueExpression`

```java
String createIsCCValueExpression(int channel, int control, int value)
```

Creates an expression that recognizes a MIDI CC event with a specific value. This expression can be used in invalid reference #createActionMatcher(String) or invalid reference #createAbsoluteValueMatcher(String, String, int) , for example.

**Since:** API version 10

---

### `createIsPitchBendExpression`

```java
String createIsPitchBendExpression(int channel)
```

Creates an expression that recognizes a pitch bend event. This expression can be used in invalid reference #createActionMatcher(String) or invalid reference #createAbsoluteValueMatcher(String, String, int) , for example.

**Since:** API version 10

---

### `createIsNoteOnExpression`

```java
String createIsNoteOnExpression(int channel, int note)
```

Creates an expression that recognizes a note on event. This expression can be used in invalid reference #createActionMatcher(String) or invalid reference #createAbsoluteValueMatcher(String, String, int) , for example.

**Since:** API version 10

---

### `createIsNoteOffExpression`

```java
String createIsNoteOffExpression(int channel, int note)
```

Creates an expression that recognizes a note off event. This expression can be used in invalid reference #createActionMatcher(String) or invalid reference #createAbsoluteValueMatcher(String, String, int) , for example.

**Since:** API version 10

---

### `createIsPolyAftertouch`

```java
String createIsPolyAftertouch(int channel, int note)
```

Creates an expression that recognizes a polyphonic aftertouch event. This expression can be used in invalid reference #createActionMatcher(String) or invalid reference #createAbsoluteValueMatcher(String, String, int) , for example.

**Since:** API version 10

---

