# Interface DrumPadBank

Drum pads are features of special Bitwig Studio devices (currently only the Bitwig Drum Machine instrument), and are also shown as sub-channels in the mixer panel. Instances of drum pad bank are configured with a fixed number of pads/channels and represent an excerpt of underlying complete list of channels. Various methods are provided for scrolling to different sections of the underlying list. It basically acts like a one-dimensional window moving over the drum pad channels. To receive an instance of drum pad bank call Device.createDrumPadBank(int numChannels).

## Method Details

### `setIndication`

```java
void setIndication(boolean shouldIndicate)
```

Specifies if the Drum Machine should visualize which pads are part of the window. By default indications are enabled.

**Parameters:**
- shouldIndicate - `true` if visual indications should be enabled, `false` otherwise
**Since:** API version 1

---

### `clearMutedPads`

```java
void clearMutedPads()
```

Clears mute on all drum pads.

**Since:** API version 10

---

### `clearSoloedPads`

```java
void clearSoloedPads()
```

Clears solo on all drum pads.

**Since:** API version 10

---

### `hasMutedPads`

```java
BooleanValue hasMutedPads()
```

True if there is one or many muted pads.

**Since:** API version 10

---

### `hasSoloedPads`

```java
BooleanValue hasSoloedPads()
```

True if there is one or many soloed pads.

**Since:** API version 10

---

