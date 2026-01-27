# Interface DeviceBank

This interface is used for navigation of device chains in Bitwig Studio. Instances are configured with a fixed number of devices and provide access to a excerpt of the devices inside a device chain. Various methods are provided for scrolling to different sections of the device chain. It basically acts like a window moving over the devices. To receive an instance of DeviceBank call DeviceChain.createDeviceBank(int).

## Method Details

### `getDeviceChain`

```java
DeviceChain getDeviceChain()
```

Returns the object that was used to instantiate this device bank. Possible device chain instances are tracks, device layers, drums pads, or FX slots.

**Returns:** the requested device chain object
**Since:** API version 1

---

### `getDevice`

```java
Device getDevice(int indexInBank)
```

Returns the device at the given index within the bank.

**Parameters:**
- indexInBank - the device index within this bank, not the position within the device chain. Must be in the range [0..sizeOfBank-1].
**Returns:** the requested device object
**Since:** API version 1

---

### `scrollPageUp`

```java
void scrollPageUp()
```

Scrolls the device window one page up.

**Since:** API version 1

---

### `scrollPageDown`

```java
void scrollPageDown()
```

Scrolls the device window one page down.

**Since:** API version 1

---

### `scrollUp`

```java
void scrollUp()
```

Scrolls the device window one device up.

**Since:** API version 1

---

### `scrollDown`

```java
void scrollDown()
```

Scrolls the device window one device down.

**Since:** API version 1

---

### `scrollTo`

```java
@Deprecated void scrollTo(int position)
```

Makes the device with the given position visible in the track bank.

**Parameters:**
- position - the position of the device within the device chain
**Since:** API version 1

---

### `addScrollPositionObserver`

```java
@Deprecated void addScrollPositionObserver(IntegerValueChangedCallback callback, int valueWhenUnassigned)
```

Registers an observer that reports the current device scroll position.

**Parameters:**
- callback - a callback function that takes a single integer parameter
**Since:** API version 1

---

### `addCanScrollUpObserver`

```java
@Deprecated void addCanScrollUpObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the device window can be scrolled further up.

**Parameters:**
- callback - a callback function that takes a single boolean parameter
**Since:** API version 1

---

### `addCanScrollDownObserver`

```java
@Deprecated void addCanScrollDownObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the device window can be scrolled further down.

**Parameters:**
- callback - a callback function that takes a single boolean parameter
**Since:** API version 1

---

### `addDeviceCountObserver`

```java
@Deprecated void addDeviceCountObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the total device count of the device chain (not the number of devices accessible through the bank window).

**Parameters:**
- callback - a callback function that receives a single integer parameter
**Since:** API version 1

---

### `browseToInsertDevice`

```java
void browseToInsertDevice(int index)
```

Browses for content to insert a device at the given index inside this bank.

**Parameters:**
- index - the index to insert the device at. Must be >= 0 and <= Bank.getSizeOfBank().
**Since:** API version 2

---

### `setDeviceMatcher`

```java
void setDeviceMatcher(DeviceMatcher matcher)
```

Sets a DeviceMatcher that can be used to filter devices in this bank to show only those matching the supplied matcher.

**Parameters:**
- matcher - The matcher that should filter the devices or null if all devices should be matched
**Since:** API version 12

---

