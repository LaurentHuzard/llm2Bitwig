# Interface DeviceChain

The foundation of all interfaces that contain devices, such as tracks, device layers, drum pads or FX slots.

## Method Details

### `selectInEditor`

```java
void selectInEditor()
```

Selects the device chain in Bitwig Studio, in case it is a selectable object.

**Since:** API version 1

---

### `name`

```java
SettableStringValue name()
```

Value that reports the name of the device chain, such as the track name or the drum pad name.

**Since:** API version 2

---

### `addNameObserver`

```java
@Deprecated void addNameObserver(int numChars, String textWhenUnassigned, StringValueChangedCallback callback)
```

Registers an observer that reports the name of the device chain, such as the track name or the drum pad name.

**Parameters:**
- numChars - the maximum number of characters used for the reported name
**Since:** API version 1

---

### `addIsSelectedInEditorObserver`

```java
void addIsSelectedInEditorObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the device chain is selected in Bitwig Studio editors.

**Parameters:**
- callback - a callback function that takes a single boolean parameter.
**Since:** API version 1

---

### `addIsSelectedObserver`

```java
@Deprecated void addIsSelectedObserver(BooleanValueChangedCallback callback)
```

**Since:** API version 1

---

### `createDeviceBank`

```java
DeviceBank createDeviceBank(int numDevices)
```

Returns an object that provides bank-wise navigation of devices.

**Parameters:**
- numDevices - the number of devices should be accessible simultaneously
**Returns:** the requested device bank object
**Since:** API version 1

---

### `createDeviceBrowser`

```java
Browser createDeviceBrowser(int numFilterColumnEntries, int numResultsColumnEntries)
```

Returns an object used for browsing devices, presets and other content. Committing the browsing session will load or create a device from the selected resource and insert it into the device chain.

**Parameters:**
- numFilterColumnEntries - the size of the window used to navigate the filter column entries.
**Returns:** the requested device browser object.
**Since:** API version 1

---

### `select`

```java
@Deprecated void select()
```

**Since:** API version 1

---

### `browseToInsertAtStartOfChain`

```java
@Deprecated void browseToInsertAtStartOfChain()
```

Starts browsing for content that can be inserted at the start of this device chain.

**Since:** API version 2

---

### `browseToInsertAtEndOfChain`

```java
@Deprecated void browseToInsertAtEndOfChain()
```

Starts browsing for content that can be inserted at the end of this device chain.

**Since:** API version 2

---

### `startOfDeviceChainInsertionPoint`

```java
InsertionPoint startOfDeviceChainInsertionPoint()
```

InsertionPoint that can be used to insert at the start of the device chain.

**Since:** API version 7

---

### `endOfDeviceChainInsertionPoint`

```java
InsertionPoint endOfDeviceChainInsertionPoint()
```

InsertionPoint that can be used to insert at the end of the device chain.

**Since:** API version 7

---

