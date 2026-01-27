# Interface StringHardwareProperty

Represents an output value shown on some hardware (for example, the title of a track).

## Method Details

### `currentValue`

```java
String currentValue()
```

Gets the current value. This is the value that should be sent to the hardware to be displayed.

---

### `lastSentValue`

```java
String lastSentValue()
```

The value that was last sent to the hardware.

---

### `onUpdateHardware`

```java
void onUpdateHardware(Consumer<String> sendValueConsumer)
```

Specifies a callback that should be called with the value that needs to be sent to the hardware. This callback is called as a result of calling the HardwareSurface.updateHardware() method (typically from the flush method).

---

### `setValue`

```java
void setValue(String value)
```

Sets the current value.

---

### `setValueSupplier`

```java
void setValueSupplier(Supplier<String> supplier)
```

Sets the current value from a Supplier that supplies the latest value.

---

### `getMaxChars`

```java
int getMaxChars()
```

The maximum number of characters that can be output or -1 if not specified and there is no limit.

---

### `setMaxChars`

```java
void setMaxChars(int maxChars)
```

---

