# Interface BooleanHardwareProperty

Represents an output value shown on some hardware (for example, if an LED is on or off).

## Method Details

### `currentValue`

```java
boolean currentValue()
```

Gets the current value. This is the value that should be sent to the hardware to be displayed.

---

### `lastSentValue`

```java
boolean lastSentValue()
```

The value that was last sent to the hardware.

---

### `onUpdateHardware`

```java
void onUpdateHardware(Consumer<Boolean> sendValueConsumer)
```

Specifies a callback that should be called with the value that needs to be sent to the hardware. This callback is called as a result of calling the HardwareSurface.updateHardware() method (typically from the flush method).

---

### `setValue`

```java
void setValue(boolean value)
```

Sets the current value.

---

### `setValueSupplier`

```java
void setValueSupplier(BooleanSupplier supplier)
```

Sets the current value from a BooleanSupplier that supplies the latest value.

---

