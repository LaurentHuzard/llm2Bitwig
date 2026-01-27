# Interface SceneBank

A scene bank provides access to a range of scenes in Bitwig Studio. Instances of scene bank are configured with a fixed number of scenes and represent an excerpt of a larger list of scenes. Various methods are provided for scrolling to different sections of the scene list. It basically acts like a window moving over the list of underlying scenes. To receive an instance of scene bank call ControllerHost.createSceneBank(int).

## Method Details

### `getScene`

```java
Scene getScene(int indexInBank)
```

Returns the scene at the given index within the bank.

**Parameters:**
- indexInBank - the scene index within this bank, not the index within the list of all Bitwig Studio scenes. Must be in the range [0..sizeOfBank-1].
**Returns:** the requested scene object
**Since:** API version 1

---

### `scrollPageUp`

```java
@Deprecated void scrollPageUp()
```

Scrolls the scenes one page up.

**Since:** API version 1

---

### `scrollPageDown`

```java
@Deprecated void scrollPageDown()
```

Scrolls the scenes one page down.

**Since:** API version 1

---

### `scrollUp`

```java
@Deprecated void scrollUp()
```

Scrolls the scenes one scene up.

**Since:** API version 1

---

### `scrollDown`

```java
@Deprecated void scrollDown()
```

Scrolls the scenes one scene down.

**Since:** API version 1

---

### `scrollTo`

```java
@Deprecated void scrollTo(int position)
```

Makes the scene with the given position visible in the track bank.

**Parameters:**
- position - the position of the scene within the underlying full list of scenes
**Since:** API version 1

---

### `addScrollPositionObserver`

```java
@Deprecated void addScrollPositionObserver(IntegerValueChangedCallback callback, int valueWhenUnassigned)
```

Registers an observer that reports the current scene scroll position.

**Parameters:**
- callback - a callback function that takes a single integer parameter
**Since:** API version 1

---

### `addCanScrollUpObserver`

```java
@Deprecated void addCanScrollUpObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the scene window can be scrolled further up.

**Parameters:**
- callback - a callback function that takes a single boolean parameter
**Since:** API version 1

---

### `addCanScrollDownObserver`

```java
@Deprecated void addCanScrollDownObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the scene window can be scrolled further down.

**Parameters:**
- callback - a callback function that takes a single boolean parameter
**Since:** API version 1

---

### `addSceneCountObserver`

```java
@Deprecated void addSceneCountObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the underlying total scene count (not the number of scenes available in the bank window).

**Parameters:**
- callback - a callback function that receives a single integer parameter
**Since:** API version 1

---

### `launchScene`

```java
void launchScene(int indexInWindow)
```

Launches the scene with the given bank index.

**Parameters:**
- indexInWindow - the scene index within the bank, not the position of the scene withing the underlying full list of scenes.
**Since:** API version 1

---

### `setIndication`

```java
void setIndication(boolean shouldIndicate)
```

Specifies if the Bitwig Studio clip launcher should indicate which scenes are part of the window. By default indications are disabled.

**Parameters:**
- shouldIndicate - `true` if visual indications should be enabled, `false` otherwise
**Since:** API version 10

---

