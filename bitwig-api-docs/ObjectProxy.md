# Interface ObjectProxy

Interface for an object that acts as a proxy for the actual object in Bitwig Studio (for example a track, a device etc).

## Method Details

### `exists`

```java
BooleanValue exists()
```

Returns a value object that indicates if the object being proxied exists, or if it has content.

---

### `createEqualsValue`

```java
BooleanValue createEqualsValue(ObjectProxy other)
```

Creates a BooleanValue that determines this proxy is considered equal to another proxy. For this to be the case both proxies need to be proxying the same target object.

**Since:** API version 3

---

