# Interface HardwareOutputElement

Represents a physical hardware element that displays some output to the user. For example, a light, some text etc

## Method Details

### `onUpdateHardware`

```java
void onUpdateHardware(Runnable sendStateRunnable)
```

Sets an optional callback for this element whenever it's state needs to be sent to the hardware. This will be called when calling HardwareSurface.updateHardware() if the state needs to be sent.

---

