# Interface PopupBrowser

Object that represents the popup browser in Bitwig Studio.

## Method Details

### `title`

```java
StringValue title()
```

The title of the popup browser.

**Since:** API version 2

---

### `contentTypeNames`

```java
StringArrayValue contentTypeNames()
```

Value that reports the possible content types that can be inserted by the popup browser. These are represented by the tabs in Bitwig Studio's popup browser. (e.g "Device", "Preset", "Sample" etc.)

**Since:** API version 2

---

### `selectedContentTypeName`

```java
StringValue selectedContentTypeName()
```

Value that represents the selected content type.

**Since:** API version 2

---

### `selectedContentTypeIndex`

```java
SettableIntegerValue selectedContentTypeIndex()
```

Value that represents the index of the selected content type within the content types supported.

**Since:** API version 2

---

### `smartCollectionColumn`

```java
BrowserFilterColumn smartCollectionColumn()
```

The smart collections column of the browser.

**Since:** API version 2

---

### `locationColumn`

```java
BrowserFilterColumn locationColumn()
```

The location column of the browser.

**Since:** API version 2

---

### `deviceColumn`

```java
BrowserFilterColumn deviceColumn()
```

The device column of the browser.

**Since:** API version 2

---

### `categoryColumn`

```java
BrowserFilterColumn categoryColumn()
```

The category column of the browser.

**Since:** API version 2

---

### `tagColumn`

```java
BrowserFilterColumn tagColumn()
```

The tag column of the browser.

**Since:** API version 2

---

### `deviceTypeColumn`

```java
BrowserFilterColumn deviceTypeColumn()
```

The device type column of the browser.

**Since:** API version 2

---

### `fileTypeColumn`

```java
BrowserFilterColumn fileTypeColumn()
```

The file type column of the browser.

**Since:** API version 2

---

### `creatorColumn`

```java
BrowserFilterColumn creatorColumn()
```

The creator column of the browser.

**Since:** API version 2

---

### `resultsColumn`

```java
BrowserResultsColumn resultsColumn()
```

Column that represents the results of the search.

**Since:** API version 2

---

### `canAudition`

```java
BooleanValue canAudition()
```

Value that indicates if the browser is able to audition material in place while browsing.

**Since:** API version 2

---

### `shouldAudition`

```java
SettableBooleanValue shouldAudition()
```

Value that decides if the browser is currently auditioning material in place while browsing or not.

**Since:** API version 2

---

### `selectNextFile`

```java
void selectNextFile()
```

Selects the next file.

**Since:** API version 2

---

### `selectNextFileAction`

```java
HardwareActionBindable selectNextFileAction()
```

Action that selects the next file

**Since:** API version 15

---

### `selectPreviousFile`

```java
void selectPreviousFile()
```

Selects the previous file.

**Since:** API version 2

---

### `selectPreviousFileAction`

```java
HardwareActionBindable selectPreviousFileAction()
```

Action that selects the next file

**Since:** API version 15

---

### `selectFirstFile`

```java
void selectFirstFile()
```

Selects the first file.

**Since:** API version 2

---

### `selectLastFile`

```java
void selectLastFile()
```

Selects the last file.

**Since:** API version 2

---

### `cancel`

```java
void cancel()
```

Cancels the popup browser.

**Since:** API version 2

---

### `cancelAction`

```java
HardwareActionBindable cancelAction()
```

---

### `commit`

```java
void commit()
```

Commits the selected item in the popup browser.

**Since:** API version 2

---

### `commitAction`

```java
HardwareActionBindable commitAction()
```

---

