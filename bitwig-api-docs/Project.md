# Interface Project

An interface for representing the current project.

## Method Details

### `getRootTrackGroup`

```java
Track getRootTrackGroup()
```

Returns an object that represents the root track group of the active Bitwig Studio project.

**Returns:** the root track group of the currently active project
**Since:** API version 1

---

### `getShownTopLevelTrackGroup`

```java
Track getShownTopLevelTrackGroup()
```

Returns an object that represents the top level track group as shown in the arranger/mixer of the active Bitwig Studio project.

**Returns:** the shown top level track group of the currently active project
**Since:** API version 1

---

### `createScene`

```java
void createScene()
```

Creates a new empty scene as the last scene in the project.

**Since:** API version 13

---

### `createSceneFromPlayingLauncherClips`

```java
void createSceneFromPlayingLauncherClips()
```

Creates a new scene (using an existing empty scene if possible) from the clips that are currently playing in the clip launcher.

**Since:** API version 1

---

### `cueVolume`

```java
Parameter cueVolume()
```

The volume used for cue output.

**Since:** API version 10

---

### `cueMix`

```java
Parameter cueMix()
```

Mix between cue bus and the studio bus (master).

**Since:** API version 10

---

### `unsoloAll`

```java
void unsoloAll()
```

Sets the solo state of all tracks to off.

**Since:** API version 10

---

### `hasSoloedTracks`

```java
BooleanValue hasSoloedTracks()
```

---

### `unmuteAll`

```java
void unmuteAll()
```

Sets the mute state of all tracks to off.

**Since:** API version 10

---

### `hasMutedTracks`

```java
BooleanValue hasMutedTracks()
```

Value that indicates if the project has muted tracks or not.

**Since:** API version 10

---

### `unarmAll`

```java
void unarmAll()
```

Sets the arm state of all tracks to off.

**Since:** API version 10

---

### `hasArmedTracks`

```java
BooleanValue hasArmedTracks()
```

Value that indicates if the project has armed tracks or not.

**Since:** API version 10

---

### `isModified`

```java
BooleanValue isModified()
```

Value that indicates if the project is modified or not.

**Since:** API version 18

---

