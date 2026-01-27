# Interface Action

Instances of this interface represent actions in Bitwig Studio, such as commands that can be launched from the main menu or via keyboard shortcuts. To receive the list of all actions provided by Bitwig Studio call Application.getActions(). The list of actions that belong to a certain category can be queried by calling ActionCategory.getActions(). Access to specific actions is provided in Application.getAction(String).

## Method Details

### `getId`

```java
String getId()
```

Returns a string the identifies this action uniquely.

**Returns:** the identifier string
**Since:** API version 1

---

### `getName`

```java
String getName()
```

Returns the name of this action.

**Returns:** the name string
**Since:** API version 1

---

### `getCategory`

```java
ActionCategory getCategory()
```

Returns the category of this action.

**Returns:** the category string
**Since:** API version 1

---

### `getMenuItemText`

```java
String getMenuItemText()
```

Returns the text that is displayed in menu items associated with this action.

**Returns:** the menu item text
**Since:** API version 1

---

### `invoke`

```java
void invoke()
```

Invokes the action.

**Since:** API version 1

---

