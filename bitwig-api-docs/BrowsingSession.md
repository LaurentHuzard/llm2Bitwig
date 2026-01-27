# Interface BrowsingSession

Instances of this interface are used for browsing material according to a certain type. Possible material types are devices, presets, samples, multi-samples, clips, or files from your music collection. In Bitwig Studio's contextual browser window the search sessions for the various material kinds are shown in tabs. Just like the tabs in the browser window, instances of this interface provide access to multiple filter columns and one result column. The filter columns are used to control the content of the results column.

## Method Details

### `addIsAvailableObserver`

```java
@Deprecated void addIsAvailableObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the browser session is available for the current context.

**Parameters:**
- callback - a callback function that receives a single boolean argument.
**Since:** API version 1

---

### `addIsActiveObserver`

```java
void addIsActiveObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the browser session is currently active.

**Parameters:**
- callback - a callback function that receives a single boolean argument.
**Since:** API version 1

---

### `activate`

```java
void activate()
```

Activates the given search session, same as calling Browser#activateSession(this). Please note that only one search session can be active at a time.

**Since:** API version 1

---

### `getResults`

```java
BrowserResultsColumn getResults()
```

Returns an object that represents the column which shows the results according to the current filter settings in Bitwig Studio's contextual browser.

**Returns:** the requested results browser column.
**Since:** API version 1

---

### `getCursorResult`

```java
CursorBrowserResultItem getCursorResult()
```

Returns an object used for navigating the entries in the results column of Bitwig Studio's contextual browser.

**Returns:** the requested cursor object.
**Since:** API version 1

---

### `getSettledResult`

```java
BrowserResultsItem getSettledResult()
```

Returns an object that represents the currently loaded material item.

**Returns:** the requested settled result object
**Since:** API version 1

---

### `getCursorFilter`

```java
CursorBrowserFilterColumn getCursorFilter()
```

Returns an object that can be used to navigate over the various filter sections of the browsing session.

**Returns:** the requested filter cursor object

---

### `createFilterBank`

```java
BrowserFilterColumnBank createFilterBank(int numColumns)
```

Returns an object that provided bank-wise navigation of filter columns.

**Parameters:**
- numColumns - the number of columns that are simultaneously accessible.
**Returns:** the requested file column bank object
**Since:** API version 1

---

### `hitCount`

```java
IntegerValue hitCount()
```

Value that reports the number of results available for the current filter settings.

**Since:** API version 2

---

### `addHitCountObserver`

```java
@Deprecated void addHitCountObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the number of results available for the current filter settings.

**Parameters:**
- callback - a callback function that receives a single integer argument.
**Since:** API version 1

---

