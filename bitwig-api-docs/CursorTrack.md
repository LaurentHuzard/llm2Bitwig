# Interface CursorTrack

Instances of this interface represent the cursor item of track selections.

## Method Details

### `selectParent`

```java
void selectParent()
```

Makes the cursor track point to it's parent group track, in case it is not already pointing to the root group track.

**Since:** API version 1

---

### `selectFirstChild`

```java
void selectFirstChild()
```

Makes the cursor track point to the first child found with the track group that this cursor currently points to. If this cursor is not pointing to a track group or the track group is empty then this has no effect.

**Since:** API version 2

---

### `setCursorNavigationMode`

```java
void setCursorNavigationMode(CursorNavigationMode mode)
```

Specifies the behaviour of the functions Cursor.selectPrevious(), Cursor.selectNext(), Cursor.selectFirst() and Cursor.selectLast(). Calling those functions can either navigate the cursor within the current nesting level, or over a flat list of either all tracks or only the expanded tracks. Default is CursorNavigationMode.FLAT.

**Since:** API version 1

---

### `createCursorDevice`

```java
PinnableCursorDevice createCursorDevice()
```

Description copied from interface: Track

**Returns:** the requested device selection cursor object

---

### `createCursorDevice`

```java
@Deprecated PinnableCursorDevice createCursorDevice(String name)
```

Description copied from interface: Track

**Parameters:**
- name - the name of the custom device selection cursor, for example "Primary", or `null` to refer to the device selection cursor in the arranger cursor track as shown in the Bitwig Studio user interface.
**Returns:** the requested device selection cursor object

---

### `createCursorDevice`

```java
@Deprecated PinnableCursorDevice createCursorDevice(String name, int numSends)
```

Description copied from interface: Track

**Parameters:**
- name - the name of the custom device selection cursor, for example "Primary", or `null` to refer to the device selection cursor in the arranger cursor track as shown in the Bitwig Studio user interface.
**Returns:** the requested device selection cursor object

---

### `createCursorDevice`

```java
PinnableCursorDevice createCursorDevice(String id, String name, int numSends, CursorDeviceFollowMode followMode)
```

Creates a CursorDevice for this cursor track that by default follows a device based on the supplied follow mode.

**Parameters:**
- id - An id that is used to identify this cursor.
**Since:** API version 2

---

### `createLauncherCursorClip`

```java
PinnableCursorClip createLauncherCursorClip(int gridWidth, int gridHeight)
```

Creates a PinnableCursorClip for this track that follows a clip within the track on the clip launcher. This clip typically gets updated when the user selects a new clip on the clip launcher. It can also act independently from the user's selection if the user so chooses in the settings for the controller.

**Since:** API version 10

---

### `createLauncherCursorClip`

```java
PinnableCursorClip createLauncherCursorClip(String id, String name, int gridWidth, int gridHeight)
```

Creates a PinnableCursorClip for this track that follows a clip within the track on the clip launcher. This clip typically gets updated when the user selects a new clip on the clip launcher. It can also act independently from the user's selection if the user so chooses in the settings for the controller.

**Since:** API version 10

---

