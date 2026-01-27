# Interface Bank<ItemType extends ObjectProxy>

A bank provides access to a range of items in Bitwig Studio. Instances of a bank are configured with a fixed number of items and represent an excerpt of a larger list of items. Various methods are provided for scrolling to different sections of the item list. It basically acts like a window moving over the list of underlying items.

## Method Details

### `getSizeOfBank`

```java
int getSizeOfBank()
```

The fixed size of this bank. This will be initially equal to the capacity of the Bank.

**Since:** API version 2

---

### `getCapacityOfBank`

```java
int getCapacityOfBank()
```

The maximum number of items in the bank which is defined when the bank is initially created.

**Since:** API version 7

---

### `setSizeOfBank`

```java
void setSizeOfBank(int size)
```

Sets the size of this bank

**Parameters:**
- size - number of items in the bank that has to be greater than 0 and less or equal to the capacity of the bank.
**Since:** API version 7

---

### `getItemAt`

```java
ItemType getItemAt(int index)
```

Gets the item in the bank at the supplied index. The index must be >= 0 and < getSizeOfBank().

**Since:** API version 2

---

### `itemCount`

```java
IntegerValue itemCount()
```

Value that reports the underlying total item count (not the number of items available in the bank window).

**Since:** API version 2

---

### `cursorIndex`

```java
SettableIntegerValue cursorIndex()
```

An integer value that defines the location of the cursor that this bank is following. If there is no cursor or the cursor is not within the bank then the value is -1.

**Since:** API version 2

---

### `setSkipDisabledItems`

```java
void setSkipDisabledItems(boolean shouldSkip)
```

Disabled items will not be accessible via the bank if set to true.

**Since:** API version 11

---

