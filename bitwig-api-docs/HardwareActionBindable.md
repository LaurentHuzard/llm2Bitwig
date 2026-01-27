# Interface HardwareActionBindable

Something that can be bound to a hardware action (such as user pressing a button).

## Method Details

### `addBinding`

```java
HardwareActionBinding addBinding(HardwareAction action)
```

Binds this target to the supplied HardwareAction so that when the hardware action occurs this target is invoked. When the binding is no longer needed the HardwareBinding.removeBinding() method can be called on it.

---

### `invoke`

```java
void invoke()
```

Invokes the action.

**Since:** API version 1

---

