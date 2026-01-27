# Interface SoloValue

Instances of this interface represent the state of a solo button.

## Method Details

### `toggle`

```java
void toggle(boolean exclusive)
```

Toggles the current solo state.

**Parameters:**
- exclusive - specifies if solo on other channels should be disabled automatically ('true') or not ('false').
**Since:** API version 1

---

### `toggleUsingPreferences`

```java
void toggleUsingPreferences(boolean negatePreferences)
```

Toggles the current solo state, using the exclusive setting from the user preferences.

**Parameters:**
- negatePreferences - If false, then toggles the solo using the exclusive behavior specified in the user preferences, ortherwise negate the preference setting.
**Since:** API version 18

---

