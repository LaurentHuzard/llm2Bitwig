# Interface TimeSignatureValue

Instances of this interface represent time signature values.

## Method Details

### `get`

```java
String get()
```

Gets the current value.

**Since:** API version 2

---

### `set`

```java
void set(String name)
```

Updates the time signature according to the given string.

**Parameters:**
- name - a textual representation of the new time signature value, formatted as `numerator/denominator[, ticks]`
**Since:** API version 1

---

### `getNumerator`

```java
@Deprecated SettableIntegerValue getNumerator()
```

Returns an object that provides access to the time signature numerator.

**Returns:** an integer value object that represents the time signature numerator.
**Since:** API version 1

---

### `numerator`

```java
SettableIntegerValue numerator()
```

Returns an object that provides access to the time signature numerator.

**Returns:** an integer value object that represents the time signature numerator.
**Since:** API version 5

---

### `getDenominator`

```java
@Deprecated SettableIntegerValue getDenominator()
```

Returns an object that provides access to the time signature denominator.

**Returns:** an integer value object that represents the time signature denominator.
**Since:** API version 1

---

### `denominator`

```java
SettableIntegerValue denominator()
```

Returns an object that provides access to the time signature denominator.

**Returns:** an integer value object that represents the time signature denominator.
**Since:** API version 5

---

### `getTicks`

```java
@Deprecated SettableIntegerValue getTicks()
```

Returns an object that provides access to the time signature tick subdivisions.

**Returns:** an integer value object that represents the time signature ticks.
**Since:** API version 1

---

### `ticks`

```java
SettableIntegerValue ticks()
```

Returns an object that provides access to the time signature tick subdivisions.

**Returns:** an integer value object that represents the time signature ticks.
**Since:** API version 5

---

