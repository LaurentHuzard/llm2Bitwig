# Interface TimelineEditor

Shared functions between `Arranger` and `DetailEditor`

## Method Details

### `zoomInAction`

```java
HardwareActionBindable zoomInAction()
```

Zooms in the timeline, if the timeline editor is visible.

**Since:** API version 14

---

### `zoomIn`

```java
void zoomIn()
```

---

### `zoomOutAction`

```java
HardwareActionBindable zoomOutAction()
```

Zooms out the timeline, if the timeline editor is visible.

**Since:** API version 14

---

### `zoomOut`

```java
void zoomOut()
```

---

### `zoomLevel`

```java
RelativeHardwarControlBindable zoomLevel()
```

Smoothly adjusts the zoom level

---

### `zoomToFitAction`

```java
HardwareActionBindable zoomToFitAction()
```

Adjusts the zoom level of the timeline so that all content becomes visible, if the timeline editor is visible.

**Since:** API version 14

---

### `zoomToFit`

```java
void zoomToFit()
```

---

### `zoomToSelectionAction`

```java
HardwareActionBindable zoomToSelectionAction()
```

Adjusts the zoom level of the timeline so that it matches the active selection, if the timeline editor is visible.

**Since:** API version 14

---

### `zoomToSelection`

```java
void zoomToSelection()
```

---

### `zoomToFitSelectionOrAllAction`

```java
HardwareActionBindable zoomToFitSelectionOrAllAction()
```

Toggles the timeline between zoomToSelection and zoomToFit, if it is visible.

**Since:** API version 18

---

### `zoomToFitSelectionOrAll`

```java
void zoomToFitSelectionOrAll()
```

---

### `zoomToFitSelectionOrPreviousAction`

```java
HardwareActionBindable zoomToFitSelectionOrPreviousAction()
```

Toggles the timeline between zoomToSelection and the last śet zoom level, if it is visible.

**Since:** API version 18

---

### `zoomToFitSelectionOrPrevious`

```java
void zoomToFitSelectionOrPrevious()
```

---

### `getHorizontalScrollbarModel`

```java
ScrollbarModel getHorizontalScrollbarModel()
```

Get the horizontal (time) scrollbar model.

**Since:** API version 21

---

