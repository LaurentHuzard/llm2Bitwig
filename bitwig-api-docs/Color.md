# Class Color

This class represents an RGBA color with each component being stored as double.

## Method Details

### `fromRGB`

```java
public static Color fromRGB(double red, double green, double blue)
```

---

### `fromRGBA`

```java
public static Color fromRGBA(double red, double green, double blue, double alpha)
```

---

### `fromRGB255`

```java
public static Color fromRGB255(int red, int green, int blue)
```

---

### `fromRGBA255`

```java
public static Color fromRGBA255(int red, int green, int blue, int alpha)
```

---

### `fromHex`

```java
public static Color fromHex(String hex)
```

---

### `mix`

```java
public static Color mix(Color c1, Color c2, double blend)
```

Mixes two colors.

**Since:** API version 4

---

### `toHex`

```java
public String toHex()
```

---

### `nullColor`

```java
public static Color nullColor()
```

---

### `blackColor`

```java
public static Color blackColor()
```

---

### `whiteColor`

```java
public static Color whiteColor()
```

---

### `getRed`

```java
public double getRed()
```

---

### `getGreen`

```java
public double getGreen()
```

---

### `getBlue`

```java
public double getBlue()
```

---

### `getAlpha`

```java
public double getAlpha()
```

---

### `getRed255`

```java
public int getRed255()
```

---

### `getGreen255`

```java
public int getGreen255()
```

---

### `getBlue255`

```java
public int getBlue255()
```

---

### `getAlpha255`

```java
public int getAlpha255()
```

---

### `toHSV`

```java
public void toHSV(double[] hsv)
```

**Parameters:**
- hsv - array of length 3. On return, the array will be set to {h, s, v} with 0 invalid input: '<'= h invalid input: '<'= 360, 0 invalid input: '<'= s invalid input: '<'= 1 and 0 invalid input: '<'= v invalid input: '<'= 1.

---

