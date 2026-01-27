# Interface HardwareButton

Represents a physical hardware button on a controller

## Method Details

### `pressedAction`

```java
HardwareAction pressedAction()
```

Action that happens when the user presses the button.

---

### `releasedAction`

```java
HardwareAction releasedAction()
```

Action that happens when the user releases the button.

---

### `isPressed`

```java
BooleanValue isPressed()
```

Button state

---

### `setAftertouchControl`

```java
void setAftertouchControl(AbsoluteHardwareControl control)
```

Sets the optional control that represents the aftertouch value for this button.

---

### `setRoundedCornerRadius`

```java
void setRoundedCornerRadius(double radiusInMM)
```

An indication of how rounded the corners of this button should be.

---

