# Interface OscConnection

This interface lets you send OscMessage through an connection which can be via Tcp, Udp, or whatever. OscPackets are sent when all the startBundle() have a matching endBundle(). If you call sendMessage() with startBundle() before, then the message will be sent directly. Our maximum packet size is 64K.

## Method Details

### `startBundle`

```java
void startBundle() throws IOException
```

Starts an OscBundle.


---

### `sendMessage`

```java
void sendMessage(String address, Object... args) throws IOException, OscInvalidArgumentTypeException
```

Supported object types: - Integer for int32 - Long for int64 - Float for float - Double for double - null for nil - Boolean for true and false - String for string - byte[] for blob


---

### `endBundle`

```java
void endBundle() throws IOException
```

Finishes the previous bundle, and if it was not inside an other bundle, it will send the message directly.


---

