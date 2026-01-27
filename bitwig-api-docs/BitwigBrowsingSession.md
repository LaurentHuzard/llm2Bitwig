# Interface BitwigBrowsingSession

Instances of this interface are used for browsing Bitwig Studio document such as devices, presets, multi-samples, or clips. Full access to all filter columns and the result column as shown in Bitwig Studio's contextual browser window is provided.

## Method Details

### `getCreatorFilter`

```java
BrowserFilterColumn getCreatorFilter()
```

Returns the creator filter as shown in the category column of Bitwig Studio's contextual browser.

**Returns:** the requested creator filter object.
**Since:** API version 1

---

### `getTagsFilter`

```java
BrowserFilterColumn getTagsFilter()
```

Returns the tags filter as shown in the category column of Bitwig Studio's contextual browser.

**Returns:** the requested tags filter object.
**Since:** API version 1

---

