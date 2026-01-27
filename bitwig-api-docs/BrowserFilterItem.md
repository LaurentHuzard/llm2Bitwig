# Interface BrowserFilterItem

Instances of this interface represent entries in a browser filter column.

## Method Details

### `hitCount`

```java
IntegerValue hitCount()
```

Value that reports the hit count of the filter item.

**Since:** API version 2

---

### `addHitCountObserver`

```java
@Deprecated void addHitCountObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the hit count of the filter item.

**Parameters:**
- callback - a callback function that receives a single integer parameter
**Since:** API version 1

---

