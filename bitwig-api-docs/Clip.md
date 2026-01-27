# Interface Clip

An interface that provides access to the contents of a clip in Bitwig Studio. The note content of the clip is exposed in terms of steps and keys, mainly targeted to x-y-grid applications such as step sequencers.

## Method Details

### `scrollToKey`

```java
void scrollToKey(int key)
```

Scroll the note grid so that the given key becomes the key with y position of 0. Note: This can cause some parts of the grid to represent invalid keys as there is no clipping

**Parameters:**
- key - the key that should be the new key with a y position of 0. This must be a value in the range 0...127.
**Since:** API version 1

---

### `scrollKeysPageUp`

```java
void scrollKeysPageUp()
```

Scrolls the note grid keys one page up. For example if the note grid is configured to show 12 keys and is currently showing keys [36..47], calling this method would scroll the note grid to key range [48..59].

**Since:** API version 1

---

### `scrollKeysPageDown`

```java
void scrollKeysPageDown()
```

Scrolls the note grid keys one page down. For example if the note grid is configured to show 12 keys and is currently showing keys [36..47], calling this method would scroll the note grid to key range [48..59].

**Since:** API version 1

---

### `scrollKeysStepUp`

```java
void scrollKeysStepUp()
```

Scrolls the note grid keys one key up. For example if the note grid is configured to show 12 keys and is currently showing keys [36..47], calling this method would scroll the note grid to key range [37..48].

**Since:** API version 1

---

### `scrollKeysStepDown`

```java
void scrollKeysStepDown()
```

Scrolls the note grid keys one key down. For example if the note grid is configured to show 12 keys and is currently showing keys [36..47], calling this method would scroll the note grid to key range [35..46].

**Since:** API version 1

---

### `scrollToStep`

```java
void scrollToStep(int step)
```

Scroll the note grid so that the given step becomes visible.

**Parameters:**
- step - the step that should become visible
**Since:** API version 1

---

### `scrollStepsPageForward`

```java
void scrollStepsPageForward()
```

Scrolls the note grid steps one page forward. For example if the note grid is configured to show 16 steps and is currently showing keys [0..15], calling this method would scroll the note grid to key range [16..31].

**Since:** API version 1

---

### `scrollStepsPageBackwards`

```java
void scrollStepsPageBackwards()
```

Scrolls the note grid steps one page backwards. For example if the note grid is configured to show 16 steps and is currently showing keys [16..31], calling this method would scroll the note grid to key range [0..16].

**Since:** API version 1

---

### `scrollStepsStepForward`

```java
void scrollStepsStepForward()
```

Scrolls the note grid steps one step forward. For example if the note grid is configured to show 16 steps and is currently showing keys [0..15], calling this method would scroll the note grid to key range [1..16].

**Since:** API version 1

---

### `scrollStepsStepBackwards`

```java
void scrollStepsStepBackwards()
```

Scrolls the note grid steps one step backwards. For example if the note grid is configured to show 16 steps and is currently showing keys [1..16], calling this method would scroll the note grid to key range [0..15].

**Since:** API version 1

---

### `canScrollKeysUp`

```java
BooleanValue canScrollKeysUp()
```

Value that reports if the note grid keys can be scrolled further up.

**Since:** API version 2

---

### `addCanScrollKeysUpObserver`

```java
@Deprecated void addCanScrollKeysUpObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the note grid keys can be scrolled further up.

**Parameters:**
- callback - a callback function that receives a single boolean parameter.
**Since:** API version 1

---

### `canScrollKeysDown`

```java
BooleanValue canScrollKeysDown()
```

Value that reports if the note grid keys can be scrolled further down.

**Since:** API version 2

---

### `addCanScrollKeysDownObserver`

```java
@Deprecated void addCanScrollKeysDownObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the note grid keys can be scrolled further down.

**Parameters:**
- callback - a callback function that receives a single boolean parameter.
**Since:** API version 1

---

### `canScrollStepsBackwards`

```java
BooleanValue canScrollStepsBackwards()
```

Value that reports if the note grid if the note grid steps can be scrolled backwards.

**Since:** API version 2

---

### `addCanScrollStepsBackwardsObserver`

```java
@Deprecated void addCanScrollStepsBackwardsObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the note grid steps can be scrolled backwards.

**Parameters:**
- callback - a callback function that receives a single boolean parameter.
**Since:** API version 1

---

### `canScrollStepsForwards`

```java
BooleanValue canScrollStepsForwards()
```

Value that reports if the note grid if the note grid steps can be scrolled forwards.

**Since:** API version 2

---

### `addCanScrollStepsForwardObserver`

```java
@Deprecated void addCanScrollStepsForwardObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the note grid keys can be scrolled forward.

