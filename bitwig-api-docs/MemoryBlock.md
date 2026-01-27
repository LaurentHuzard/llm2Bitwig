# Interface MemoryBlock

Defines a block of memory. The memory can be read/written using a ByteBuffer provided by createByteBuffer().

## Method Details

### `size`

```java
int size()
```

The size in bytes of this memory block.

---

### `createByteBuffer`

```java
ByteBuffer createByteBuffer()
```

Creates a ByteBuffer that can be used to read/write the data at this memory block.

---

