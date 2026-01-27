# Interface HardwareDevice

Represents a hardware device that the user has chosen to communicate with. The hardware devices that the user needs to choose are defined by the ControllerExtensionDefinition.listHardwareDevices(HardwareDeviceMatcherList) method.

## Method Details

### `deviceMatcher`

```java
HardwareDeviceMatcher deviceMatcher()
```

The HardwareDeviceMatcher that was provided by the controller for identifying this hardware device in ControllerExtensionDefinition.listHardwareDevices(HardwareDeviceMatcherList).

---

