# Interface SettableBooleanValue

Instances of this interface represent boolean values.

## Method Details

### `set`

```java
void set(boolean value)
```

Sets the internal value.

**Parameters:**
- value - the new boolean value.
**Since:** API version 1

---

### `toggle`

```java
void toggle()
```

Toggles the current state. In case the current value is `false`, the new value will be `true` and the other way round.

**Since:** API version 1

---

### `toggleAction`

```java
HardwareActionBindable toggleAction()
```

---

### `setToTrueAction`

```java
HardwareActionBindable setToTrueAction()
```

---

### `setToFalseAction`

```java
HardwareActionBindable setToFalseAction()
```

---

