# Interface PresetBrowsingSession

Instances of this interface are used for browsing presets, including access to all filter columns and the result column as shown in the 'Presets' tab of Bitwig Studio's contextual browser window.

## Method Details

### `getCategoryFilter`

```java
BrowserFilterColumn getCategoryFilter()
```

Returns the category filter as shown in the category column of the browser.

**Returns:** the requested category filter object.
**Since:** API version 1

---

### `getPresetTypeFilter`

```java
BrowserFilterColumn getPresetTypeFilter()
```

Returns the preset type filter as shown in the category column of the browser.

**Returns:** the requested preset type filter object.
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

