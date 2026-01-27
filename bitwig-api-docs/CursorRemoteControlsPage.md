# Interface CursorRemoteControlsPage

Represents a cursor that looks at a RemoteControlsPage.

## Method Details

### `pageNames`

```java
StringArrayValue pageNames()
```

Value that reports the names of the devices parameter pages.

---

### `selectNextPage`

```java
void selectNextPage(boolean shouldCycle)
```

Selects the next page.

**Parameters:**
- shouldCycle - If true then when the end is reached and there is no next page it selects the first page
**Since:** API version 2

---

### `selectPreviousPage`

```java
void selectPreviousPage(boolean shouldCycle)
```

Selects the previous page.

**Parameters:**
- shouldCycle - If true then when the end is reached and there is no next page it selects the first page
**Since:** API version 2

---

### `selectNextPageMatching`

```java
void selectNextPageMatching(String expression, boolean shouldCycle)
```

Selects the next page that matches the given expression.

**Parameters:**
- expression - An expression that can match a page based on how it has been tagged. For now this can only be the name of a single tag that you would like to match.
**Since:** API version 2

---

### `selectPreviousPageMatching`

```java
void selectPreviousPageMatching(String expression, boolean shouldCycle)
```

Selects the previous page that matches the given expression.

**Parameters:**
- expression - An expression that can match a page based on how it has been tagged. For now this can only be the name of a single tag that you would like to match.
**Since:** API version 2

---

### `selectedPageIndex`

```java
SettableIntegerValue selectedPageIndex()
```

Value that reports the currently selected parameter page index.

**Since:** API version 2

---

### `pageCount`

```java
IntegerValue pageCount()
```

Value that represents the number of pages.

**Since:** API version 7

---

### `createPresetPage`

```java
void createPresetPage()
```

Creates a new preset page.

**Since:** API version 16

---

### `createPresetPageAction`

```java
HardwareActionBindable createPresetPageAction()
```


---

