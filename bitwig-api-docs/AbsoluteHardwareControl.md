# Interface AbsoluteHardwareControl

Represents a hardware control that can input and absolute value (for example, a slider, knob or foot pedal).

## Method Details

### `setAdjustValueMatcher`

```java
void setAdjustValueMatcher(AbsoluteHardwareValueMatcher matcher)
```

Sets the AbsoluteHardwareValueMatcher that can be used to detect when the user adjusts the hardware control's value.


---

### `value`

```java
DoubleValue value()
```

The current value of this hardware control (0..1)

---

### `disableTakeOver`

```java
void disableTakeOver()
```

Determines if this hardware control should immediately take over the parameter it is bound to rather than respecting the user's current take over mode. This is useful for motorized sliders for example, where the slider is already at the value of the bound parameter.

---

### `addBindingWithRange`

```java
AbsoluteHardwareControlBinding addBindingWithRange(AbsoluteHardwarControlBindable target, double minNormalizedValue, double maxNormalizedValue)
```

Adds a new binding from this hardware control to the supplied target.

---

### `setBindingWithRange`

```java
AbsoluteHardwareControlBinding setBindingWithRange(AbsoluteHardwarControlBindable target, double minNormalizedValue, double maxNormalizedValue)
```

Convenience methods that ensures there is only a single binding to the supplied target. This is equivalent to calling HardwareBindingSource.clearBindings() and then addBindingWithRange(AbsoluteHardwarControlBindable, double, double)

---

