# Class ControllerExtensionDefinition

Defines an extension that enabled a controller to work with Bitwig Studio.

## Method Details

### `toString`

```java
public String toString()
```


---

### `getHardwareVendor`

```java
public abstract String getHardwareVendor()
```

The vendor of the controller that this extension is for.

---

### `getHardwareModel`

```java
public abstract String getHardwareModel()
```

The model name of the controller that this extension is for.

---

### `getNumMidiInPorts`

```java
public abstract int getNumMidiInPorts()
```

The number of MIDI in ports that this controller extension has.

---

### `getNumMidiOutPorts`

```java
public abstract int getNumMidiOutPorts()
```

The number of MIDI out ports that this controller extension has.

---

### `getAutoDetectionMidiPortNamesList`

```java
public final AutoDetectionMidiPortNamesList getAutoDetectionMidiPortNamesList(PlatformType platformType)
```

Obtains a AutoDetectionMidiPortNamesList that defines the names of the MIDI in and out ports that can be used for auto detection of the controller for the supplied platform type.

---

### `listAutoDetectionMidiPortNames`

```java
public abstract void listAutoDetectionMidiPortNames(AutoDetectionMidiPortNamesList list, PlatformType platformType)
```

Lists the AutoDetectionMidiPortNames that defines the names of the MIDI in and out ports that can be used for auto detection of the controller for the supplied platform type.

---

### `getHardwareDeviceMatcherList`

```java
public final HardwareDeviceMatcherList getHardwareDeviceMatcherList()
```

---

### `listHardwareDevices`

```java
public void listHardwareDevices(HardwareDeviceMatcherList list)
```

Lists the hardware devices that this controller needs to function. For each device that is listed the user will see a chooser in the preferences for this extension that allows them to choose a connected device. The HardwareDeviceMatcher will also be used during auto detection to automatically add and select the device if possible.

**Since:** API version 7

---

### `createInstance`

```java
public abstract ControllerExtension createInstance(ControllerHost host)
```

Creates an instance of this extension.

---

