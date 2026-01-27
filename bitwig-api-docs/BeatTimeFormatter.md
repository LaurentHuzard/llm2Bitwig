# Interface BeatTimeFormatter

Defines a formatter for a beat time that can convert a beat time to a string for display to the user.

## Method Details

### `formatBeatTime`

```java
String formatBeatTime(double beatTime, boolean isAbsolute, int timeSignatureNumerator, int timeSignatureDenominator, int timeSignatureTicks)
```

Formats the supplied beat time as a string in the supplied time signature.

**Parameters:**
- beatTime - The beat time to be formatted
**Since:** API version 2

---

