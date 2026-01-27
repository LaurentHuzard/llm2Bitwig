# Interface ScrollbarModel

Interface providing detailed access to a specific scrollbar.

## Method Details

### `isZoomable`

```java
boolean isZoomable()
```

Does this ScrollbarModel support zoom?.

**Since:** API version 21

---

### `getContentPerPixel`

```java
DoubleValue getContentPerPixel()
```

Get the zoom level expressed as content units per pixel.

**Since:** API version 21

---

### `zoomAtPosition`

```java
void zoomAtPosition(double position, double distance)
```

Zoom in/out around a specific position (in content units). The distance is given in 2ˣ, so +1 implies 200% of the current level and -1 implies 50%

**Since:** API version 21

---

### `zoomToFit`

```java
void zoomToFit()
```

Adjusts the zoom level so it fits all content

**Since:** API version 21

---

### `zoomToSelection`

```java
void zoomToSelection()
```

Adjusts the zoom level so it fits the selected content

**Since:** API version 21

---

### `zoomToFitSelectionOrAll`

```java
void zoomToFitSelectionOrAll()
```

Alternate the zoom level between fitting all content or the selection

**Since:** API version 21

---

### `zoomToFitSelectionOrCurrent`

```java
void zoomToFitSelectionOrCurrent()
```

Alternate the zoom level between fitting the selected content or the previous zoom level

**Since:** API version 21

---

### `zoomToContentRegion`

```java
void zoomToContentRegion(double from, double to)
```

Set the zoom level to fit a specific content range.

**Since:** API version 21

---