**Parameters:**
- callback - a callback function that receives a single boolean parameter.
**Since:** API version 1

---

### `toggleStep`

```java
void toggleStep(int x, int y, int insertVelocity)
```

**Since:** API version 1

---

### `toggleStep`

```java
void toggleStep(int channel, int x, int y, int insertVelocity)
```

Toggles the existence of a note in the note grid cell specified by the given x and y arguments.

**Parameters:**
- channel - the MIDI channel, between 0 and 15.
**Since:** API version 10

---

### `setStep`

```java
void setStep(int x, int y, int insertVelocity, double insertDuration)
```

**Since:** API version 1

---

### `setStep`

```java
void setStep(int channel, int x, int y, int insertVelocity, double insertDuration)
```

Creates a note in the grid cell specified by the given x and y arguments. Existing notes are overwritten.

**Parameters:**
- x - the x position within the note grid, defining the step/time of the new note
**Since:** API version 1

---

### `clearStep`

```java
void clearStep(int x, int y)
```

**Since:** API version 1

---

### `clearStep`

```java
void clearStep(int channel, int x, int y)
```

Removes the note in the grid cell specified by the given x and y arguments. Calling this method does nothing in case no note exists at the given x-y-coordinates.

**Parameters:**
- channel - MIDI channel, from 0 to 15.
**Since:** API version 10

---

### `clearStepsAtX`

```java
void clearStepsAtX(int channel, int x)
```

Removes all notes in the grid started on the step x.

**Since:** API version 10

---

### `clearSteps`

```java
@Deprecated void clearSteps(int y)
```

**Since:** API version 1

---

### `clearStepsAtY`

```java
void clearStepsAtY(int channel, int y)
```

Removes all notes in the grid row specified by the given y argument.

**Parameters:**
- channel - MIDI channel, from 0 to 15.
**Since:** API version 10

---

### `clearSteps`

```java
void clearSteps()
```

Removes all notes in the grid.

**Since:** API version 1

---

### `moveStep`

```java
void moveStep(int x, int y, int dx, int dy)
```

**Since:** API version 16

---

### `moveStep`

```java
void moveStep(int channel, int x, int y, int dx, int dy)
```

Moves a note in the note grid cell specified by the given x and y arguments to the grid cell (x + dx, y + dy).

**Parameters:**
- channel - MIDI channel, from 0 to 15.
**Since:** API version 16

---

### `selectStepContents`

```java
void selectStepContents(int x, int y, boolean clearCurrentSelection)
```

**Since:** API version 1

---

### `selectStepContents`

```java
void selectStepContents(int channel, int x, int y, boolean clearCurrentSelection)
```

Selects the note in the grid cell specified by the given x and y arguments, in case there actually is a note at the given x-y-coordinates.

**Parameters:**
- channel - MIDI channel, from 0 to 15.
**Since:** API version 10

---

### `setStepSize`

```java
void setStepSize(double lengthInBeatTime)
```

Sets the beat time duration that is represented by one note grid step.

**Parameters:**
- lengthInBeatTime - the length of one note grid step in beat time.
**Since:** API version 1

---

### `addStepDataObserver`

```java
void addStepDataObserver(StepDataChangedCallback callback)
```

Registers an observer that reports which note grid steps/keys contain notes.

**Parameters:**
- callback - A callback function that receives three parameters: 1. the x (step) coordinate within the note grid (integer), 2. the y (key) coordinate within the note grid (integer), and 3. an integer value that indicates if the step is empty (`0`) or if a note continues playing (`1`) or starts playing (`2`).
**Since:** API version 1

---

### `addNoteStepObserver`

```java
void addNoteStepObserver(NoteStepChangedCallback callback)
```

Registers an observer that reports which note grid steps/keys contain notes.

**Parameters:**
- callback - A callback function that receives the StepInfo.
**Since:** API version 10

---

### `playingStep`

```java
IntegerValue playingStep()
```

Value that reports note grid cells as they get played by the sequencer.

**Since:** API version 2

---

### `addPlayingStepObserver`

