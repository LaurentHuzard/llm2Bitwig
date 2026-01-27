# Interface SourceSelector

Instance of this class represent sources selectors in Bitwig Studio, which are shown as choosers in the user interface and contain entries for either note inputs or audio inputs or both. The most prominent source selector in Bitwig Studio is the one shown in the track IO section, which can be accessed via the API by calling Track.getSourceSelector().

## Method Details

### `getHasNoteInputSelected`

```java
@Deprecated BooleanValue getHasNoteInputSelected()
```

Returns an object that indicates if the source selector has note inputs enabled.

**Returns:** a boolean value object
**Since:** API version 1

---

### `hasNoteInputSelected`

```java
BooleanValue hasNoteInputSelected()
```

Returns an object that indicates if the source selector has note inputs enabled.

**Returns:** a boolean value object
**Since:** API version 5

---

### `getHasAudioInputSelected`

```java
@Deprecated BooleanValue getHasAudioInputSelected()
```

Returns an object that indicates if the source selector has audio inputs enabled.

**Returns:** a boolean value object
**Since:** API version 1

---

### `hasAudioInputSelected`

```java
BooleanValue hasAudioInputSelected()
```

Returns an object that indicates if the source selector has audio inputs enabled.

**Returns:** a boolean value object
**Since:** API version 5

---

