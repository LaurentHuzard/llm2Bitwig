# Interface HardwareControl

Some kind of physical control on a piece of hardware (such as a knob, button, slider etc).

## Method Details

### `getName`

```java
String getName()
```

The name of this hardware control. This will be shown in the mapping browser, for example. It should provide enough information for the user to understand which control is being referred to. If the name is not provided then the label will be used, and if that is not provided then the id will be used.

**Since:** API version 11

---

### `setName`

```java
void setName(String name)
```

The name of this hardware control. This will be shown in the mapping browser, for example. It should provide enough information for the user to understand which control is being referred to. If the name is not provided then the label will be used, and if that is not provided then the id will be used.

**Since:** API version 11

---

### `setIndexInGroup`

```java
void setIndexInGroup(int index)
```

If this control is part of group of related controls then this specifies the index in that group. This index is used to automatically indicate a mapping color on a parameter that this hardware control gets bound to.

**Since:** API version 11

---

### `beginTouchAction`

```java
HardwareAction beginTouchAction()
```

Action that happens when the user touches this control.

---

### `endTouchAction`

```java
HardwareAction endTouchAction()
```

Action that happens when the user stops touching this control.

---

### `isBeingTouched`

```java
BooleanValue isBeingTouched()
```

Value that indicates if this control is being touched or not.

---

### `backgroundLight`

```java
HardwareLight backgroundLight()
```

Optional light that is in the background of this control.

---

### `setBackgroundLight`

```java
void setBackgroundLight(HardwareLight light)
```

Sets the optional light that is in the background of this control.

---

