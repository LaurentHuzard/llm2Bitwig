# Interface SpecificPluginDevice

Interface that can be used to access the parameters of a specific plug-in device. Specific interfaces can be created by calling Device.createSpecificVst2Device(int) or Device.createSpecificVst3Device(String).

## Method Details

### `createParameter`

```java
Parameter createParameter(int parameterId)
```

Creates a Parameter that will refer to the parameter of the plug-in with the specified parameter id.

---

