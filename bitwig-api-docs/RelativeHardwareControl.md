# Interface RelativeHardwareControl

Represents a hardware control that can input a relative value (for example, a relative encoder knob). A relative adjustment is positive value when being increased and a negative when being decreased. The relative amount represents the amount of adjustment made. In order to have relative hardware controls work with the same level of sensitivity the relative amount should be +1.0 if the user were to rotate a knob one full rotation (defined as roughly the same amount of rotation as that of an absolute knob to go from 0 to 1) to the right. RelativeHardwareControls can also be used to step through items (e.g in a list, or an enum parameter). In this case the getStepSize() is used to determine how far the knob has to be rotated in order to increment by one step. For example, if a full rotation of a knob should step through 10 items you would set the step size to 1.0 / 10 (i.e 0.1).

## Method Details

### `setSensitivity`

```java
void setSensitivity(double sensitivity)
```

Sets the sensitivity of this hardware control. The default sensitivity is 1. This value is a multiplied with the adjustment coming from the RelativeHardwareValueMatcher to determine the final adjustment amount.

---

### `setAdjustValueMatcher`

```java
void setAdjustValueMatcher(RelativeHardwareValueMatcher matcher)
```

Sets the RelativeHardwareValueMatcher that can be used to detect when the user adjusts the hardware control's value.


---

### `addBindingWithSensitivity`

```java
RelativeHardwareControlBinding addBindingWithSensitivity(RelativeHardwarControlBindable target, double sensitivity)
```

Adds a binding to the supplied target with the supplied sensitivity.

---

### `setBindingWithSensitivity`

```java
RelativeHardwareControlBinding setBindingWithSensitivity(RelativeHardwarControlBindable target, double sensitivity)
```

Makes sure there is a single binding to the supplied target with the supplied sensitivity.

---

### `addBindingWithRange`

```java
RelativeHardwareControlBinding addBindingWithRange(SettableRangedValue target, double minNormalizedValue, double maxNormalizedValue)
```

Adds a binding to the supplied target that does not adjust the target outside of the supplied min and max normalized range.

---

### `setBindingWithRange`

```java
RelativeHardwareControlBinding setBindingWithRange(SettableRangedValue target, double minNormalizedValue, double maxNormalizedValue)
```

Makes sure there is single binding to the supplied target that does not adjust the target outside of the supplied min and max normalized range.

---

### `addBindingWithRangeAndSensitivity`

```java
RelativeHardwareControlBinding addBindingWithRangeAndSensitivity(SettableRangedValue target, double minNormalizedValue, double maxNormalizedValue, double sensitivity)
```

Adds a binding to the supplied target that does not adjust the target outside of the supplied min and max normalized range and is adjusted with the supplied sensitivity.

---

### `setBindingWithRangeAndSensitivity`

```java
RelativeHardwareControlBinding setBindingWithRangeAndSensitivity(SettableRangedValue target, double minNormalizedValue, double maxNormalizedValue, double sensitivity)
```

Makes sure there is a single binding to the supplied target that does not adjust the target outside of the supplied min and max normalized range and is adjusted with the supplied sensitivity.

---

### `getStepSize`

```java
double getStepSize()
```

The current steps size (amount of relative rotation) necessary to step through an item in a list.

---

### `setStepSize`

```java
void setStepSize(double stepSize)
```

Sets the step size of this relative hardware control. The step size is used when using this control to step through items in a list, or values in an enum parameter, for example. For each step forwards a certain action can be invoked and for each step backwards a different action.

---

