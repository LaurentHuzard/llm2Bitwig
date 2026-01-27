# Interface HardwareBindingSource<HardwareBindingType extends HardwareBinding>

Represents the source of a HardwareBinding.

## Method Details

### `canBindTo`

```java
boolean canBindTo(Object target)
```

Checks if it is possible to make a binding from this source to the supplied target object.

---

### `addBinding`

```java
HardwareBindingType addBinding(HardwareBindable target)
```

Binds this source to the supplied target and returns the created binding. This can only be called if the canBindTo(Object) returns true.

---

### `clearBindings`

```java
void clearBindings()
```

Clears all bindings from this source to its targets.

---

### `setBinding`

```java
HardwareBindingType setBinding(HardwareBindable target)
```

Ensures there is a single binding to the supplied target. This is a convenience method that is equivalent to calling clearBindings() and the addBinding(HardwareBindable)

---

