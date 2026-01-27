# Interface OscAddressSpace

An OSC address space. It contains the root OscContainer.

## Method Details

### `registerObjectMethods`

```java
void registerObjectMethods(String addressPrefix, Object object) throws OscInvalidArgumentTypeException
```

Register all the methods annotated with OscMethod object. Also, if a method is annotated with OscNode, this method will be called and the returned object's method will be registered.


---

### `registerMethod`

```java
void registerMethod(String address, String typeTagPattern, String desc, OscMethodCallback callback)
```

Low level way to register an Osc Method.

**Parameters:**
- address - The address to register the method at

---

### `registerDefaultMethod`

```java
void registerDefaultMethod(OscMethodCallback callback)
```

This method will be called if no registered OscMethod could handle incoming OscPacket.

---

### `setShouldLogMessages`

```java
void setShouldLogMessages(boolean shouldLogMessages)
```

Should the address spaces log the messages it dispatches? Default is false.

---

### `setName`

```java
void setName(String name)
```

This gives a display name for this address space. It is useful if you have multiple address space to identify them when we generate the documentation.

---

