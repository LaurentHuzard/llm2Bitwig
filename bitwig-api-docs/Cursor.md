# Interface Cursor

A generic interface that provides the foundation for working with selections. Implementations of this interface can either represent custom selection cursors that are created by controller scripts, or represent the cursor of user selections as shown in Bitwig Studio editors, such as the Arranger track selection cursor, the note editor event selection cursor and so on.

## Method Details

### `selectPrevious`

```java
void selectPrevious()
```

Select the previous item.

**Since:** API version 1

---

### `selectPreviousAction`

```java
HardwareActionBindable selectPreviousAction()
```

---

### `selectNext`

```java
void selectNext()
```

Select the next item.

**Since:** API version 1

---

### `selectNextAction`

```java
HardwareActionBindable selectNextAction()
```

---

### `selectFirst`

```java
void selectFirst()
```

Select the first item.

**Since:** API version 1

---

### `selectLast`

```java
void selectLast()
```

Select the last item.

**Since:** API version 1

---

### `hasNext`

```java
BooleanValue hasNext()
```

Boolean value that reports whether there is an item after the current cursor position.

**Since:** API version 2

---

### `hasPrevious`

```java
BooleanValue hasPrevious()
```

Boolean value that reports whether there is an item before the current cursor position.

**Since:** API version 2

---

### `addCanSelectPreviousObserver`

```java
@Deprecated void addCanSelectPreviousObserver(BooleanValueChangedCallback callback)
```

Registers a function with bool argument that gets called when the previous item gains or remains selectable.

**Since:** API version 1

---

### `addCanSelectNextObserver`

```java
@Deprecated void addCanSelectNextObserver(BooleanValueChangedCallback callback)
```

Registers a function with bool argument that gets called when the next item gains or remains selectable.

**Since:** API version 1

---

