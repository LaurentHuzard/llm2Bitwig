# Interface BrowserItem

Instances of this interface represent entries in a browser filter column.

## Method Details

### `addExistsObserver`

```java
@Deprecated void addExistsObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the item exists.

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

### `name`

```java
StringValue name()
```

Value that reports the name of the browser item.

**Since:** API version 2

---

### `addValueObserver`

```java
@Deprecated void addValueObserver(int maxCharacters, String textWhenUnassigned, StringValueChangedCallback callback)
```

Registers an observer that reports the string value of the browser item.

**Parameters:**
- maxCharacters -
**Since:** API version 1

---

### `isSelected`

```java
SettableBooleanValue isSelected()
```

Returns an object that provides access to the selected state of the browser item.

**Returns:** an boolean value object
**Since:** API version 1

---

