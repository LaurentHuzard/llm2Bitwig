# Interface Browser

Instances of this interface represent a contextual browser in Bitwig Studio.

## Method Details

### `addIsBrowsingObserver`

```java
@Deprecated void addIsBrowsingObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if a browsing session was started.

**Parameters:**
- callback - a callback function that receivers a single boolean parameter.
**Since:** API version 1

---

### `startBrowsing`

```java
void startBrowsing()
```

Starts a new browser session.

**Since:** API version 1

---

### `cancelBrowsing`

```java
void cancelBrowsing()
```

Cancels the current browser session.

**Since:** API version 1

---

### `commitSelectedResult`

```java
void commitSelectedResult()
```

Finished the browser session by loading the selected item.

**Since:** API version 1

---

### `activateSession`

```java
void activateSession(BrowsingSession session)
```

Activates the given search session. Please note that only one search session can be active at a time.

**Parameters:**
- session - the session that should be activated.
**Since:** API version 1

---

### `isWindowMinimized`

```java
SettableBooleanValue isWindowMinimized()
```

Return an object allows to observe and control if the browser window should be small or full-sized.

**Returns:** a boolean value object
**Since:** API version 1

---

### `shouldAudition`

```java
SettableBooleanValue shouldAudition()
```

Return an object allows to observe and control if the selected result should be auditioned.

**Returns:** a boolean value object
**Since:** API version 1

---

### `createSessionBank`

```java
BrowsingSessionBank createSessionBank(int size)
```

Returns an object that provided bank-wise navigation of the available search sessions. Each search session is dedicated to a certain material type, as shown in the tabs of Bitwig Studio's contextual browser.

**Parameters:**
- size - the size of the windows used to navigate the available browsing sessions.
**Returns:** the requested file column bank object
**Since:** API version 1

---

### `createCursorSession`

```java
CursorBrowsingSession createCursorSession()
```

Returns an object that represents the selected tab as shown in Bitwig Studio's contextual browser window.

**Returns:** the requested browsing session cursor
**Since:** API version 1

---

### `getDeviceSession`

```java
DeviceBrowsingSession getDeviceSession()
```

Returns an object that provides access to the contents of the device tab as shown in Bitwig Studio's contextual browser window.

**Returns:** the requested device browsing session instance
**Since:** API version 1

---

### `getPresetSession`

```java
PresetBrowsingSession getPresetSession()
```

Returns an object that provides access to the contents of the preset tab as shown in Bitwig Studio's contextual browser window.

**Returns:** the requested preset browsing session instance
**Since:** API version 1

---

### `getSampleSession`

```java
SampleBrowsingSession getSampleSession()
```

Returns an object that provides access to the contents of the samples tab as shown in Bitwig Studio's contextual browser window.

**Returns:** the requested sample browsing session instance
**Since:** API version 1

---

### `getMultiSampleSession`

```java
MultiSampleBrowsingSession getMultiSampleSession()
```

Returns an object that provides access to the contents of the multi-samples tab as shown in Bitwig Studio's contextual browser window.

**Returns:** the requested multi-sample browsing session instance
**Since:** API version 1

---

### `getClipSession`

```java
ClipBrowsingSession getClipSession()
```

Returns an object that provides access to the contents of the clips tab as shown in Bitwig Studio's contextual browser window.

**Returns:** the requested clip browsing session instance
**Since:** API version 1

---

### `getMusicSession`

```java
MusicBrowsingSession getMusicSession()
```

Returns an object that provides access to the contents of the music tab as shown in Bitwig Studio's contextual browser window.

**Returns:** the requested music browsing session instance
**Since:** API version 1

---

