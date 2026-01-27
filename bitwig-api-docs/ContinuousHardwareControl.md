# Interface ContinuousHardwareControl<HardwareBindingType extends HardwareBinding>

Represents a hardware control that can input a relative or absolute value (for example, a slider, knob, relative encoder...).

## Method Details

### `hardwareButton`

```java
HardwareButton hardwareButton()
```

An optional button that can be associated with this control when this control can also act as a button (e.g by pressing down on it).

---

### `setHardwareButton`

```java
void setHardwareButton(HardwareButton button)
```

Sets an optional button that can be associated with this control when this control can also act as a button (e.g by pressing down on it).

---

### `targetName`

```java
StringValue targetName()
```

The name of the target that this hardware control has been bound to.

**Since:** API version 11

---

### `targetValue`

```java
DoubleValue targetValue()
```

The value of the target that this hardware control has been bound to (0..1).

---

### `targetDisplayedValue`

```java
StringValue targetDisplayedValue()
```

Value that represents a formatted text representation of the target value whenever the value changes.

**Since:** API version 11

---

### `modulatedTargetValue`

```java
DoubleValue modulatedTargetValue()
```

The value of the target that this hardware control has been bound to (0..1).

**Since:** API version 11

---

### `modulatedTargetDisplayedValue`

```java
StringValue modulatedTargetDisplayedValue()
```

Value that represents a formatted text representation of the target's modulated value whenever the value changes.

**Since:** API version 11

---

### `isUpdatingTargetValue`

```java
BooleanValue isUpdatingTargetValue()
```

Can be called from the targetValue() changed callback to check if this control is responsible for changing the target value or not.

---

### `hasTargetValue`

```java
BooleanValue hasTargetValue()
```

Value that indicates if this hardware control has a target value that it changes or not.

---

