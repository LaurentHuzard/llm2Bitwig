# Interface CursorDevice

A special kind of selection cursor used for devices.

## Method Details

### `getChannel`

```java
@Deprecated Channel getChannel()
```

Returns the channel that this cursor device was created on. Currently this will always be a track or cursor track instance.

**Returns:** the track or cursor track object that was used for creation of this cursor device.
**Since:** API version 1

---

### `channel`

```java
Channel channel()
```

Returns the channel that this cursor device was created on. Currently this will always be a track or cursor track instance.

**Returns:** the track or cursor track object that was used for creation of this cursor device.
**Since:** API version 5

---

### `selectParent`

```java
void selectParent()
```

Selects the parent device if there is any.

**Since:** API version 1

---

### `selectDevice`

```java
void selectDevice(Device device)
```

Moves this cursor to the given device.

**Parameters:**
- device - the device that this cursor should point to
**Since:** API version 1

---

### `selectFirstInChannel`

```java
void selectFirstInChannel(Channel channel)
```

Selects the first device in the given channel.

**Parameters:**
- channel - the channel in which the device should be selected
**Since:** API version 1

---

### `selectLastInChannel`

```java
void selectLastInChannel(Channel channel)
```

Selects the last device in the given channel.

**Parameters:**
- channel - the channel in which the device should be selected
**Since:** API version 1

---

### `selectFirstInSlot`

```java
void selectFirstInSlot(String chain)
```

Selects the first device in the nested FX slot with the given name.

**Parameters:**
- chain - the name of the FX slot in which the device should be selected
**Since:** API version 1

---

### `selectLastInSlot`

```java
void selectLastInSlot(String chain)
```

Selects the last device in the nested FX slot with the given name.

**Parameters:**
- chain - the name of the FX slot in which the device should be selected
**Since:** API version 1

---

### `selectFirstInKeyPad`

```java
void selectFirstInKeyPad(int key)
```

Selects the first device in the drum pad associated with the given key.

**Parameters:**
- key - the key associated with the drum pad in which the device should be selected
**Since:** API version 1

---

### `selectLastInKeyPad`

```java
void selectLastInKeyPad(int key)
```

Selects the last device in the drum pad associated with the given key.

**Parameters:**
- key - the key associated with the drum pad in which the device should be selected
**Since:** API version 1

---

### `selectFirstInLayer`

```java
void selectFirstInLayer(int index)
```

Selects the first device in the nested layer with the given index.

**Parameters:**
- index - the index of the nested layer in which the device should be selected
**Since:** API version 1

---

### `selectLastInLayer`

```java
void selectLastInLayer(int index)
```

Selects the last device in the nested layer with the given index.

**Parameters:**
- index - the index of the nested layer in which the device should be selected
**Since:** API version 1

---

### `selectFirstInLayer`

```java
void selectFirstInLayer(String name)
```

Selects the first device in the nested layer with the given name.

**Parameters:**
- name - the name of the nested layer in which the device should be selected
**Since:** API version 1

---

### `selectLastInLayer`

```java
void selectLastInLayer(String name)
```

Selects the last device in the nested layer with the given name.

**Parameters:**
- name - the name of the nested layer in which the device should be selected
**Since:** API version 1

---

