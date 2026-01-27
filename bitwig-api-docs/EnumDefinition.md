# Interface EnumDefinition

Defines an enumeration.

## Method Details

### `getValueCount`

```java
int getValueCount()
```

Gets the number of entries in the enum, must be greater than 0.

**Since:** API version 11

---

### `valueDefinitionAt`

```java
EnumValueDefinition valueDefinitionAt(int valueIndex)
```

Gets the EnumValueDefinition for the given index.

**Parameters:**
- valueIndex - must be in the range 0 .. getValueCount() - 1.
**Returns:** null if not found
**Since:** API version 11

---

### `valueDefinitionFor`

```java
EnumValueDefinition valueDefinitionFor(String id)
```

Gets the EnumValueDefinition for the given enum id.

**Returns:** null if not found
**Since:** API version 11

---

