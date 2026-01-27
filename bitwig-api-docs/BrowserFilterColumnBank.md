# Interface BrowserFilterColumnBank

Instances of this interface are used to navigate the columns of a Bitwig Studio browser session.

## Method Details

### `getSize`

```java
int getSize()
```

Returns the window size that was used to configure the filter column during creation.

**Returns:** the size of the filter column.

---

### `getItem`

```java
BrowserFilterColumn getItem(int index)
```

Returns the filter column for the given index.

**Parameters:**
- index - the item index, must be in the range `[0..getSize-1]`
**Returns:** the requested filter column object

---

### `scrollUp`

```java
void scrollUp()
```

Scrolls the filter columns one item up.

**Since:** API version 1

---

### `scrollDown`

```java
void scrollDown()
```

Scrolls the filter columns one item down.

**Since:** API version 1

---

### `scrollPageUp`

```java
void scrollPageUp()
```

Scrolls the filter columns one page up. For example if the bank is configured with a window size of 8 entries and is currently showing items [1..8], calling this method would scroll the window to show columns [9..16].

**Since:** API version 1

---

### `scrollPageDown`

```java
void scrollPageDown()
```

Scrolls the filter columns one page up. For example if the bank is configured with a window size of 8 entries and is currently showing items [9..16], calling this method would scroll the window to show columns [1..8].

**Since:** API version 1

---

### `addScrollPositionObserver`

```java
void addScrollPositionObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the current scroll position, more specifically the position of the first item within the underlying list of columns, that is shown as the first column within the window.

**Parameters:**
- callback - a callback function that receives a single integer number parameter. The parameter reflects the scroll position, or `-1` in case the column has no content.
**Since:** API version 1

---

### `addCanScrollUpObserver`

```java
void addCanScrollUpObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the columns can be scrolled further up.

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

### `addCanScrollDownObserver`

```java
void addCanScrollDownObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the columns can be scrolled further down.

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

### `addEntryCountObserver`

```java
void addEntryCountObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the underlying total count of columns (not the size of the window).

**Parameters:**
- callback - a callback function that receives a single integer parameter
**Since:** API version 1

---

