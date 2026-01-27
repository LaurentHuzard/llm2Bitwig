# Interface Scrollable

Interface for something that can be scrolled.

## Method Details

### `scrollPosition`

```java
SettableIntegerValue scrollPosition()
```

Value that reports the current scroll position.

**Since:** API version 2

---

### `scrollIntoView`

```java
void scrollIntoView(int position)
```

Scrolls the supplied position into view if it isn't already.

**Since:** API version 7

---

### `scrollBy`

```java
void scrollBy(int amount)
```

Scrolls by a number of steps.

**Parameters:**
- amount - The number of steps to scroll by (positive is forwards and negative is backwards).

---

### `scrollForwards`

```java
default void scrollForwards()
```

Scrolls forwards by one step. This is the same as calling scrollBy(int) with 1

**Since:** API version 2

---

### `scrollForwardsAction`

```java
HardwareActionBindable scrollForwardsAction()
```

---

### `scrollBackwards`

```java
default void scrollBackwards()
```

Scrolls forwards by one step. This is the same as calling scrollBy(int) with -1

**Since:** API version 2

---

### `scrollBackwardsAction`

```java
HardwareActionBindable scrollBackwardsAction()
```

---

### `scrollByPages`

```java
void scrollByPages(int amount)
```

Scrolls by a number of pages.

**Parameters:**
- amount - The number of pages to scroll by (positive is forwards and negative is backwards).

---

### `scrollPageForwards`

```java
default void scrollPageForwards()
```

Scrolls forwards by one page.

**Since:** API version 2

---

### `scrollPageForwardsAction`

```java
HardwareActionBindable scrollPageForwardsAction()
```

---

### `scrollPageBackwards`

```java
default void scrollPageBackwards()
```

Scrolls backwards by one page.

**Since:** API version 2

---

### `scrollPageBackwardsAction`

```java
HardwareActionBindable scrollPageBackwardsAction()
```

---

### `canScrollBackwards`

```java
BooleanValue canScrollBackwards()
```

Value that reports if it is possible to scroll the bank backwards or not.

**Since:** API version 2

---

### `canScrollForwards`

```java
BooleanValue canScrollForwards()
```

Value that reports if it is possible to scroll the bank forwards or not.

**Since:** API version 2

---

