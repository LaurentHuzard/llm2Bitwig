# Interface Mixer

An interface used to access various commands that can be performed on the Bitwig Studio mixer panel. To get an instance of the mixer interface call ControllerHost.createMixer().

## Method Details

### `isMeterSectionVisible`

```java
SettableBooleanValue isMeterSectionVisible()
```

Gets an object that allows to show/hide the meter section of the mixer panel. Observers can be registered on the returned object for receiving notifications when the meter section switches between shown and hidden state.

**Returns:** a boolean value object that represents the meter section visibility
**Since:** API version 1

---

### `isIoSectionVisible`

```java
SettableBooleanValue isIoSectionVisible()
```

Gets an object that allows to show/hide the io section of the mixer panel. Observers can be registered on the returned object for receiving notifications when the io section switches between shown and hidden state.

**Returns:** a boolean value object that represents the io section visibility
**Since:** API version 1

---

### `isSendSectionVisible`

```java
SettableBooleanValue isSendSectionVisible()
```

Gets an object that allows to show/hide the sends section of the mixer panel. Observers can be registered on the returned object for receiving notifications when the sends section switches between shown and hidden state.

**Returns:** a boolean value object that represents the sends section visibility
**Since:** API version 1

---

### `isClipLauncherSectionVisible`

```java
SettableBooleanValue isClipLauncherSectionVisible()
```

Gets an object that allows to show/hide the clip launcher section of the mixer panel. Observers can be registered on the returned object for receiving notifications when the clip launcher section switches between shown and hidden state.

**Returns:** a boolean value object that represents the clip launcher section visibility
**Since:** API version 1

---

### `isDeviceSectionVisible`

```java
SettableBooleanValue isDeviceSectionVisible()
```

Gets an object that allows to show/hide the devices section of the mixer panel. Observers can be registered on the returned object for receiving notifications when the devices section switches between shown and hidden state.

**Returns:** a boolean value object that represents the devices section visibility
**Since:** API version 1

---

### `isCrossFadeSectionVisible`

```java
SettableBooleanValue isCrossFadeSectionVisible()
```

Gets an object that allows to show/hide the cross-fade section of the mixer panel. Observers can be registered on the returned object for receiving notifications when the cross-fade section switches between shown and hidden state.

**Returns:** a boolean value object that represents the cross-fade section visibility
**Since:** API version 1

---

### `zoomInTrackWidthsAllAction`

```java
HardwareActionBindable zoomInTrackWidthsAllAction()
```

Zooms in all mixer tracks, if it the mixer is visible.

**Since:** API version 14

---

### `zoomInTrackWidthsAll`

```java
void zoomInTrackWidthsAll()
```

---

### `zoomOutTrackWidthsAllAction`

```java
HardwareActionBindable zoomOutTrackWidthsAllAction()
```

Zooms out all mixer tracks, if it the mixer is visible.

**Since:** API version 14

---

### `zoomOutTrackWidthsAll`

```java
void zoomOutTrackWidthsAll()
```

---

### `zoomTrackWidthsAllStepper`

```java
RelativeHardwarControlBindable zoomTrackWidthsAllStepper()
```

Same as zoomInTrackWidthsAllAction/zoomOutTrackWidthsAllAction, but as a stepper

**Since:** API version 14

---

### `zoomInTrackWidthsSelectedAction`

```java
HardwareActionBindable zoomInTrackWidthsSelectedAction()
```

Zooms in selected mixer tracks, if it the mixer is visible.

**Since:** API version 14

---

### `zoomInTrackWidthsSelected`

```java
void zoomInTrackWidthsSelected()
```

---

### `zoomOutTrackWidthsSelectedAction`

```java
HardwareActionBindable zoomOutTrackWidthsSelectedAction()
```

Zooms out selected mixer tracks, if it the mixer is visible.

**Since:** API version 14

---

### `zoomOutTrackWidthsSelected`

```java
void zoomOutTrackWidthsSelected()
```

---

### `zoomTrackWidthsSelectedStepper`

```java
RelativeHardwarControlBindable zoomTrackWidthsSelectedStepper()
```

Same as zoomInTrackWidthsSelectedAction/zoomOutTrackWidthsSelectedAction, but as a stepper

**Since:** API version 14

---

### `addMeterSectionVisibilityObserver`

```java
@Deprecated void addMeterSectionVisibilityObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the meter section is visible (callback argument is `true`) in the mixer panel or not (callback argument is `false`).

**Parameters:**
- callback - a callback function that receives a single boolean parameter.
**Since:** API version 1

---

### `addIoSectionVisibilityObserver`

```java
@Deprecated void addIoSectionVisibilityObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the IO section is visible (callback argument is `true`) in the mixer panel or not (callback argument is `false`).

**Parameters:**
- callback - a callback function that receives a single boolean parameter.
**Since:** API version 1

---

### `addSendsSectionVisibilityObserver`

```java
@Deprecated void addSendsSectionVisibilityObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the send control section is visible (callback argument is `true`) in the mixer panel or not (callback argument is `false`).

**Parameters:**
- callback - a callback function that receives a single boolean parameter.
**Since:** API version 1

---

### `addClipLauncherSectionVisibilityObserver`

```java
@Deprecated void addClipLauncherSectionVisibilityObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the clip launcher section is visible (callback argument is `true`) in the mixer panel or not (callback argument is `false`).

**Parameters:**
- callback - a callback function that receives a single boolean parameter.
**Since:** API version 1

---

### `addDeviceSectionVisibilityObserver`

```java
@Deprecated void addDeviceSectionVisibilityObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the device section is visible (callback argument is `true`) in the mixer panel or not (callback argument is `false`).

**Parameters:**
- callback - a callback function that receives a single boolean parameter.
**Since:** API version 1

---

### `addCrossFadeSectionVisibilityObserver`

```java
@Deprecated void addCrossFadeSectionVisibilityObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the cross-fade section is visible (callback argument is `true`) in the mixer panel or not (callback argument is `false`).

**Parameters:**
- callback - a callback function that receives a single boolean parameter.
**Since:** API version 1

---

### `toggleMeterSectionVisibility`

```java
@Deprecated void toggleMeterSectionVisibility()
```

Toggles the visibility of the meter section in the mixer panel.

**Since:** API version 1

---

### `toggleIoSectionVisibility`

```java
@Deprecated void toggleIoSectionVisibility()
```

Toggles the visibility of the IO section in the mixer panel.

**Since:** API version 1

---

### `toggleSendsSectionVisibility`

```java
@Deprecated void toggleSendsSectionVisibility()
```

Toggles the visibility of the send control section in the mixer panel.

**Since:** API version 1

---

### `toggleClipLauncherSectionVisibility`

```java
@Deprecated void toggleClipLauncherSectionVisibility()
```

Toggles the visibility of the clip launcher section in the mixer panel.

**Since:** API version 1

---

### `toggleDeviceSectionVisibility`

```java
@Deprecated void toggleDeviceSectionVisibility()
```

Toggles the visibility of the device section in the mixer panel.

**Since:** API version 1

---

### `toggleCrossFadeSectionVisibility`

```java
@Deprecated void toggleCrossFadeSectionVisibility()
```

Toggles the visibility of the cross-fade section in the mixer panel.

**Since:** API version 1

---

