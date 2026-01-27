# Interface SettableBeatTimeValue

Stepper that steps through beat values.

## Method Details

### `setRaw`

```java
@Deprecated default void setRaw(double value)
```

The same as the set method.

---

### `incRaw`

```java
@Deprecated default void incRaw(double amount)
```

The same as the inc method.

---

### `beatStepper`

```java
RelativeHardwarControlBindable beatStepper()
```

Stepper that steps through beat values. This can be used as a target for a RelativeHardwareControl.

**Since:** API version 10

---

