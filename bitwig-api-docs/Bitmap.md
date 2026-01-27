# Interface Bitmap

Represents a bitmap image which can be painted via render(Renderer).

## Method Details

### `getWidth`

```java
int getWidth()
```

Description copied from interface: Image


---

### `getHeight`

```java
int getHeight()
```

Description copied from interface: Image


---

### `getFormat`

```java
BitmapFormat getFormat()
```

---

### `getMemoryBlock`

```java
MemoryBlock getMemoryBlock()
```

---

### `render`

```java
void render(Renderer renderer)
```

Call this method to start painting the bitmap. This method will take care of disposing allocated patterns during the rendering.

**Since:** API version 7

---

### `showDisplayWindow`

```java
void showDisplayWindow()
```

Call this method to show a window which displays the bitmap. You should see this as a debug utility rather than a Control Surface API feature.

**Since:** API version 7

---

### `setDisplayWindowTitle`

```java
void setDisplayWindowTitle(String title)
```

Updates the display window title.

**Since:** API version 7

---

### `saveToDiskAsPPM`

```java
void saveToDiskAsPPM(String path)
```

Saves the image as a PPM file.

**Parameters:**
- path - the location of the target file.
**Since:** API version 7

---

