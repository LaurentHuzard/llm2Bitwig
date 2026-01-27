# Interface ModulationSource

This interface represents a modulation source in Bitwig Studio.

## Method Details

### `isMapping`

```java
BooleanValue isMapping()
```

Value which reports when the modulation source is in mapping mode.

**Since:** API version 2

---

### `addIsMappingObserver`

```java
@Deprecated void addIsMappingObserver(BooleanValueChangedCallback callback)
```

Registers an observer which reports when the modulation source is in mapping mode.

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

### `toggleIsMapping`

```java
void toggleIsMapping()
```

Toggles the modulation source between mapping mode and normal control functionality.

**Since:** API version 1

---

### `name`

```java
StringValue name()
```

Value the reports the name of the modulation source.

**Since:** API version 2

---

### `addNameObserver`

```java
@Deprecated void addNameObserver(int numChars, String textWhenUnassigned, StringValueChangedCallback callback)
```

Registers an observer the reports the name of the modulation source.

**Parameters:**
- numChars - the maximum number of character the reported name should be long
**Since:** API version 1

---

### `isMapped`

```java
BooleanValue isMapped()
```

Value which reports if the modulation source is mapped to any destination(s).

**Since:** API version 2

---

### `addIsMappedObserver`

```java
@Deprecated void addIsMappedObserver(BooleanValueChangedCallback callback)
```

Registers an observer which reports if the modulation source is mapped to any destination(s).

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

