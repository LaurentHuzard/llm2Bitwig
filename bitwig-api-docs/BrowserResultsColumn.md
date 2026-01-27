# Interface BrowserResultsColumn

Instances of this interface are used to navigate a results column in the Bitwig Studio browser.

## Method Details

### `createCursorItem`

```java
BrowserResultsItem createCursorItem()
```

Returns the cursor result item, which can be used to navigate over the list of entries.

**Returns:** the requested filter item object
**Since:** API version 1

---

### `createItemBank`

```java
BrowserResultsItemBank createItemBank(int size)
```

Returns an object that provides access to a bank of successive entries using a window configured with the given size, that can be scrolled over the list of entries.

**Parameters:**
- size - the number of simultaneously accessible items
**Returns:** the requested item bank object

---

