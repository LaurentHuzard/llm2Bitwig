# Interface HardwareElement

Represents some physical hardware element. Hardware elements can be HardwareControls (e.g. buttons, sliders etc) or HardwareOutputElements (e.g lights, text displays etc).

## Method Details

### `getId`

```java
String getId()
```

The unique id associated with this element.

---

### `getLabel`

```java
String getLabel()
```

An optional label associated with this element.

---

### `setLabel`

```java
void setLabel(String label)
```

Sets the label for this hardware control as written on the hardware.

---

### `getLabelColor`

```java
Color getLabelColor()
```

The color of the label.

---

### `setLabelColor`

```java
void setLabelColor(Color color)
```

Sets the color of the label.

---

### `getLabelPosition`

```java
RelativePosition getLabelPosition()
```

RelativePosition that defines where the label is.

---

### `setLabelPosition`

```java
void setLabelPosition(RelativePosition position)
```

---

### `setBounds`

```java
void setBounds(double xInMM, double yInMM, double widthInMM, double heightInMM)
```

The physical bounds of this hardware element on the controller.

---

### `getX`

```java
double getX()
```

---

### `getY`

```java
double getY()
```

---

### `getWidth`

```java
double getWidth()
```

---

### `getHeight`

```java
double getHeight()
```

---

