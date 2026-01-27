# Interface UsbDevice

Defines a USB device that is available for communication.

## Method Details

### `deviceMatcher`

```java
UsbDeviceMatcher deviceMatcher()
```

The UsbDeviceMatcher that was provided by the controller for identifying this device.


---

### `ifaces`

```java
List<UsbInterface> ifaces()
```

The list of UsbInterfaces that have been opened for this device.

---

### `iface`

```java
UsbInterface iface(int index)
```

The UsbInterface that was claimed using the UsbInterfaceMatcher defined at the corresponding index in the UsbDeviceMatcher.

---

