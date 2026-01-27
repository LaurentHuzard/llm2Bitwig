# Interface DirectParameterValueDisplayObserver

This interface is used to configure observation of pretty-printed device parameter values.

## Method Details

### `setObservedParameterIds`

```java
void setObservedParameterIds(String[] parameterIds)
```

Starts observing the parameters according to the given parameter ID array, or stops observing in case `null` is passed in for the parameter ID array.

**Parameters:**
- parameterIds - the array of parameter IDs or `null` to stop observing parameter display values.
**Since:** API version 1

---

