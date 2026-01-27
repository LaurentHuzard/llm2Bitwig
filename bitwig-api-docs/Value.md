# Interface Value<ObserverType extends ValueChangedCallback>

The common interface that is shared by all value objects in the controller API.

## Method Details

### `markInterested`

```java
void markInterested()
```

Marks this value as being of interest to the driver. This can only be called once during the driver's init method. A value that is of interest to the driver can be obtained using the value's get method. If a value has not been marked as interested then an error will be reported if the driver attempts to get the current value. Adding an observer to a value will automatically mark this value as interested.

**Since:** API version 2

---

### `addValueObserver`

```java
void addValueObserver(ObserverType callback)
```

Registers an observer that reports the current value.

**Parameters:**
- callback - a callback function that receives a single parameter
**Since:** API version 1

---

