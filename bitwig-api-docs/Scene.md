# Interface Scene

Instances of this interface represent scenes in Bitwig Studio.

## Method Details

### `getName`

```java
@Deprecated SettableStringValue getName()
```

Returns an object that provides access to the name of the scene.

**Returns:** a string value object that represents the scene name.
**Since:** API version 1

---

### `name`

```java
SettableStringValue name()
```

Returns an object that provides access to the name of the scene.

**Returns:** a string value object that represents the scene name.
**Since:** API version 2

---

### `clipCount`

```java
IntegerValue clipCount()
```

Value that reports the number of clips in the scene.

**Since:** API version 2

---

### `addClipCountObserver`

```java
@Deprecated void addClipCountObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the number of clips in the scene.

**Parameters:**
- callback - a callback function that receives a single integer parameter
**Since:** API version 1

---

### `addPositionObserver`

```java
@Deprecated void addPositionObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the position of the scene within the list of Bitwig Studio scenes.

**Parameters:**
- callback - a callback function that receives a single integer parameter
**Since:** API version 1

---

### `addIsSelectedInEditorObserver`

```java
void addIsSelectedInEditorObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the scene is selected in Bitwig Studio.

**Parameters:**
- callback - a callback function that takes a single boolean parameter.
**Since:** API version 1

---

### `selectInEditor`

```java
void selectInEditor()
```

Selects the scene in Bitwig Studio.

**Since:** API version 1

---

### `showInEditor`

```java
void showInEditor()
```

Makes the scene visible in the Bitwig Studio user interface.

**Since:** API version 1

---

