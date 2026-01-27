# Interface Channel

This interface defines access to the common attributes and operations of channels, such as tracks or nested device channels.

## Method Details

### `channelId`

```java
StringValue channelId()
```

Reports the channel UUID.

**Since:** API version 20

---

### `channelIndex`

```java
IntegerValue channelIndex()
```

Reports the channel index.

**Since:** API version 22

---

### `isActivated`

```java
SettableBooleanValue isActivated()
```

Returns an object that represents the activated state of the channel.

**Returns:** an object that provides access to the channels activated state.
**Since:** API version 1

---

### `getVolume`

```java
@Deprecated Parameter getVolume()
```

Gets a representation of the channels volume control.

**Returns:** an object that provides access to the channels volume control.
**Since:** API version 1

---

### `volume`

```java
Parameter volume()
```

Gets a representation of the channels volume control.

**Returns:** an object that provides access to the channels volume control.
**Since:** API version 5

---

### `getPan`

```java
@Deprecated Parameter getPan()
```

Gets a representation of the channels pan control.

**Returns:** an object that provides access to the channels pan control.
**Since:** API version 1

---

### `pan`

```java
Parameter pan()
```

Gets a representation of the channels pan control.

**Returns:** an object that provides access to the channels pan control.
**Since:** API version 5

---

### `getMute`

```java
@Deprecated SettableBooleanValue getMute()
```

Gets a representation of the channels mute control.

**Returns:** an object that provides access to the channels mute control.
**Since:** API version 1

---

### `mute`

```java
SettableBooleanValue mute()
```

Gets a representation of the channels mute control.

**Returns:** an object that provides access to the channels mute control.
**Since:** API version 5

---

### `getSolo`

```java
@Deprecated SoloValue getSolo()
```

Gets a representation of the channels solo control.

**Returns:** an object that provides access to the channels solo control.
**Since:** API version 1

---

### `solo`

```java
SoloValue solo()
```

Gets a representation of the channels solo control.

**Returns:** an object that provides access to the channels solo control.
**Since:** API version 1

---

### `isMutedBySolo`

```java
BooleanValue isMutedBySolo()
```

True if the current channel is being muted by an other channel with solo on.

**Since:** API version 10

---

### `addVuMeterObserver`

```java
void addVuMeterObserver(int range, int channel, boolean peak, IntegerValueChangedCallback callback)
```

Registers an observer for the VU-meter of this track.

**Parameters:**
- range - the number of steps to which the reported values should be scaled. For example a range of 128 would cause the callback to be called with values between 0 and 127.
**Since:** API version 1

---

### `addNoteObserver`

```java
@Deprecated void addNoteObserver(NotePlaybackCallback callback)
```

Registers an observer that reports notes when they are played on the channel.

**Parameters:**
- callback - a callback function that receives three parameters: 1. on/off state (boolean), 2. key (int), and 3. velocity (float).
**Since:** API version 1

---

### `playingNotes`

```java
PlayingNoteArrayValue playingNotes()
```

Returns an array of the playing notes.

**Since:** API version 2

---

### `addColorObserver`

```java
@Deprecated void addColorObserver(ColorValueChangedCallback callback)
```

Registers an observer that receives notifications about the color of the channel. The callback gets called at least once immediately after this function call to report the current color. Additional calls are fired each time the color changes.

**Parameters:**
- callback - a callback function that receives three float parameters in the range [0..1]: 1. red, 2. green, and 3. blue.
**Since:** API version 1

---

### `color`

```java
SettableColorValue color()
```

Get the color of the channel.

**Since:** API version 2

---

### `sendBank`

```java
SendBank sendBank()
```

Gets a SendBank that can be used to navigate the sends of this channel.

**Since:** API version 2

---

### `getSend`

```java
@Deprecated Send getSend(int index)
```

Gets a representation of the channels send control at the given index.

**Parameters:**
- index - the index of the send, must be valid
**Returns:** an object that provides access to the requested send control.
**Since:** API version 1

---

### `duplicate`

```java
void duplicate()
```

Duplicates the track.

**Since:** API version 1

---

### `selectInMixer`

```java
void selectInMixer()
```

Selects the device chain in the Bitwig Studio mixer, in case it is a selectable object.

**Since:** API version 1

---

### `addIsSelectedInMixerObserver`

```java
void addIsSelectedInMixerObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the device chain is selected in Bitwig Studio mixer.

**Parameters:**
- callback - a callback function that takes a single boolean parameter.
**Since:** API version 1

---

### `makeVisibleInArranger`

```java
void makeVisibleInArranger()
```

Tries to scroll the contents of the arrangement editor so that the channel becomes visible.

**Since:** API version 1

---

### `makeVisibleInMixer`

```java
void makeVisibleInMixer()
```

Tries to scroll the contents of the mixer panel so that the channel becomes visible.

**Since:** API version 1

---

