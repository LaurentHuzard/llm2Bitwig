# Interface ChainSelector

This interface represents a chain selector device which can be: - instrument selector - effect selector

## Method Details

### `activeChainIndex`

```java
SettableIntegerValue activeChainIndex()
```

The index of the active chain in the chain selector. In case the chain selector has no chains or the value is not connected to the chain selector, then the value will be 0.

**Since:** API version 6

---

### `chainCount`

```java
IntegerValue chainCount()
```

The number of chains in the chain selector.

**Since:** API version 6

---

### `activeChain`

```java
DeviceLayer activeChain()
```

The active device layer.

**Since:** API version 6

---

### `cycleNext`

```java
void cycleNext()
```

Cycle to the next chain. If the current active chain is the last one, then moves to the first one.

**Since:** API version 6

---

### `cyclePrevious`

```java
void cyclePrevious()
```

Cycle to the previous chain. If the current active chain the first one, then moves to the last one.

**Since:** API version 6

---

