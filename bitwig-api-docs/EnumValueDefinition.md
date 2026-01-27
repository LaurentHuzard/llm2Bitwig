# Interface EnumValueDefinition

Defines a single value from an enum.

## Method Details

### `enumDefinition`

```java
EnumDefinition enumDefinition()
```

Gets the enum definition this value belongs to.

**Since:** API version 11

---

### `getValueIndex`

```java
int getValueIndex()
```

Index of this value in the enum definition.

**Since:** API version 11

---

### `getId`

```java
String getId()
```

Identifier for this enum value. It will never change. This is the value to pass to SettableEnumValue.set(String).

**Since:** API version 11

---

### `getDisplayName`

```java
String getDisplayName()
```

This is a string that is suitable for display.

**Since:** API version 11

---

### `getLimitedDisplayName`

```java
String getLimitedDisplayName(int maxLength)
```

This is a shorter version of getDisplayName().

**Parameters:**
- maxLength - Maximum number of characters
**Since:** API version 11

---

