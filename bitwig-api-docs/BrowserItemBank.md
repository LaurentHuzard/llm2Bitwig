# Interface BrowserItemBank<ItemType extends BrowserItem>

Instances of this interface are used to navigate a column in the Bitwig Studio browser.

## Method Details

### `getSize`

```java
@Deprecated int getSize()
```

Returns the window size that was used to configure the filter column during creation.

**Returns:** the size of the filter column.
**Since:** API version 1

---

### `getItem`

```java
@Deprecated BrowserItem getItem(int index)
```

Returns the item for the given index.

**Parameters:**
- index - the item index, must be in the range `[0..getSize-1]`
**Returns:** the requested item object
**Since:** API version 1

---

### `scrollUp`

```java
@Deprecated void scrollUp()
```

Scrolls the filter column entries one item up.

**Since:** API version 1

---

### `scrollDown`

```java
@Deprecated void scrollDown()
```

Scrolls the filter column entries one item down.

**Since:** API version 1

---

### `scrollPageUp`

```java
@Deprecated void scrollPageUp()
```

Scrolls the filter column entries one page up. For example if the column is configured with a window size of 8 entries and is currently showing items [1..8], calling this method would scroll the column to show items [9..16].

**Since:** API version 1

---

### `scrollPageDown`

```java
@Deprecated void scrollPageDown()
```

Scrolls the filter column entries one page up. For example if the column is configured with a window size of 8 entries and is currently showing items [9..16], calling this method would scroll the column to show items [1..8].

**Since:** API version 1

---

### `addScrollPositionObserver`

```java
@Deprecated void addScrollPositionObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the current scroll position, more specifically the position of the first item within the underlying list of entries, that is shown as the first entry within the window.

**Parameters:**
- callback - a callback function that receives a single integer number parameter. The parameter reflects the scroll position, or `-1` in case the column has no content.
**Since:** API version 1

---

### `addCanScrollUpObserver`

```java
@Deprecated void addCanScrollUpObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the column entries can be scrolled further up.

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

### `addCanScrollDownObserver`

```java
@Deprecated void addCanScrollDownObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the column entries can be scrolled further down.

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

