# Interface ClipLauncherSlotOrScene

Value that reports the color of this slot.

## Method Details

### `name`

```java
StringValue name()
```

Returns an object that provides access to the name of the scene.

**Returns:** a string value object that represents the scene name.
**Since:** API version 2

---

### `launch`

```java
void launch()
```

Launches the clip or scene.

**Since:** API version 1

---

### `launchAction`

```java
HardwareActionBindable launchAction()
```

---

### `launchAlt`

```java
void launchAlt()
```

Launches with alternative settings.

**Since:** API version 18

---

### `launchAltAction`

```java
HardwareActionBindable launchAltAction()
```

**Since:** API version 18

---

### `launchRelease`

```java
void launchRelease()
```

Call it when the pad is released.

**Since:** API version 18

---

### `launchReleaseAction`

```java
HardwareActionBindable launchReleaseAction()
```

**Since:** API version 18

---

### `launchReleaseAlt`

```java
void launchReleaseAlt()
```

Call it when the pad is released with alternative settings.

**Since:** API version 18

---

### `launchReleaseAltAction`

```java
HardwareActionBindable launchReleaseAltAction()
```

**Since:** API version 18

---

### `launchWithOptions`

```java
void launchWithOptions(String quantization, String launchMode)
```

Launches with the given options:

**Parameters:**
- quantization - possible values are "default", "none", "8", "4", "2", "1", "1/2", "1/4", "1/8", "1/16"
**Since:** API version 16

---

### `launchWithOptionsAction`

```java
HardwareActionBindable launchWithOptionsAction(String quantization, String launchMode)
```

---

### `launchLastClipWithOptions`

```java
void launchLastClipWithOptions(String quantization, String launchMode)
```

Launches the last clip with the given options:

**Parameters:**
- quantization - possible values are "default", "none", "8", "4", "2", "1", "1/2", "1/4", "1/8", "1/16"
**Since:** API version 16

---

### `launchLastClipWithOptionsAction`

```java
HardwareActionBindable launchLastClipWithOptionsAction(String quantization, String launchMode)
```

---

### `sceneIndex`

```java
IntegerValue sceneIndex()
```

Value that reports the position of the scene within the list of Bitwig Studio scenes.

**Since:** API version 2

---

### `copyFrom`

```java
@Deprecated void copyFrom(ClipLauncherSlotOrScene source)
```

Copies the current slot or scene into the dest slot or scene.

**Since:** API version 4

---

### `moveTo`

```java
@Deprecated void moveTo(ClipLauncherSlotOrScene dest)
```

Moves the current slot or scene into the destination slot or scene.

**Since:** API version 4

---

### `color`

```java
SettableColorValue color()
```

Value that reports the color of this slot.

**Since:** API version 7

---

### `setIndication`

```java
@Deprecated void setIndication(boolean shouldIndicate)
```

Specifies if the Bitwig Studio clip launcher should indicate which slots and scenes are part of the window. By default indications are disabled.

**Parameters:**
- shouldIndicate - `true` if visual indications should be enabled, `false` otherwise
**Since:** API version 10

---

### `replaceInsertionPoint`

```java
InsertionPoint replaceInsertionPoint()
```

An InsertionPoint that is used to replace the contents of this slot or scene.

**Since:** API version 7

---

### `nextSceneInsertionPoint`

```java
InsertionPoint nextSceneInsertionPoint()
```

An InsertionPoint that can be used to insert content in the next scene.

**Since:** API version 7

---

### `previousSceneInsertionPoint`

```java
InsertionPoint previousSceneInsertionPoint()
```

An InsertionPoint that can be used to insert content after this slot or scene.

**Since:** API version 7

---

