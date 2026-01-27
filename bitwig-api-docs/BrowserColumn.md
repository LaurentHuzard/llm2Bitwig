# Interface BrowserColumn

Instances of this interface are used to navigate a column in the Bitwig Studio browser.

## Method Details

### `addExistsObserver`

```java
@Deprecated void addExistsObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the column exists.

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

### `entryCount`

```java
IntegerValue entryCount()
```

Value that reports the underlying total count of column entries (not the size of the column window).

**Since:** API version 2

---

### `addEntryCountObserver`

```java
@Deprecated void addEntryCountObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the underlying total count of column entries (not the size of the column window).

**Parameters:**
- callback - a callback function that receives a single integer parameter
**Since:** API version 1

---

### `createCursorItem`

```java
BrowserItem createCursorItem()
```

Returns the cursor item, which can be used to navigate over the list of entries.

**Returns:** the requested filter item object
**Since:** API version 1

---

### `createItemBank`

```java
BrowserItemBank createItemBank(int size)
```

Returns an object that provides access to a bank of successive entries using a window configured with the given size, that can be scrolled over the list of entries.

**Parameters:**
- size - the number of simultaneously accessible items
**Returns:** the requested item bank object

---

