# Interface InputPipe

A pipe that can be used to read data.

## Method Details

### `readAsync`

```java
void readAsync(MemoryBlock data, AsyncTransferCompledCallback callback, int timeoutInMs)
```

Requests to read some data from this pipe in an asynchronous way (the caller is not blocked). Once some data has been read the callback will be notified on the controller's thread.

**Parameters:**
- data - A MemoryBlock that can receive the data that is read.

---

### `read`

```java
int read(MemoryBlock data, int timeoutInMs)
```

Requests to read some data from this pipe in a synchronous way (the caller is blocked until the transfer completes).

**Parameters:**
- timeoutInMs - A timeout in milliseconds that will result in an error and termination of the controller if the read does not happen in this time. For inifinite timeout use 0.
**Returns:** The number of bytes that was read.

---

