# Interface ChannelBank<ChannelType extends Channel>

A channel bank provides access to a range of channels in Bitwig Studio, such as tracks or device layers. Instances of channel bank are typically configured with support for a fixed number of channels and represent an excerpt of a larger list of channels. Various methods are provided for scrolling to different sections of the channel list. It basically acts like a window moving over the list of channels.

## Method Details

### `getChannel`

```java
@Deprecated Channel getChannel(int indexInBank)
```

Returns the channel for the given index.

**Parameters:**
- indexInBank - the channel index within this bank, not the index within the list of all Bitwig Studio channels. Must be in the range [0..sizeOfBank-1].
**Returns:** the channel object
**Since:** API version 1

---

### `setChannelScrollStepSize`

```java
void setChannelScrollStepSize(int stepSize)
```

Sets the step size used for scrolling the channel bank.

**Parameters:**
- stepSize - the step size used for scrolling. Default is `1`.
**Since:** API version 1

---

### `scrollChannelsPageUp`

```java
@Deprecated void scrollChannelsPageUp()
```

Scrolls the channels one page up. For example if the channel bank is configured with a window size of 8 channels and is currently showing channel [1..8], calling this method would scroll the channel bank to show channel [9..16].

**Since:** API version 1

---

### `scrollChannelsPageDown`

```java
@Deprecated void scrollChannelsPageDown()
```

Scrolls the channels one page up. For example if the channel bank is configured with a window size of 8 channels and is currently showing channel [9..16], calling this method would scroll the channel bank to show channel [1..8].

**Since:** API version 1

---

### `scrollChannelsUp`

```java
@Deprecated void scrollChannelsUp()
```

Scrolls the channel window up by the amount specified via setChannelScrollStepSize(int) (by default one channel).

**Since:** API version 1

---

### `scrollChannelsDown`

```java
@Deprecated void scrollChannelsDown()
```

Scrolls the channel window down by the amount specified via setChannelScrollStepSize(int) (by default one channel).

**Since:** API version 1

---

### `scrollToChannel`

```java
@Deprecated void scrollToChannel(int position)
```

Scrolls the channel bank window so that the channel at the given position becomes visible.

**Parameters:**
- position - the index of the channel within the underlying full list of channels (not the index within the bank). The position is typically directly related to the layout of the channel list in Bitwig Studio, starting with zero in case of the first channel.
**Since:** API version 1

---

### `channelScrollPosition`

```java
@Deprecated IntegerValue channelScrollPosition()
```

Value that reports the current scroll position, more specifically the position of the first channel within the underlying list of channels, that is shown as channel zero within the bank.

**Since:** API version 2

---

### `addChannelScrollPositionObserver`

```java
@Deprecated void addChannelScrollPositionObserver(IntegerValueChangedCallback callback, int valueWhenUnassigned)
```

Registers an observer that reports the current scroll position, more specifically the position of the first channel within the underlying list of channels, that is shown as channel zero within the bank.

**Parameters:**
- callback - a callback function that receives a single integer number parameter
**Since:** API version 1

---

### `canScrollChannelsUp`

```java
BooleanValue canScrollChannelsUp()
```

Value that reports if the channel bank can be scrolled further down.

**Since:** API version 2

---

### `addCanScrollChannelsUpObserver`

```java
@Deprecated void addCanScrollChannelsUpObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the channel bank can be scrolled further up.

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

### `canScrollChannelsDown`

```java
BooleanValue canScrollChannelsDown()
```

Value that reports if the channel bank can be scrolled further down.

**Since:** API version 2

---

### `addCanScrollChannelsDownObserver`

```java
@Deprecated void addCanScrollChannelsDownObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the channel bank can be scrolled further down.

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

### `channelCount`

```java
IntegerValue channelCount()
```

Value that reports the underlying total channel count (not the number of channels available in the bank window).

**Since:** API version 2

---

### `addChannelCountObserver`

```java
@Deprecated void addChannelCountObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the underlying total channel count (not the number of channels available in the bank window).

**Parameters:**
- callback - a callback function that receives a single integer parameter
**Since:** API version 1

---

### `scrollSendsPageUp`

```java
@Deprecated void scrollSendsPageUp()
```

Scrolls the sends one page up.

**Since:** API version 1

---

### `scrollSendsPageDown`

```java
@Deprecated void scrollSendsPageDown()
```

Scrolls the sends one page down.

**Since:** API version 1

---

### `scrollSendsUp`

```java
@Deprecated void scrollSendsUp()
```

Scrolls the sends one step up.

**Since:** API version 1

---

### `scrollSendsDown`

```java
@Deprecated void scrollSendsDown()
```

Scrolls the sends one step down.

**Since:** API version 1

---

### `scrollToSend`

```java
@Deprecated void scrollToSend(int position)
```

Scrolls to the send.

**Parameters:**
- position - the index of the send.
**Since:** API version 1

---

### `addCanScrollSendsUpObserver`

```java
@Deprecated void addCanScrollSendsUpObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the sends window can be scrolled further up.

**Parameters:**
- callback - a callback function that takes a single boolean parameter
**Since:** API version 1

---

### `addCanScrollSendsDownObserver`

```java
@Deprecated void addCanScrollSendsDownObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the sends window can be scrolled further down.

**Parameters:**
- callback - a callback function that takes a single boolean parameter
**Since:** API version 1

---

### `addSendCountObserver`

```java
@Deprecated void addSendCountObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the underlying total send count (not the number of sends available in the bank window).

**Parameters:**
- callback - a callback function that receives a single integer parameter
**Since:** API version 1

---

