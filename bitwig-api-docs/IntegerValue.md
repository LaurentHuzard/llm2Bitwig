# Interface IntegerValue

Adds an observer that is notified when this value changes.

## Method Details

### `get`

```java
int get()
```

Gets the current value.

**Since:** API version 2

---

### `getAsInt`

```java
default int getAsInt()
```


---

### `addValueObserver`

```java
void addValueObserver(IntegerValueChangedCallback callback, int valueWhenUnassigned)
```

Adds an observer that is notified when this value changes. This is intended to aid in backwards compatibility for drivers written to the version 1 API.

**Parameters:**
- callback - The callback to notify with the new value

---

