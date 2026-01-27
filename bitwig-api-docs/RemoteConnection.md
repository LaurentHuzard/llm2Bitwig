# Interface RemoteConnection

Instances of this interface are reported to the supplied script callback when connecting to a remote TCP socket via ControllerHost.connectToRemoteHost(String, int, ConnectionEstablishedCallback).

## Method Details

### `disconnect`

```java
void disconnect()
```

Disconnects from the remote host.

**Since:** API version 1

---

### `setDisconnectCallback`

```java
void setDisconnectCallback(NoArgsCallback callback)
```

Registers a callback function that gets called when the connection gets lost or disconnected.

**Parameters:**
- callback - a callback function that doesn't receive any parameters
**Since:** API version 1

---

### `setReceiveCallback`

```java
void setReceiveCallback(DataReceivedCallback callback)
```

Sets the callback used for receiving data. The remote connection needs a header for each message sent to it containing a 32-bit big-endian integer saying how big the rest of the message is. The data delivered to the script will not include this header.

**Parameters:**
- callback - a callback function with the signature `(byte[] data)`
**Since:** API version 1

---

### `send`

```java
void send(byte[] data) throws IOException
```

Sends data to the remote host.

**Parameters:**
- data - the byte array containing the data to be sent. When creating a numeric byte array in JavaScript, the byte values must be signed (in the range -128..127).
**Since:** API version 1

---

