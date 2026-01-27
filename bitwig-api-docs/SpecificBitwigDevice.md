# Interface SpecificBitwigDevice

Interface that can be used to access the parameter and output value of a specific Bitwig native device. Specific interfaces can be created by calling Device.createSpecificBitwigDevice(java.util.UUID).

## Method Details

### `createParameter`

```java
Parameter createParameter(String id)
```

Creates a Parameter that will refer to the parameter of the device with the specified parameter id.

---

### `createIntegerOutputValue`

```java
IntegerValue createIntegerOutputValue(String id)
```

Creates an IntegerValue that can be used to read a certain output value of the device.

---

