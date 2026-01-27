# Interface ParameterBank

Defines a bank of parameters.

## Method Details

### `getParameterCount`

```java
int getParameterCount()
```

Gets the number of slots that these remote controls have.

**Since:** API version 2

---

### `getParameter`

```java
Parameter getParameter(int indexInBank)
```

Returns the parameter at the given index within the bank.

**Parameters:**
- indexInBank - the parameter index within this bank. Must be in the range [0..getParameterCount()-1].
**Returns:** the requested parameter
**Since:** API version 2

---

### `setHardwareLayout`

```java
void setHardwareLayout(HardwareControlType type, int columns)
```

Informs the application how to display the controls during the on screen notification.

**Parameters:**
- type - which kind of hardware control is used for this bank (knobs/encoders/sliders)
**Since:** API version 7

---

