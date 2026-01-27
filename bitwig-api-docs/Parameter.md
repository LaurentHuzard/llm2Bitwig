# Interface Parameter

Instances of this interface represent ranged parameters that can be controlled with automation in Bitwig Studio.

## Method Details

### `value`

```java
SettableRangedValue value()
```

Gets the current value of this parameter.

**Since:** API version 2

---

### `modulatedValue`

```java
RangedValue modulatedValue()
```

Gets the modulated value of this parameter.

**Since:** API version 2

---

### `name`

```java
StringValue name()
```

The name of the parameter.

**Since:** API version 2

---

### `addNameObserver`

```java
@Deprecated void addNameObserver(int maxChars, String textWhenUnassigned, StringValueChangedCallback callback)
```

Adds an observer which reports changes to the name of the automated parameter. The callback will get called at least once immediately after calling this method for reporting the current name.

**Parameters:**
- maxChars - maximum length of the string sent to the observer
**Since:** API version 1

---

### `addValueDisplayObserver`

```java
@Deprecated void addValueDisplayObserver(int maxChars, String textWhenUnassigned, StringValueChangedCallback callback)
```

Adds an observer which sends a formatted text representation of the value whenever the value changes. The callback will get called at least once immediately after calling this method for reporting the current state.

**Parameters:**
- maxChars - maximum length of the string sent to the observer
**Since:** API version 1

---

### `reset`

```java
void reset()
```

Resets the value to its default.

**Since:** API version 1

---

### `touch`

```java
void touch(boolean isBeingTouched)
```

Touch (or un-touch) the value for automation recording.

**Parameters:**
- isBeingTouched - `true` for touching, `false` for un-touching
**Since:** API version 1

---

### `setIndication`

```java
void setIndication(boolean shouldIndicate)
```

Specifies if this value should be indicated as mapped in Bitwig Studio, which is visually shown as colored dots or tinting on the parameter controls.

**Parameters:**
- shouldIndicate - `true` in case visual indications should be shown in Bitwig Studio, `false` otherwise
**Since:** API version 1

---

### `setLabel`

```java
void setLabel(String label)
```

Specifies a label for the mapped hardware parameter as shown in Bitwig Studio, for example in menu items for learning controls.

**Parameters:**
- label - the label to be shown in Bitwig Studio
**Since:** API version 1

---

### `restoreAutomationControl`

```java
void restoreAutomationControl()
```

Restores control of this parameter to automation playback.

**Since:** API version 1

---

### `hasAutomation`

```java
BooleanValue hasAutomation()
```

Boolean value that is true if the parameter has automation data.

**Since:** API version 19

---

### `deleteAllAutomation`

```java
void deleteAllAutomation()
```

Deletes all automation for this parameter.

**Since:** API version 19

---

