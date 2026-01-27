# Interface ActionCategory

Instances of this interface are used to categorize actions in Bitwig Studio. The list of action categories provided by Bitwig Studio can be queried by calling Application.getActionCategories(). To receive a specific action category call Application.getActionCategory(String).

## Method Details

### `getId`

```java
String getId()
```

Returns a string the identifies this action category uniquely.

**Returns:** the identifier string
**Since:** API version 1

---

### `getName`

```java
String getName()
```

Returns the name of this action category.

**Returns:** the name string
**Since:** API version 1

---

### `getActions`

```java
Action[] getActions()
```

Lists all actions in this category.

**Returns:** the array of actions in this category
**Since:** API version 1

---

