# Interface CursorChannel

A special kind of channel that follows a channel selection cursor in Bitwig Studio. The selection can either be a custom selection cursor that gets created by the controller script, or represent the user selection cursor as shown in the Bitwig Studio editors, such as the Arranger track selection cursor.

## Method Details

### `selectChannel`

```java
void selectChannel(Channel channel)
```

Points the cursor to the given channel.

**Parameters:**
- channel - the channel that this channel cursor should point to
**Since:** API version 1

---

