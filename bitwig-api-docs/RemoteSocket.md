# Interface RemoteSocket

Instances of this interface represent a TCP socket that other network clients can connect to, typically created by calling ControllerHost.createRemoteConnection(String, int).

## Method Details

### `setClientConnectCallback`

```java
void setClientConnectCallback(ConnectionEstablishedCallback callback)
```

Sets a callback which receives a remote connection object for each incoming connection.

**Parameters:**
- callback - a callback function which receives a single RemoteConnection argument
**Since:** API version 1

---

### `getPort`

```java
int getPort()
```

Gets the actual port used for the remote socket, which might differ from the originally requested port when calling ControllerHost.createRemoteConnection(String name, int port) in case the requested port was already used.

**Returns:** the actual port used for the remote socket
**Since:** API version 1

---

