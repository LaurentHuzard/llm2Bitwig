# Interface Signal

A generic interface used to implement actions or events that are not associated with a value.

## Method Details

### `addSignalObserver`

```java
void addSignalObserver(NoArgsCallback callback)
```

Registers an observer that gets notified when the signal gets fired.

**Parameters:**
- callback - a callback function that does not receive any argument.
**Since:** API version 1

---

### `fire`

```java
void fire()
```

Fires the action or event represented by the signal object.

**Since:** API version 1

---

