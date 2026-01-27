# Interface RelativeHardwarControlBindable

Something that can be bound to an RelativeHardwareControl and can respond to the user input (such as user turning an encoder left or right) in a meaningful way.

## Method Details

### `addBinding`

```java
default RelativeHardwareControlBinding addBinding(RelativeHardwareControl hardwareControl)
```

Binds this target to the supplied hardware control so that when the user moves the hardware control this target will respond in a meaningful way. When the binding is no longer needed the HardwareBinding.removeBinding() method can be called on it.

---

### `addBindingWithSensitivity`

```java
RelativeHardwareControlBinding addBindingWithSensitivity(RelativeHardwareControl hardwareControl, double sensitivity)
```

Binds this target to the supplied hardware control so that when the user moves the hardware control this target will respond in a meaningful way. When the binding is no longer needed the HardwareBinding.removeBinding() method can be called on it.

---

