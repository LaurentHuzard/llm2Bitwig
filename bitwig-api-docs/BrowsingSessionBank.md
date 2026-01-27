# Interface BrowsingSessionBank

Instances of this interface are used to navigate the available sessions in Bitwig Studio's contextual browser. The sessions are shown as tabs in the graphical user interface of the browser.

## Method Details

### `getSize`

```java
int getSize()
```

Returns the window size that was used to configure the session bank during creation.

**Returns:** the size of the session bank.
**Since:** API version 1

---

### `getSession`

```java
GenericBrowsingSession getSession(int index)
```

Returns the browser session for the given index.

**Parameters:**
- index - the session index, must be in the range `[0..getSize-1]`
**Returns:** the requested browser session object
**Since:** API version 1

---

### `scrollUp`

```java
@Deprecated void scrollUp()
```

Scrolls the browser sessions one item up.

**Since:** API version 1

---

### `scrollDown`

```java
@Deprecated void scrollDown()
```

Scrolls the browser sessions one item down.

**Since:** API version 1

---

### `scrollPageUp`

```java
@Deprecated void scrollPageUp()
```

Scrolls the browser sessions one page up. For example if the bank is configured with a window size of 8 entries and is currently showing items [1..8], calling this method would scroll the window to show items [9..16].

**Since:** API version 1

---

### `scrollPageDown`

```java
@Deprecated void scrollPageDown()
```

Scrolls the filter columns one page up. For example if the bank is configured with a window size of 8 entries and is currently showing items [9..16], calling this method would scroll the window to show items [1..8].

**Since:** API version 1

---

### `addScrollPositionObserver`

```java
@Deprecated void addScrollPositionObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the current scroll position, more specifically the position of the first item within the underlying list of browser sessions, that is shown as the first session within the window.

**Parameters:**
- callback - a callback function that receives a single integer number parameter. The parameter reflects the scroll position, or `-1` in case the column has no content.
**Since:** API version 1

---

### `addCanScrollUpObserver`

```java
@Deprecated void addCanScrollUpObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the browser sessions can be scrolled further up.

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

### `addCanScrollDownObserver`

```java
@Deprecated void addCanScrollDownObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the browser sessions can be scrolled further down.

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

### `addEntryCountObserver`

```java
@Deprecated void addEntryCountObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the underlying total count of browser sessions (not the size of the window).

**Parameters:**
- callback - a callback function that receives a single integer parameter
**Since:** API version 1

---

