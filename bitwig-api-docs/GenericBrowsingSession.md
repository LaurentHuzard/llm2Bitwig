# Interface GenericBrowsingSession

Instances of this interface are used for browsing material with bank-wise access to the filter columns.

## Method Details

### `name`

```java
StringValue name()
```

Value that reports the name of the browsing session.

**Since:** API version 2

---

### `addNameObserver`

```java
@Deprecated void addNameObserver(int maxCharacters, String textWhenUnassigned, StringValueChangedCallback callback)
```

Registers an observer that reports the name of the browsing session.

**Parameters:**
- callback - a callback function that receives a single string argument.
**Since:** API version 1

---

