# Interface DetailEditor

An interface representing various commands which can be performed on the Bitwig Studio detail editor. To receive an instance of the application interface call ControllerHost.createDetailEditor().

## Method Details

### `zoomInLaneHeightsAction`

```java
HardwareActionBindable zoomInLaneHeightsAction()
```

Zooms in all detail editor lanes, if it the detail editor is visible.

**Since:** API version 14

---

### `zoomInLaneHeights`

```java
void zoomInLaneHeights()
```

---

### `zoomOutLaneHeightsAction`

```java
HardwareActionBindable zoomOutLaneHeightsAction()
```

Zooms out all detail editor lanes, if it the detail editor is visible.

**Since:** API version 14

---

### `zoomOutLaneHeights`

```java
void zoomOutLaneHeights()
```

---

### `zoomLaneHeightsStepper`

```java
RelativeHardwarControlBindable zoomLaneHeightsStepper()
```

Same as zoomInLaneHeightsAction/zoomOutLaneHeightsAction, but as a stepper

**Since:** API version 14

---