```java
@Deprecated void addPlayingStepObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports note grid cells as they get played by the sequencer.

**Parameters:**
- callback - A callback function that receives a single integer parameter, which reflects the step coordinate that is played, or -1 if no step is associated with the current playback position.
**Since:** API version 1

---

### `setName`

```java
void setName(String name)
```

Updates the name of the clip.

**Parameters:**
- name - the new clip name
**Since:** API version 1

---

### `getShuffle`

```java
SettableBooleanValue getShuffle()
```

Returns shuffle settings of the clip.

**Returns:** the value object that represents the clips shuffle setting.
**Since:** API version 1

---

### `getAccent`

```java
SettableRangedValue getAccent()
```

Returns accent setting of the clip.

**Returns:** the ranged value object that represents the clips accent setting.
**Since:** API version 1

---

### `getPlayStart`

```java
SettableBeatTimeValue getPlayStart()
```

Returns the start of the clip in beat time.

**Returns:** the beat time object that represents the clips start time.
**Since:** API version 1

---

### `getPlayStop`

```java
SettableBeatTimeValue getPlayStop()
```

Returns the length of the clip in beat time.

**Returns:** the beat time object that represents the duration of the clip.
**Since:** API version 1

---

### `isLoopEnabled`

```java
SettableBooleanValue isLoopEnabled()
```

Returns an object that provides access to the loop enabled state of the clip.

**Returns:** a boolean value object.
**Since:** API version 1

---

### `getLoopStart`

```java
SettableBeatTimeValue getLoopStart()
```

Returns the loop start time of the clip in beat time.

**Returns:** the beat time object that represents the clips loop start time.
**Since:** API version 1

---

### `getLoopLength`

```java
SettableBeatTimeValue getLoopLength()
```

Returns the loop length of the clip in beat time.

**Returns:** the beat time object that represents the clips loop length.
**Since:** API version 1

---

### `addColorObserver`

```java
@Deprecated void addColorObserver(ColorValueChangedCallback callback)
```

Registers an observer that reports the clip color.

**Parameters:**
- callback - a callback function that receives three parameters: 1. the red coordinate of the RBG color value, 2. the green coordinate of the RBG color value, and 3. the blue coordinate of the RBG color value
**Since:** API version 1

---

### `color`

```java
SettableColorValue color()
```

Get the color of the clip.

**Since:** API version 2

---

### `duplicate`

```java
void duplicate()
```

Duplicates the clip.

**Since:** API version 1

---

### `duplicateContent`

```java
void duplicateContent()
```

Duplicates the content of the clip.

**Since:** API version 1

---

### `transpose`

```java
void transpose(int semitones)
```

Transposes all notes in the clip by the given number of semitones.

**Parameters:**
- semitones - the amount of semitones to transpose, can be a positive or negative integer value.
**Since:** API version 1

---

### `quantize`

```java
void quantize(double amount)
```

Quantize the start time of all notes in the clip according to the given amount. The note lengths remain the same as before.

**Parameters:**
- amount - a factor between `0` and `1` that allows to morph between the original note start and the quantized note start.
**Since:** API version 1

---

### `getTrack`

```java
Track getTrack()
```

Gets the track that contains the clip.

**Returns:** a track object that represents the track which contains the clip.
**Since:** API version 1

---

### `launchQuantization`

```java
SettableEnumValue launchQuantization()
```

Setting for the default launch quantization. Possible values are "default", "none", "8", "4", "2", "1", "1/2", "1/4", "1/8", "1/16"

**Since:** API version 8

---

### `useLoopStartAsQuantizationReference`

```java
SettableBooleanValue useLoopStartAsQuantizationReference()
```

Setting "Q to loop" in the inspector.

**Since:** API version 8

---

### `launchLegato`

```java
@Deprecated SettableBooleanValue launchLegato()
```

Setting "Legato" from the inspector.

**Since:** API version 8

---

### `launchMode`

```java
SettableEnumValue launchMode()
```

Setting "Launch Mode" from the inspector. Possible values are: - default - from_start - continue_or_from_start - continue_or_synced - synced

**Since:** API version 9

---

### `getStep`

```java
NoteStep getStep(int channel, int x, int y)
```

Get step info

**Since:** API version 10

---

### `launch`

```java
void launch()
```

Launches the clip.

**Since:** API version 10

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

### `clipLauncherSlot`

```java
ClipLauncherSlot clipLauncherSlot()
```

Get the clip launcher slot containing the clip.

**Since:** API version 10

---

### `showInEditor`

```java
void showInEditor()
```

Open the detail editor and show the clip.

**Since:** API version 18

---

