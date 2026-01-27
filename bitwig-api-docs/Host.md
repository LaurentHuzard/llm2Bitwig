# Interface Host

Defines the interface through which an extension can talk to the host application.

## Method Details

### `getHostApiVersion`

```java
int getHostApiVersion()
```

Returns the latest supported API version of the host application.

**Returns:** the latest supported API version of the host application
**Since:** API version 1

---

### `getHostVendor`

```java
String getHostVendor()
```

Returns the vendor of the host application.

**Returns:** the vendor of the host application
**Since:** API version 1

---

### `getHostProduct`

```java
String getHostProduct()
```

Returns the product name of the host application.

**Returns:** the product name of the host application
**Since:** API version 1

---

### `getHostVersion`

```java
String getHostVersion()
```

Returns the version number of the host application.

**Returns:** the version number of the host application
**Since:** API version 1

---

### `getPlatformType`

```java
PlatformType getPlatformType()
```

The platform type that this host is running on.

---

### `setErrorReportingEMail`

```java
void setErrorReportingEMail(String address)
```

Sets an email address to use for reporting errors found in this script.

**Since:** API version 2

---

### `getOscModule`

```java
OscModule getOscModule()
```

Gets the OpenSoundControl module.

**Since:** API version 5

---

### `allocateMemoryBlock`

```java
MemoryBlock allocateMemoryBlock(int size)
```

Allocates some memory that will be automatically freed once the extension exits.

**Since:** API version 7

---

### `createBitmap`

```java
Bitmap createBitmap(int width, int height, BitmapFormat format)
```

Creates an offscreen bitmap that the extension can use to render into. The memory used by this bitmap is guaranteed to be freed once this extension exits.

**Since:** API version 7

---

### `loadFontFace`

```java
FontFace loadFontFace(String path)
```

Loads a font. The memory used by this font is guaranteed to be freed once this extension exits.

**Since:** API version 7

---

### `createFontOptions`

```java
FontOptions createFontOptions()
```

Creates a new FontOptions. This object is used to configure how the GraphicOutput will display text. The memory used by this object is guaranteed to be freed once this extension exits.

**Since:** API version 7

---

### `loadPNG`

```java
Image loadPNG(String path)
```

Loads a PNG image. The memory used by this image is guaranteed to be freed once this extension exits.

**Since:** API version 7

---

### `loadSVG`

```java
Image loadSVG(String path, double scale)
```

Loads a SVG image. The memory used by this image is guaranteed to be freed once this extension exits.

**Since:** API version 7

---

