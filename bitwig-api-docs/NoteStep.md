# Interface NoteStep

Object that describes the content of a step at a given position: x for the time, and y for the key.

## Method Details

### `x`

```java
int x()
```

**Returns:** the position of the step (time)
**Since:** API version 10

---

### `y`

```java
int y()
```

**Returns:** the position of the step (key)
**Since:** API version 10

---

### `channel`

```java
int channel()
```

**Returns:** the note's channel, in the range 0..15.
**Since:** API version 10

---

### `state`

```java
NoteStep.State state()
```

**Returns:** the state of the step, it lets you know if a note starts.
**Since:** API version 10

---

### `velocity`

```java
double velocity()
```

**Returns:** the velocity of the step, in the range 0..1
**Since:** API version 10

---

### `setVelocity`

```java
void setVelocity(double velocity)
```

If there is a note started at this position, it will update the velocity of the note.

**Parameters:**
- velocity - between 0 and 1
**Since:** API version 10

---

### `releaseVelocity`

```java
double releaseVelocity()
```

**Returns:** the release velocity of the step, in the range 0..1
**Since:** API version 10

---

### `setReleaseVelocity`

```java
void setReleaseVelocity(double velocity)
```

If there is a note started at this position, it will update the release velocity of the note.

**Parameters:**
- velocity - between 0 and 1
**Since:** API version 10

---

### `velocitySpread`

```java
double velocitySpread()
```

**Since:** API version 14

---

### `setVelocitySpread`

```java
void setVelocitySpread(double amount)
```

**Parameters:**
- amount - velocity spread amount in the range 0..1
**Since:** API version 14

---

### `duration`

```java
double duration()
```

**Returns:** the duration of the step in beats
**Since:** API version 10

---

### `setDuration`

```java
void setDuration(double duration)
```

If there is a note started at this position, it will update the duration of the note.

**Parameters:**
- duration - in beats
**Since:** API version 10

---

### `pan`

```java
double pan()
```

**Returns:** the pan of the step in the range -1..1
**Since:** API version 10

---

### `setPan`

```java
void setPan(double pan)
```

If there is a note started at this position, it will update the panning of the note.

**Parameters:**
- pan - -1 for left, +1 for right
**Since:** API version 10

---

### `timbre`

```java
double timbre()
```

**Returns:** the timbre of the step, in the range -1..1
**Since:** API version 10

---

### `setTimbre`

```java
void setTimbre(double timbre)
```

If there is a note started at this position, it will update the timbre of the note.

**Parameters:**
- timbre - from -1 to +1
**Since:** API version 10

---

### `pressure`

```java
double pressure()
```

**Returns:** the pressure of the step, in the range 0..1
**Since:** API version 10

---

### `setPressure`

```java
void setPressure(double pressure)
```

If there is a note started at this position, it will update the pressure of the note.

**Parameters:**
- pressure - from 0 to +1
**Since:** API version 10

---

### `gain`

```java
double gain()
```

**Returns:** the gain of the step, in the range 0..1
**Since:** API version 10

---

### `setGain`

```java
void setGain(double gain)
```

If there is a note started at this position, it will update the gain of the note.

**Parameters:**
- gain - in the range 0..1, a value of 0.5 results in a gain of 0dB.
**Since:** API version 10

---

### `transpose`

```java
double transpose()
```

**Returns:** the transpose of the step, in semitones
**Since:** API version 10

---

### `setTranspose`

```java
void setTranspose(double transpose)
```

If there is a note started at this position, it will update the pitch offset of the note.

**Parameters:**
- transpose - in semitones, from -96 to +96
**Since:** API version 10

---

### `isIsSelected`

```java
boolean isIsSelected()
```

**Returns:** true if a note exists and is selected
**Since:** API version 10

---

### `chance`

```java
double chance()
```

Gets the note chance.

**Returns:** the probability, 0..1
**Since:** API version 14

---

### `setChance`

```java
void setChance(double chance)
```

Sets the note chance.

**Parameters:**
- chance - 0..1
**Since:** API version 14

---

### `isChanceEnabled`

```java
boolean isChanceEnabled()
```

**Since:** API version 14

---

### `setIsChanceEnabled`

```java
void setIsChanceEnabled(boolean isEnabled)
```

**Since:** API version 14

---

### `isOccurrenceEnabled`

```java
boolean isOccurrenceEnabled()
```

**Since:** API version 14

---

### `setIsOccurrenceEnabled`

```java
void setIsOccurrenceEnabled(boolean isEnabled)
```

**Since:** API version 14

---

### `occurrence`

```java
NoteOccurrence occurrence()
```

**Since:** API version 14

---

### `setOccurrence`

```java
void setOccurrence(NoteOccurrence condition)
```

**Since:** API version 14

---

### `isRecurrenceEnabled`

```java
boolean isRecurrenceEnabled()
```

**Since:** API version 14

---

### `setIsRecurrenceEnabled`

```java
void setIsRecurrenceEnabled(boolean isEnabled)
```

**Since:** API version 14

---

### `recurrenceLength`

```java
int recurrenceLength()
```

**Since:** API version 14

---

### `recurrenceMask`

```java
int recurrenceMask()
```

**Since:** API version 14

---

### `setRecurrence`

```java
void setRecurrence(int length, int mask)
```

**Parameters:**
- length - from 1 to 8
**Since:** API version 14

---

### `isRepeatEnabled`

```java
boolean isRepeatEnabled()
```

**Since:** API version 14

---

### `setIsRepeatEnabled`

```java
void setIsRepeatEnabled(boolean isEnabled)
```

**Since:** API version 14

---

### `repeatCount`

```java
int repeatCount()
```

**Since:** API version 14

---

### `setRepeatCount`

```java
void setRepeatCount(int count)
```

**Parameters:**
- count - -127..127, positive values indicates a number of divisions, negative values a rate.
**Since:** API version 14

---

### `repeatCurve`

```java
double repeatCurve()
```

**Since:** API version 14

---

### `setRepeatCurve`

```java
void setRepeatCurve(double curve)
```

**Parameters:**
- curve - -1..1
**Since:** API version 14

---

### `repeatVelocityEnd`

```java
double repeatVelocityEnd()
```

**Since:** API version 14

---

### `setRepeatVelocityEnd`

```java
void setRepeatVelocityEnd(double velocityEnd)
```

**Parameters:**
- velocityEnd - -1..1, relative velocity amount applied to the note on velocity.
**Since:** API version 14

---

### `repeatVelocityCurve`

```java
double repeatVelocityCurve()
```

**Since:** API version 14

---

### `setRepeatVelocityCurve`

```java
void setRepeatVelocityCurve(double curve)
```

**Parameters:**
- curve - -1..1
**Since:** API version 14

---

### `isMuted`

```java
boolean isMuted()
```

**Returns:** true if the note is muted
**Since:** API version 14

---

### `setIsMuted`

```java
void setIsMuted(boolean value)
```

Mutes the note if values is true.

**Since:** API version 14

---

