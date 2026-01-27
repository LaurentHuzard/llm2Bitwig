# Interface ColorHardwareProperty

Represents an output value shown on some hardware (for example, the color of a light).

## Method Details

### `currentValue`

```java
Color currentValue()
```

Gets the current value. This is the value that should be sent to the hardware to be displayed.

---

### `lastSentValue`

```java
Color lastSentValue()
```

The value that was last sent to the hardware.

---

### `onUpdateHardware`

```java
void onUpdateHardware(Consumer<Color> sendValueConsumer)
```

Specifies a callback that should be called with the value that needs to be sent to the hardware. This callback is called as a result of calling the HardwareSurface.updateHardware() method (typically from the flush method).

---

### `setValue`

```java
void setValue(Color value)
```

Sets the current value.

---

### `setValueSupplier`

```java
void setValueSupplier(Supplier<Color> supplier)
```

Sets the current value from a Supplier that supplies the latest value.

---

