# Interface Settings

This interface builds the foundation for storing custom settings in Bitwig Studio documents or in the Bitwig Studio preferences.

## Method Details

### `getSignalSetting`

```java
Signal getSignalSetting(String label, String category, String action)
```

Returns a signal setting object, which is shown a push button with the given label in Bitwig Studio.

**Parameters:**
- label - the name of the setting, must not be `null`
**Returns:** the object that encapsulates the requested signal
**Since:** API version 1

---

### `getNumberSetting`

```java
SettableRangedValue getNumberSetting(String label, String category, double minValue, double maxValue, double stepResolution, String unit, double initialValue)
```

Returns a numeric setting that is shown a number field in Bitwig Studio.

**Parameters:**
- label - the name of the setting, must not be `null`
**Returns:** the object that encapsulates the requested numeric setting
**Since:** API version 1

---

### `getEnumSetting`

```java
SettableEnumValue getEnumSetting(String label, String category, String[] options, String initialValue)
```

Returns an enumeration setting that is shown either as a chooser or as a button group in Bitwig Studio, depending on the number of provided options.

**Parameters:**
- label - the name of the setting, must not be `null`
**Returns:** the object that encapsulates the requested enum setting
**Since:** API version 1

---

### `getEnumSetting`

```java
SettableEnumValue getEnumSetting(String label, String category, EnumValueDefinition initialValue)
```

Returns an enumeration setting that is shown either as a chooser or as a button group in Bitwig Studio, depending on the number of provided options.

**Parameters:**
- label - the name of the setting, must not be `null`
**Returns:** the object that encapsulates the requested enum setting
**Since:** API version 11

---

### `getEnumSettingForValue`

```java
SettableEnumValue getEnumSettingForValue(String label, String category, SettableEnumValue value)
```

Returns an enumeration setting that is shown either as a chooser or as a button group in Bitwig Studio, depending on the number of provided options.

**Parameters:**
- label - the name of the setting, must not be `null`
**Returns:** the object that encapsulates the requested enum setting
**Since:** API version 11

---

### `getStringSetting`

```java
SettableStringValue getStringSetting(String label, String category, int numChars, String initialText)
```

Returns a textual setting that is shown as a text field in the Bitwig Studio user interface.

**Parameters:**
- label - the name of the setting, must not be `null`
**Returns:** the object that encapsulates the requested string setting
**Since:** API version 1

---

### `getColorSetting`

```java
SettableColorValue getColorSetting(String label, String category, Color initialColor)
```

Returns a color setting that is shown in the Bitwig Studio user interface.

**Parameters:**
- label - the name of the setting, must not be `null`
**Returns:** the object that encapsulates the requested string setting
**Since:** API version 5

---

### `getColorSettingForValue`

```java
SettableColorValue getColorSettingForValue(String label, String category, SettableColorValue value)
```

Returns a color setting that is shown in the Bitwig Studio user interface.

**Parameters:**
- label - the name of the setting, must not be `null`
**Returns:** the object that encapsulates the requested string setting
**Since:** API version 5

---

### `getBooleanSetting`

```java
SettableBooleanValue getBooleanSetting(String label, String category, boolean initialValue)
```

Returns a boolean setting.

**Parameters:**
- label - the name of the setting, must not be `null`
**Returns:** the object that encapsulates the requested string setting
**Since:** API version 7

---

### `getBooleanSettingForValue`

```java
SettableBooleanValue getBooleanSettingForValue(String label, String category, SettableBooleanValue value)
```

Returns an boolean setting.

**Parameters:**
- label - the name of the setting, must not be `null`
**Returns:** the object that encapsulates the requested boolean setting
**Since:** API version 11

---

