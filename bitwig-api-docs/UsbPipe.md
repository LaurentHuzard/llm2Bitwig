# Interface UsbPipe

Defines a pipe for talking to an endpoint on a USB device.

## Method Details

### `device`

```java
UsbDevice device()
```

The device this endpoint is on.

**Since:** API version 7

---

### `endpointMatcher`

```java
UsbEndpointMatcher endpointMatcher()
```

The UsbEndpointMatcher that was provided by the controller for identifying the endpoint to use for communication.

---

### `endpointAddress`

```java
byte endpointAddress()
```

The endpoint address on the device that this endpoint is for.

**Since:** API version 7

---

### `direction`

```java
UsbTransferDirection direction()
```

UsbTransferDirection for this pipe.

---

### `transferType`

```java
UsbTransferType transferType()
```

The UsbTransferType type that this pipe uses for communicating with the USB device.

---

