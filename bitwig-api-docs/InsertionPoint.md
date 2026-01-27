# Interface InsertionPoint

Defines an insertion point where various objects can be inserted as if the user had dragged and dropped them to this insertion point (e.g with the mouse). Some things may not make sense to insert in which case nothing happens.

## Method Details

### `copyTracks`

```java
void copyTracks(Track... tracks)
```

Copies the supplied tracks to this insertion point. If it's not possible to do so then this does nothing.

---

### `moveTracks`

```java
void moveTracks(Track... tracks)
```

Moves the supplied tracks to this insertion point. If it's not possible to do so then this does nothing.

---

### `copyDevices`

```java
void copyDevices(Device... devices)
```

Copies the supplied devices to this insertion point. If it's not possible to do so then this does nothing.

---

### `moveDevices`

```java
void moveDevices(Device... devices)
```

Moves the supplied devices to this insertion point. If it's not possible to do so then this does nothing.

---

### `copySlotsOrScenes`

```java
void copySlotsOrScenes(ClipLauncherSlotOrScene... clipLauncherSlotOrScenes)
```

Copies the supplied slots or scenes to this insertion point. If it's not possible to do so then this does nothing.

---

### `moveSlotsOrScenes`

```java
void moveSlotsOrScenes(ClipLauncherSlotOrScene... clipLauncherSlotOrScenes)
```

Moves the supplied slots or scenes to this insertion point. If it's not possible to do so then this does nothing.

---

### `insertFile`

```java
void insertFile(String path)
```

Inserts the supplied file at this insertion point. If it's not possible to do so then this does nothing.

---

### `insertBitwigDevice`

```java
void insertBitwigDevice(UUID id)
```

Inserts a Bitwig device with the supplied id at this insertion point. If the device is unknown or it's not possible to insert a device here then his does nothing.

**Parameters:**
- id - The Bitwig device id to insert

---

### `insertVST2Device`

```java
void insertVST2Device(int id)
```

Inserts a VST2 plugin device with the supplied id at this insertion point. If the plug-in is unknown, or it's not possible to insert a plug-in here then his does nothing.

**Parameters:**
- id - The VST2 plugin id to insert

---

### `insertVST3Device`

```java
void insertVST3Device(String id)
```

Inserts a VST3 plugin device with the supplied id at this insertion point. If the plug-in is unknown, or it's not possible to insert a plug-in here then his does nothing.

**Parameters:**
- id - The VST3 plugin id to insert

---

### `insertCLAPDevice`

```java
void insertCLAPDevice(String id)
```

Inserts a CLAP plugin device with the supplied id at this insertion point. If the plug-in is unknown, or it's not possible to insert a plug-in here then his does nothing.

**Parameters:**
- id - The CLAP plugin id to insert
**Since:** API version 18

---

### `paste`

```java
void paste()
```

Pastes the contents of the clipboard at this insertion point.

---

### `browse`

```java
void browse()
```

Starts browsing using the popup browser for something to insert at this insertion point.

---

### `browseAction`

```java
HardwareActionBindable browseAction()
```

**Since:** API version 15

---

