# Interface BrowserFilterColumn

Instances of this interface are used to navigate a filter column in the Bitwig Studio browser.

## Method Details

### `getWildcardItem`

```java
BrowserFilterItem getWildcardItem()
```

Returns the filter item that represents the top-level all/any/everything wildcard item.

**Returns:** the requested filter item object
**Since:** API version 1

---

### `createCursorItem`

```java
BrowserFilterItem createCursorItem()
```

Returns the cursor filter item, which can be used to navigate over the list of entries.

**Returns:** the requested filter item object
**Since:** API version 1

---

### `createItemBank`

```java
BrowserFilterItemBank createItemBank(int size)
```

Returns an object that provides access to a bank of successive entries using a window configured with the given size, that can be scrolled over the list of entries.

**Parameters:**
- size - the number of simultaneously accessible items
**Returns:** the requested item bank object

---

### `name`

```java
StringValue name()
```

Value that reports the name of the filter column.

**Since:** API version2

---

### `addNameObserver`

```java
@Deprecated void addNameObserver(int maxCharacters, String textWhenUnassigned, StringValueChangedCallback callback)
```

Registers an observer that reports the name of the filter column.

**Parameters:**
- callback - a callback function that receives a single string argument.
**Since:** API version 1

---

