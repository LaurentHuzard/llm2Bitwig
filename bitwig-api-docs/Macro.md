# Interface Macro

Instances of this interface are used to represent macro controls in Bitwig Studio to controllers.

## Method Details

### `getAmount`

```java
Parameter getAmount()
```

Returns an object that provides access to the control value of the macro.

**Returns:** a ranged value object.
**Since:** API version 1

---

### `getModulationSource`

```java
ModulationSource getModulationSource()
```

Returns an object that provides access to the modulation source of the macro.

**Returns:** a modulation source object.
**Since:** API version 1

---

### `addLabelObserver`

```java
void addLabelObserver(int numChars, String textWhenUnassigned, StringValueChangedCallback callback)
```

Registers an observer that reports the label of the macro control.

**Parameters:**
- numChars - the maximum number of characters of the reported label

---

