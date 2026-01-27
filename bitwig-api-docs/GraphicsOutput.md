# Interface GraphicsOutput

Provides 2D vector drawing API very similar to cairo graphics. Please read https://www.cairographics.org/manual/ to get a better idea of how this API works.

## Method Details

### `save`

```java
void save()
```

////////

---

### `restore`

```java
void restore()
```

---

### `clip`

```java
void clip()
```

///////////

---

### `clipPreserve`

```java
void clipPreserve()
```

---

### `resetClip`

```java
void resetClip()
```

---

### `translate`

```java
void translate(double x, double y)
```

//////////////

---

### `rotate`

```java
void rotate(double angle)
```

---

### `scale`

```java
void scale(double factor)
```

---

### `scale`

```java
void scale(double xFactor, double yFactor)
```

---

### `newPath`

```java
void newPath()
```

//////////////////

---

### `newSubPath`

```java
void newSubPath()
```

---

### `copyPath`

```java
Path copyPath()
```

---

### `copyPathFlat`

```java
Path copyPathFlat()
```

---

### `appendPath`

```java
void appendPath(Path path)
```

---

### `closePath`

```java
void closePath()
```

---

### `moveTo`

```java
void moveTo(double x, double y)
```

---

### `relMoveTo`

```java
void relMoveTo(double x, double y)
```

---

### `lineTo`

```java
void lineTo(double x, double y)
```

---

### `relLineTo`

```java
void relLineTo(double x, double y)
```

---

### `rectangle`

```java
void rectangle(double x, double y, double width, double height)
```

---

### `arc`

```java
void arc(double xc, double yc, double radius, double angle1, double angle2)
```

---

### `arcNegative`

```java
void arcNegative(double xc, double yc, double radius, double angle1, double angle2)
```

---

### `circle`

```java
void circle(double centerX, double centerY, double radius)
```

---

### `curveTo`

```java
void curveTo(double x1, double y1, double x2, double y2, double x3, double y3)
```

---

### `relCurveTo`

```java
void relCurveTo(double x1, double y1, double x2, double y2, double x3, double y3)
```

---

### `paint`

```java
void paint()
```

////////////////////////

---

### `paintWithAlpha`

```java
void paintWithAlpha(double alpha)
```

---

### `mask`

```java
void mask(Image image, double x, double y)
```

---

### `fill`

```java
void fill()
```

---

### `fillPreserve`

```java
void fillPreserve()
```

---

### `stroke`

```java
void stroke()
```

---

### `strokePreserve`

```java
void strokePreserve()
```

---

### `setColor`

```java
void setColor(double red, double green, double blue)
```

---

### `setColor`

```java
void setColor(double red, double green, double blue, double alpha)
```

---

### `setColor`

```java
void setColor(Color color)
```

---

### `setPattern`

```java
void setPattern(Pattern pattern)
```

---

### `setAntialias`

```java
void setAntialias(GraphicsOutput.AntialiasMode antialiasMode)
```

---

### `setLineWidth`

```java
void setLineWidth(double width)
```

---

### `setDash`

```java
void setDash(double[] dashes, double offset)
```

---

### `setDash`

```java
void setDash(double[] dashes)
```

---

### `setFillRule`

```java
void setFillRule(GraphicsOutput.FillRule rule)
```

---

### `setLineCap`

```java
void setLineCap(GraphicsOutput.LineCap lineCap)
```

---

### `setLineJoin`

```java
void setLineJoin(GraphicsOutput.LineJoin lineJoin)
```

---

### `setMiterLimit`

```java
void setMiterLimit(double limit)
```

---

### `setOperator`

```java
void setOperator(GraphicsOutput.Operator operator)
```

---

### `setTolerance`

```java
void setTolerance(double tolerance)
```

---

### `drawImage`

```java
void drawImage(Image image, double x, double y)
```

---

### `createLinearGradient`

```java
GradientPattern createLinearGradient(double x1, double y1, double x2, double y2)
```

///////////

---

### `createMeshGradient`

```java
MeshPattern createMeshGradient()
```

---

### `showText`

```java
void showText(String text)
```

///////

---

### `setFontSize`

```java
void setFontSize(double fontSize)
```

---

### `setFontFace`

```java
void setFontFace(FontFace fontFace)
```

---

### `setFontOptions`

```java
void setFontOptions(FontOptions fontOptions)
```

---

### `getFontExtents`

```java
FontExtents getFontExtents()
```

---

### `getTextExtents`

```java
TextExtents getTextExtents(String text)
```

---

