# Class HardwareLightVisualState

Defines the visual state of a hardware light so that it can be visualized in Bitwig Studio's user interface. This is currently only used when simulating hardware when it is not present for debugging but it may be used for other purposes in the future.

## Method Details

### `createForColor`

```java
public static HardwareLightVisualState createForColor(Color color)
```

---

### `createForColor`

```java
public static HardwareLightVisualState createForColor(Color color, Color labelColor)
```

---

### `createBlinking`

```java
public static HardwareLightVisualState createBlinking(Color onColor, Color offColor, double onBlinkTimeInSec, double offBlinkTimeInSec)
```

---

### `createBlinking`

```java
public static HardwareLightVisualState createBlinking(Color onColor, Color offColor, Color labelOnColor, Color labelOffColor, double onBlinkTimeInSec, double offBlinkTimeInSec)
```

---

### `isBlinking`

```java
public boolean isBlinking()
```

---

### `getColor`

```java
public Color getColor()
```

---

### `getBlinkOffColor`

```java
public Color getBlinkOffColor()
```

---

### `getOffBlinkTime`

```java
public double getOffBlinkTime()
```

---

### `getOnBlinkTime`

```java
public double getOnBlinkTime()
```

---

### `getLabelColor`

```java
public Color getLabelColor()
```

---

### `getLabelBlinkOffColor`

```java
public Color getLabelBlinkOffColor()
```

---

### `hashCode`

```java
public int hashCode()
```


---

### `equals`

```java
public boolean equals(Object obj)
```


---

