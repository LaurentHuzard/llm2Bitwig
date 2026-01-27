# Interface OnOffHardwareLight

Defines a simple hardware light that only has an on and off state.

## Method Details

### `isOn`

```java
BooleanHardwareProperty isOn()
```

Property that determines if this light is on or not.

---

### `setOnColor`

```java
default void setOnColor(Color color)
```

---

### `setOffColor`

```java
default void setOffColor(Color color)
```

---

### `setOnVisualState`

```java
void setOnVisualState(HardwareLightVisualState state)
```

---

### `setOffVisualState`

```java
void setOffVisualState(HardwareLightVisualState state)
```

---

### `setStateToVisualStateFuncation`

```java
@Deprecated void setStateToVisualStateFuncation(Function<Boolean, HardwareLightVisualState> function)
```

---

### `setStateToVisualStateFunction`

```java
void setStateToVisualStateFunction(Function<Boolean, HardwareLightVisualState> function)
```

---

