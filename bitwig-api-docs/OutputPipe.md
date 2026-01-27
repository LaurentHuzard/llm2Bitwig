# Interface OutputPipe

A pipe that can be used to write data.

## Method Details

### `writeAsync`

```java
void writeAsync(MemoryBlock data, AsyncTransferCompledCallback callback, int timeoutInMs)
```

Requests to write some data to this pipe in an asynchronous way (the caller is not blocked). Once some data has been written the callback will be notified on the controller's thread.

**Parameters:**
- data - A MemoryBlock containing the data to be written.

---

### `write`

```java
int write(MemoryBlock data, int timeoutInMs)
```

---

