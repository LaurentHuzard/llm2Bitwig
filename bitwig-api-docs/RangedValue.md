# Interface RangedValue

Instances of this interface represent numeric values that have an upper and lower limit.

## Method Details

### `get`

```java
double get()
```

The current value normalized between 0..1 where 0 represents the minimum value and 1 the maximum.

**Since:** API version 2

---

### `getRaw`

```java
double getRaw()
```

Gets the current value.

**Since:** API version 2

---

### `getAsDouble`

```java
default double getAsDouble()
```


---

### `getOrigin`

```java
DoubleValue getOrigin()
```

The normalized origin of this value. For example, the origin for a pan value is 0.5 (representing center), but the origin for a level value is 0.

**Since:** API version 20

---

### `discreteValueCount`

```java
IntegerValue discreteValueCount()
```

The number of discrete steps available in the range, or -1 for continuous value ranges.

**Since:** API version 20

---

### `discreteValueNames`

```java
StringArrayValue discreteValueNames()
```

Gets the name for @param index with the index between 0 and discreteValueCount() - 1. WARNING: the returned value may have fewer entries than the discreteValueCount.

**Since:** API version 23

---

### `displayedValue`

```java
StringValue displayedValue()
```

Value that represents a formatted text representation of the value whenever the value changes.

**Since:** API version 2

---

### `addValueObserver`

```java
void addValueObserver(int range, IntegerValueChangedCallback callback)
```

Adds an observer which receives the normalized value of the parameter as an integer number within the range [0..range-1].

**Parameters:**
- range - the range used to scale the value when reported to the callback
**Since:** API version 1

---

### `addRawValueObserver`

```java
void addRawValueObserver(DoubleValueChangedCallback callback)
```

Add an observer which receives the internal raw of the parameter as floating point.

**Parameters:**
- callback - a callback function that receives a single numeric parameter with double precision.
**Since:** API version 1

---

