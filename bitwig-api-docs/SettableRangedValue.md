# Interface SettableRangedValue

Instances of this interface represent numeric values that have an upper and lower limit.

## Method Details

### `set`

```java
void set(double value)
```

Sets the value in an absolute fashion as a value between 0 .. 1 where 0 represents the minimum value and 1 the maximum. The value may not be set immediately if the user has configured a take over strategy for the controller.

**Parameters:**
- value - absolute value [0 .. 1]
**Since:** API version 2

---

### `setImmediately`

```java
void setImmediately(double value)
```

Sets the value in an absolute fashion as a value between 0 .. 1 where 0 represents the minimum value and 1 the maximum. The value change is applied immediately and does not care about what take over mode the user has selected. This is useful if the value does not need take over (e.g. a motorized slider).

**Parameters:**
- value - absolute value [0 .. 1]
**Since:** API version 4

---

### `set`

```java
void set(Number value, Number resolution)
```

Sets the value in an absolute fashion. The value will be scaled according to the given resolution. Typically the resolution would be specified as the amount of steps the hardware control provides (for example 128) and just pass the integer value as it comes from the MIDI device. The host application will take care of scaling it.

**Parameters:**
- value - integer number in the range [0 .. resolution-1]
**Since:** API version 1

---

### `inc`

```java
void inc(double increment)
```

Increments or decrements the value by a normalized amount assuming the whole range of the value is 0 .. 1. For example to increment by 10% you would use 0.1 as the increment.

**Since:** API version 2

---

### `inc`

```java
void inc(Number increment, Number resolution)
```

Increments or decrements the value according to the given increment and resolution parameters. Typically the resolution would be specified as the amount of steps the hardware control provides (for example 128) and just pass the integer value as it comes from the MIDI device. The host application will take care of scaling it.

**Parameters:**
- increment - the amount that the current value is increased by
**Since:** API version 1

---

### `setRaw`

```java
void setRaw(double value)
```

Set the internal (raw) value.

**Parameters:**
- value - the new value with double precision. Range is undefined.
**Since:** API version 1

---

### `incRaw`

```java
void incRaw(double delta)
```

Increments / decrements the internal (raw) value.

**Parameters:**
- delta - the amount that the current internal value get increased by.
**Since:** API version 1

---

### `addBinding`

```java
default AbsoluteHardwareControlBinding addBinding(AbsoluteHardwareControl hardwareControl)
```

Description copied from interface: AbsoluteHardwarControlBindable

**Returns:** The newly created binding

---

### `addBindingWithRange`

```java
AbsoluteHardwareControlBinding addBindingWithRange(AbsoluteHardwareControl hardwareControl, double minNormalizedValue, double maxNormalizedValue)
```

Description copied from interface: AbsoluteHardwarControlBindable

**Returns:** The newly created binding

---

### `addBinding`

```java
default RelativeHardwareControlToRangedValueBinding addBinding(RelativeHardwareControl hardwareControl)
```

Description copied from interface: RelativeHardwarControlBindable


---

### `addBindingWithRange`

```java
default RelativeHardwareControlBinding addBindingWithRange(RelativeHardwareControl hardwareControl, double minNormalizedValue, double maxNormalizedValue)
```

---

### `addBindingWithRangeAndSensitivity`

```java
RelativeHardwareControlToRangedValueBinding addBindingWithRangeAndSensitivity(RelativeHardwareControl hardwareControl, double minNormalizedValue, double maxNormalizedValue, double sensitivity)
```

---

### `addBindingWithSensitivity`

```java
default RelativeHardwareControlToRangedValueBinding addBindingWithSensitivity(RelativeHardwareControl hardwareControl, double sensitivity)
```

Description copied from interface: RelativeHardwarControlBindable


---

