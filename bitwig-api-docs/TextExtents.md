# Interface TextExtents

Represent the size required to display some text.

## Method Details

### `getBearingX`

```java
double getBearingX()
```

Returns the horizontal distance from the origin to the leftmost part of the glyphs as drawn. Positive if the glyphs lie entirely to the right of the origin.

---

### `getBearingY`

```java
double getBearingY()
```

Returns the vertical distance from the origin to the topmost part of the glyphs as drawn. Positive only if the glyphs lie completely below the origin; will usually be negative.

---

### `getWidth`

```java
double getWidth()
```

Returns the width of the glyphs as drawn.

---

### `getHeight`

```java
double getHeight()
```

Returns the height of the glyphs as drawn.

---

### `getAdvanceX`

```java
double getAdvanceX()
```

Returns the distance to advance in the X direction after drawing these glyphs.

---

### `getAdvanceY`

```java
double getAdvanceY()
```

Returns the distance to advance in the Y direction after drawing these glyphs. Will typically be zero except for vertical text layout as found in East-Asian languages.

---

