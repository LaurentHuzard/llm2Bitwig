# Class HardwareDeviceMatcherList

Defines a list of all the hardware devices that a controller needs.

## Method Details

### `add`

```java
public void add(HardwareDeviceMatcher... deviceMatchers)
```

Adds information about a hardware device that is needed and how it can be matched. The hardware device will need to match at least one of the supplied matchers. For each entry added to this list the user will see a device chooser that lets them select an appropriate device. The information added here is also used for auto detection purposes.

---

### `getCount`

```java
public int getCount()
```

The number of hardware devices in the list.

---

### `getHardwareDeviceMatchersAt`

```java
public HardwareDeviceMatcher[] getHardwareDeviceMatchersAt(int index)
```

---

### `getList`

```java
public List<HardwareDeviceMatcher[]> getList()
```

---

