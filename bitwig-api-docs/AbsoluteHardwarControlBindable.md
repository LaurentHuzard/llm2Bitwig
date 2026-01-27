# Interface AbsoluteHardwarControlBindable

Something that can be bound to an AbsoluteHardwareControl and can respond to the user input (such as user moving a slider up or down) in a meaningful way.

## Method Details

### `addBinding`

```java
default AbsoluteHardwareControlBinding addBinding(AbsoluteHardwareControl hardwareControl)
```

Binds this target to the supplied hardware control so that when the user moves the hardware control this target will respond in a meaningful way. When the binding is no longer needed the HardwareBinding.removeBinding() method can be called on it.

**Returns:** The newly created binding

---

### `addBindingWithRange`

```java
AbsoluteHardwareControlBinding addBindingWithRange(AbsoluteHardwareControl hardwareControl, double minNormalizedValue, double maxNormalizedValue)
```

Binds this target to the supplied hardware control so that when the user moves the hardware control this target will respond in a meaningful way. This target will be adjusted within the supplied normalized range. When the binding is no longer needed the HardwareBinding.removeBinding() method can be called on it.

**Returns:** The newly created binding

---

