# Interface CursorBrowserItem

Instances of this interface represent entries in a browser filter column.

## Method Details

### `createSiblingsBank`

```java
BrowserItemBank createSiblingsBank(int numSiblings)
```

Returns a bank object that provides access to the siblings of the cursor item. The bank will automatically scroll so that the cursor item is always visible.

**Parameters:**
- numSiblings - the number of simultaneously accessible siblings
**Returns:** the requested item bank object

---

