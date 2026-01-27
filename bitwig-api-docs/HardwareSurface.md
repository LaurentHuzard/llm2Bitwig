# Interface HardwareSurface

Represents a surface that can contain HardwareElements such as HardwareButtons, HardwareSliders, MultiStateHardwareLights etc This information allows Bitwig Studio to construct a reliable physical model of the hardware. This information can be used to simulate hardware being present even when physical hardware is not available (and may also be used for other purposes in the future). To be able to simulate hardware being connected so that you can debug controllers without the real hardware you need to do the following: Create a file with the name "config.json" in your user settings directory. The location of this directory is platform dependent: On Windows: %LOCALAPPDATA%\Bitwig Studio On macOS: Library/Application Support/Bitwig/Bitwig Studio On Linux: $HOME/.BitwigStudio Then add the following line to the config.json file: extension-dev : true You will then need to restart Bitwig Studio. To simulate the controller being connected you can right click on the controller in the preferences and select "Simulate device connected". If you have also provided physical positions for various HardwareElements using HardwareElement.setBounds(double, double, double, double) then you can also see a GUI simulator for your controller by selecting "Show simulated hardware GUI".

## Method Details

### `createHardwareSlider`

```java
HardwareSlider createHardwareSlider(String id)
```

Creates a HardwareSlider that represents a physical slider on a controller.

**Parameters:**
- id - A unique string that identifies this control.
**Since:** API version 10

---

### `createHardwareSlider`

```java
HardwareSlider createHardwareSlider(String id, double currentValue)
```

Creates a HardwareSlider that represents a physical slider on a controller.

**Parameters:**
- id - A unique string that identifies this control.
**Since:** API version 15

---

### `createAbsoluteHardwareKnob`

```java
AbsoluteHardwareKnob createAbsoluteHardwareKnob(String id)
```

Creates an AbsoluteHardwareKnob that represents a physical knob on a controller that can be used to input an absolute value.

**Parameters:**
- id - A unique string that identifies this control.
**Since:** API version 10

---

### `createAbsoluteHardwareKnob`

```java
AbsoluteHardwareKnob createAbsoluteHardwareKnob(String id, double currentValue)
```

Creates an AbsoluteHardwareKnob that represents a physical knob on a controller that can be used to input an absolute value.

**Parameters:**
- id - A unique string that identifies this control.
**Since:** API version 10

---

### `createRelativeHardwareKnob`

```java
RelativeHardwareKnob createRelativeHardwareKnob(String id)
```

Creates an RelativeHardwareKnob that represents a physical knob on a controller that can be used to input a relative value change.

**Parameters:**
- id - A unique string that identifies this control.
**Since:** API version 10

---

### `createPianoKeyboard`

```java
PianoKeyboard createPianoKeyboard(String id, int numKeys, int octave, int startKeyInOctave)
```

---

### `createHardwareButton`

```java
HardwareButton createHardwareButton(String id)
```

Creates a HardwareButton that represents a physical button on a controller

**Parameters:**
- id - A unique string that identifies this control.
**Since:** API version 10

---

### `createOnOffHardwareLight`

```java
OnOffHardwareLight createOnOffHardwareLight(String id)
```

Creates a OnOffHardwareLight that represents a physical light on a controller

**Since:** API version 10

---

### `createMultiStateHardwareLight`

```java
MultiStateHardwareLight createMultiStateHardwareLight(String id)
```

Creates a MultiStateHardwareLight that represents a physical light on a controller

**Parameters:**
- id - A unique string that identifies this parameter.
**Since:** API version 10

---

### `createHardwareTextDisplay`

```java
HardwareTextDisplay createHardwareTextDisplay(String id, int numLines)
```

Creates a HardwareTextDisplay that represents a physical text display on a controller

**Parameters:**
- id - A unique string that identifies this control.
**Since:** API version 10

---

### `createHardwarePixelDisplay`

```java
HardwarePixelDisplay createHardwarePixelDisplay(String id, Bitmap bitmap)
```

Creates a HardwarePixelDisplay that displays the provided Bitmap that is rendered by the controller.

**Since:** API version 10

---

### `setPhysicalSize`

```java
void setPhysicalSize(double widthInMM, double heightInMM)
```

Sets the physical size of this controller in mm.

**Since:** API version 10

---

### `updateHardware`

```java
void updateHardware()
```

Updates the state of all HardwareOutputElements that have changed since the last time this method was called. Any onUpdateHardware callbacks that have been registered on HardwareOutputElements or HardwarePropertys will be invoked if their state/value has changed since the last time it was called. This is typically called by the control script from its flush method.

**Since:** API version 10

---

### `invalidateHardwareOutputState`

```java
void invalidateHardwareOutputState()
```

Mark all HardwareOutputElements as needing to resend their output state, regardless of it has changed or not.

---

### `hardwareControls`

```java
List<? extends HardwareControl> hardwareControls()
```

A list of all the HardwareControls that have been created on this HardwareSurface.

---

### `hardwareElementWithId`

```java
HardwareElement hardwareElementWithId(String id)
```

Finds the HardwareElement that has the supplied id or null if not found.

---

### `hardwareOutputElements`

```java
List<? extends HardwareOutputElement> hardwareOutputElements()
```

List of all HardwareElements on this HardwareSurface.

---

