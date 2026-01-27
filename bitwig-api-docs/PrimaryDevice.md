# Interface PrimaryDevice

A special kind of device that represents the primary device of a track.

## Method Details

### `switchToDevice`

```java
void switchToDevice(PrimaryDevice.DeviceType deviceType, PrimaryDevice.ChainLocation chainLocation)
```

Makes the device with the given type and location the new primary device.

**Parameters:**
- deviceType - the requested device type of the new primary device
**Since:** API version 1

---

### `addCanSwitchToDeviceObserver`

```java
@Deprecated void addCanSwitchToDeviceObserver(PrimaryDevice.DeviceType deviceType, PrimaryDevice.ChainLocation chainLocation, BooleanValueChangedCallback callback)
```

Registers an observer that reports if navigation to another device with the provided characteristics is possible.

**Parameters:**
- deviceType - the requested device type of the new primary device
**Since:** API version 1

---

