# Interface OscModule

Interface to create Osc related object.

## Method Details

### `createAddressSpace`

```java
OscAddressSpace createAddressSpace()
```

Creates a new OscAddressSpace. In short the OscAddressSpace dispatches the incoming messages to services. An OscAddressSpace is an OscService.

**Since:** API version 5

---

### `createUdpServer`

```java
void createUdpServer(int port, OscAddressSpace addressSpace)
```

Creates a new OSC Server.

**Parameters:**
- addressSpace - Use createAddressSpace()
**Since:** API version 5

---

### `createUdpServer`

```java
OscServer createUdpServer(OscAddressSpace addressSpace)
```

Creates a new OSC Server. This server is not started yet, you'll have to start it by calling server.start(port); Use this method if the port is not known during the initialization (coming from a setting) or if the port number can change at runtime.

**Parameters:**
- addressSpace - Use createAddressSpace()
**Returns:** a new OscServer
**Since:** API version 10

---

### `connectToUdpServer`

```java
OscConnection connectToUdpServer(String host, int port, OscAddressSpace addressSpace)
```

Tries to connect to an OscServer.

**Parameters:**
- addressSpace - can be null
**Returns:** a new OscConnection
**Since:** API version 5

---

