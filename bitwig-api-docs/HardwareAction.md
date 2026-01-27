# Interface HardwareAction

An action that can happen on a hardware control. For example, the user touching it, pressing it, releasing it etc.

## Method Details

### `setActionMatcher`

```java
void setActionMatcher(HardwareActionMatcher actionMatcher)
```

Sets the HardwareActionMatcher that is used to recognize when this action happens.

---

### `setPressureActionMatcher`

```java
void setPressureActionMatcher(AbsoluteHardwareValueMatcher actionMatcher)
```

Sets the AbsoluteHardwareValueMatcher that is used to recognize when this action happens and with what pressure. This is useful for a button press that is pressure sensitive. The pressure can be obtained by creating a custom action with ControllerHost.createAction(java.util.function.DoubleConsumer, java.util.function.Supplier) and then binding the created action to this HardwareAction.

---

### `isSupported`

```java
boolean isSupported()
```

Checks if this action is supported (that is, it has a HardwareActionMatcher that can detect it).

---

### `setShouldFireEvenWhenUsedAsNoteInput`

```java
void setShouldFireEvenWhenUsedAsNoteInput(boolean value)
```

Decides if this action should fire even if the hardware input that matched it was also used as note input. Note input is defined as input that matches a NoteInput mask and its event translations. Usually events should only be note input or actions but not both at the same time (this is the default state). However, occasionally it is useful for a note event to be played as both note input and also trigger some action. For example, a drum pad may play a note but in a special mode on the controller it should also select the pad somehow. In this case it would be both note input and the action that fires to select the pad.

**Since:** API version 11

---

