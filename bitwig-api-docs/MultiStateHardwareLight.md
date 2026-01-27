# Interface MultiStateHardwareLight

Represents a physical hardware light on a controller. The light has an on/off state and may also be optionally colored.

## Method Details

### `state`

```java
ObjectHardwareProperty<InternalHardwareLightState> state()
```

Object that represents the current state of this light. The interpretation of this value is entirely up to the implementation.

---

### `setColorToStateFunction`

```java
void setColorToStateFunction(Function<Color, InternalHardwareLightState> function)
```

Sets a function that can be used to convert a color to the closest possible state representing that color. Once this function has been provided it is possible to then use the convenient setColor(Color) and setColorSupplier(Supplier) methods.

---

### `setColor`

```java
void setColor(Color color)
```

Tries to set this light's state to be the best state to represent the supplied Color. For this to be used you must first call invalid reference #setColorToStateFunction(IntFunction) .

---

### `setColorSupplier`

```java
void setColorSupplier(Supplier<Color> colorSupplier)
```

Tries to set this light's state to be the best state to represent the value supplied by the Supplier. For this to be used you must first call invalid reference #setColorToStateFunction(IntFunction) .

---

### `getBestLightStateForColor`

```java
InternalHardwareLightState getBestLightStateForColor(Color color)
```

Determines the best light state for the supplied color. For this to be used you must first call invalid reference #setColorToStateFunction(IntFunction) .

---

