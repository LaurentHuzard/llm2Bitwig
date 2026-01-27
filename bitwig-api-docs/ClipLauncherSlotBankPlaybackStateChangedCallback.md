# Interface ClipLauncherSlotBankPlaybackStateChangedCallback

Registers an observer that reports the playback state of clips / slots.

## Method Details

### `playbackStateChanged`

```java
void playbackStateChanged(int slotIndex, int playbackState, boolean isQueued)
```

Registers an observer that reports the playback state of clips / slots. The reported states include `stopped`, `playing`, `recording`, but also `queued for stop`, `queued for playback`, `queued for recording`.

**Parameters:**
- playbackState - the queued or playback state: `0` when stopped, `1` when playing, or `2` when recording
**Since:** API version 1

---

