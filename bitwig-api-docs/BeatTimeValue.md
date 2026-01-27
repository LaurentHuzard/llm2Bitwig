# Interface BeatTimeValue

Instances of this interface represent beat time values. Beat time values are double-precision number representing the number of quarter notes, regardless of time-signature.

## Method Details

### `addRawValueObserver`

```java
@Deprecated void addRawValueObserver(DoubleValueChangedCallback callback)
```

Add an observer which receives the internal raw of the parameter as floating point.

**Parameters:**
- callback - a callback function that receives a single numeric parameter with double precision.
**Since:** API version 1

---

### `getFormatted`

```java
String getFormatted(BeatTimeFormatter formatter)
```

Gets the current beat time formatted according to the supplied formatter.

**Since:** API version 2

---

### `getFormatted`

```java
String getFormatted()
```

Gets the current beat time formatted according to the default beat time formatter.

**Since:** API version 2

---

### `addTimeObserver`

```java
@Deprecated void addTimeObserver(String separator, int barsLen, int beatsLen, int subdivisionLen, int ticksLen, StringValueChangedCallback callback)
```

Registers an observer that reports the internal beat time value as formatted text, for example "012:03:00:01".

**Parameters:**
- separator - the character used to separate the segments of the formatted beat time, typically ":", "." or "-"
**Since:** API version 1

---

