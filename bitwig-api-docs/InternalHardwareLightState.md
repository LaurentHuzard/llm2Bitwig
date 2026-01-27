# Class InternalHardwareLightState

Defines the current state of a MultiStateHardwareLight. What this state means is entirely up to the controller implementation. The Object.equals(Object) method MUST be overridden to compare light states correctly.

## Method Details

### `getVisualState`

```java
public abstract HardwareLightVisualState getVisualState()
```

The visual state of this light (used by Bitwig Studio to visualize the light when needed).

---

### `equals`

```java
public abstract boolean equals(Object obj)
```


---

