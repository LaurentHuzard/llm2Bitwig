# Interface DeviceBrowsingSession

Instances of this interface are used for browsing devices, including access to all filter columns and the result column as shown in the 'Devices' tab of Bitwig Studio's contextual browser window.

## Method Details

### `getCategoryFilter`

```java
BrowserFilterColumn getCategoryFilter()
```

Returns the category filter as shown in the category column of the browser.

**Returns:** the requested category filter object.
**Since:** API version 1

---

### `getDeviceTypeFilter`

```java
BrowserFilterColumn getDeviceTypeFilter()
```

Returns the device type filter as shown in the category column of the browser.

**Returns:** the requested device type filter object.
**Since:** API version 1

---

### `getFileTypeFilter`

```java
BrowserFilterColumn getFileTypeFilter()
```

Returns the file type filter as shown in the category column of the browser.

**Returns:** the requested file type filter object.
**Since:** API version 1

---

