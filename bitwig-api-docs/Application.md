# Interface Application

An interface that provides methods for accessing the most common global application commands. In addition, functions are provided for accessing any application action in a generic and categorized way, pretty much as displayed in the Bitwig Studio commander dialog (see getActions(), getAction(String), getActionCategories()), getActionCategory(String)). To receive an instance of the application interface call ControllerHost.createApplication().

## Method Details

### `createAudioTrack`

```java
void createAudioTrack(int position)
```

Creates a new audio track at the given position.

**Parameters:**
- position - the index within the list of main tracks where the new track should be inserted, or `-1` in case the track should be inserted at the end of the list. Values outside the valid range will get pinned to the valid range, so the actual position might be different from the provided parameter value.
**Since:** API version 1

---

### `createInstrumentTrack`

```java
void createInstrumentTrack(int position)
```

Creates a new instrument track at the given position.

**Parameters:**
- position - the index within the list of main tracks where the new track should be inserted, or `-1` in case the track should be inserted at the end of the list. Values outside the valid range will get pinned to the valid range, so the actual position might be different from the provided parameter value.
**Since:** API version 1

---

### `createEffectTrack`

```java
void createEffectTrack(int position)
```

Creates a new effect track at the given position.

**Parameters:**
- position - the index within the list of effect tracks where the new track should be inserted, or `-1` in case the track should be inserted at the end of the list. Values outside the valid range will get pinned to the valid range, so the actual position might be different from the provided parameter value.
**Since:** API version 1

---

### `getActions`

```java
Action[] getActions()
```

Returns a list of actions that the application supports. Actions are commands in Bitwig Studio that are typically accessible through menus or keyboard shortcuts. Please note that many of the commands encapsulated by the reported actions are also accessible through other (probably more convenient) interfaces methods of the API. In contrast to that, this method provides a more generic way to find available application functionality.

**Returns:** the list of actions
**Since:** API version 1

---

### `getAction`

```java
Action getAction(String id)
```

Returns the action for the given action identifier. For a list of available actions, see getActions().

**Parameters:**
- id - the action identifier string, must not be `null`
**Returns:** the action associated with the given id, or null in case there is no action with the given identifier.
**Since:** API version 1

---

### `getActionCategories`

```java
ActionCategory[] getActionCategories()
```

Returns a list of action categories that is used by Bitwig Studio to group actions into categories.

**Returns:** the list of action categories
**Since:** API version 1

---

### `getActionCategory`

```java
ActionCategory getActionCategory(String id)
```

Returns the action category associated with the given identifier. For a list of available action categories, see getActionCategories().

**Parameters:**
- id - the category identifier string, must not be `null`
**Returns:** the action associated with the given id, or null in case there is no category with the given identifier
**Since:** API version 1

---

### `activateEngine`

```java
void activateEngine()
```

Activates the audio engine in Bitwig Studio.

**Since:** API version 1

---

### `deactivateEngine`

```java
void deactivateEngine()
```

Deactivates the audio engine in Bitwig Studio.

**Since:** API version 1

---

### `hasActiveEngine`

```java
BooleanValue hasActiveEngine()
```

Value that reports whether an audio engine is active or not.

**Since:** API version 2

---

### `addHasActiveEngineObserver`

```java
@Deprecated void addHasActiveEngineObserver(BooleanValueChangedCallback callable)
```

Registers an observer that gets called when the audio engine becomes active or inactive.

**Parameters:**
- callable - a callback function that accepts a single boolean parameter. The callback parameter indicates whether the audio engine became active (true) or inactive (false).
**Since:** API version 1

---

### `projectName`

```java
StringValue projectName()
```

Value that reports the name of the current project.

**Since:** API version 2

---

### `addProjectNameObserver`

```java
@Deprecated void addProjectNameObserver(StringValueChangedCallback callback, int maxChars)
```

Registers an observer that reports the name of the current project.

**Parameters:**
- callback - a callback function that accepts a single string parameter.
**Since:** API version 1

---

### `nextProject`

```java
void nextProject()
```

Switches to the next project tab in Bitwig Studio.

**Since:** API version 1

---

### `previousProject`

```java
void previousProject()
```

Switches to the previous project tab in Bitwig Studio.

**Since:** API version 1

---

### `navigateIntoTrackGroup`

```java
void navigateIntoTrackGroup(Track track)
```

Set BitwigStudio to navigate into the group.

**Since:** API version 2

---

### `navigateToParentTrackGroup`

```java
void navigateToParentTrackGroup()
```

Set BitwigStudio to navigate into the parent group.

**Since:** API version 2

---

### `undo`

```java
void undo()
```

Sends an undo command to Bitwig Studio.

**Since:** API version 1

---

### `undoAction`

```java
HardwareActionBindable undoAction()
```

---

### `canUndo`

```java
BooleanValue canUndo()
```

Value that reports if there is an action to undo.

**Since:** API version 15

---

### `redo`

```java
void redo()
```

Sends a redo command to Bitwig Studio.

**Since:** API version 1

---

### `redoAction`

```java
HardwareActionBindable redoAction()
```

---

### `canRedo`

```java
BooleanValue canRedo()
```

Value that reports if there is an action to redo.

**Since:** API version 15

---

### `setPanelLayout`

```java
void setPanelLayout(String panelLayout)
```

Switches the Bitwig Studio user interface to the panel layout with the given name. The list of available panel layouts depends on the active display profile.

**Parameters:**
- panelLayout - the name of the new panel layout
**Since:** API version 1

---

### `nextPanelLayout`

```java
void nextPanelLayout()
```

Switches to the next panel layout of the active display profile in Bitwig Studio.

**Since:** API version 1

---

### `previousPanelLayout`

```java
void previousPanelLayout()
```

Switches to the previous panel layout of the active display profile in Bitwig Studio.

**Since:** API version 1

---

### `panelLayout`

```java
StringValue panelLayout()
```

Value that reports the name of the active panel layout.

**Since:** API version 2

---

### `addPanelLayoutObserver`

```java
@Deprecated void addPanelLayoutObserver(StringValueChangedCallback callable, int maxChars)
```

Registers an observer that reports the name of the active panel layout.

**Parameters:**
- callable - a callback function object that accepts a single string parameter
**Since:** API version 1

---

### `displayProfile`

```java
StringValue displayProfile()
```

Value that reports the name of the active display profile.

**Since:** API version 2

---

### `addDisplayProfileObserver`

```java
@Deprecated void addDisplayProfileObserver(StringValueChangedCallback callable, int maxChars)
```

Registers an observer that reports the name of the active display profile.

**Parameters:**
- callable - a callback function object that accepts a single string parameter
**Since:** API version 1

---

### `toggleInspector`

```java
void toggleInspector()
```

Toggles the visibility of the inspector panel.

**Since:** API version 1

---

### `toggleDevices`

```java
void toggleDevices()
```

Toggles the visibility of the device chain panel.

**Since:** API version 1

---

### `toggleMixer`

```java
void toggleMixer()
```

Toggles the visibility of the mixer panel.

**Since:** API version 1

---

### `toggleNoteEditor`

```java
void toggleNoteEditor()
```

Toggles the visibility of the note editor panel.

**Since:** API version 1

---

### `toggleAutomationEditor`

```java
void toggleAutomationEditor()
```

Toggles the visibility of the automation editor panel.

**Since:** API version 1

---

### `toggleBrowserVisibility`

```java
void toggleBrowserVisibility()
```

Toggles the visibility of the browser panel.

**Since:** API version 1

---

### `previousSubPanel`

```java
void previousSubPanel()
```

Shows the previous detail panel (note editor, device, automation).

**Since:** API version 1

---

### `nextSubPanel`

```java
void nextSubPanel()
```

Shows the next detail panel (note editor, device, automation).

**Since:** API version 1

---

### `arrowKeyLeft`

```java
void arrowKeyLeft()
```

Equivalent to an Arrow-Left key stroke on the computer keyboard. The concrete functionality depends on the current keyboard focus in Bitwig Studio.

**Since:** API version 1

---

### `arrowKeyRight`

```java
void arrowKeyRight()
```

Equivalent to an Arrow-Right key stroke on the computer keyboard. The concrete functionality depends on the current keyboard focus in Bitwig Studio.

**Since:** API version 1

---

### `arrowKeyUp`

```java
void arrowKeyUp()
```

Equivalent to an Arrow-Up key stroke on the computer keyboard. The concrete functionality depends on the current keyboard focus in Bitwig Studio.

**Since:** API version 1

---

### `arrowKeyDown`

```java
void arrowKeyDown()
```

Equivalent to an Arrow-Down key stroke on the computer keyboard. The concrete functionality depends on the current keyboard focus in Bitwig Studio.

**Since:** API version 1

---

### `enter`

```java
void enter()
```

Equivalent to an Enter key stroke on the computer keyboard. The concrete functionality depends on the current keyboard focus in Bitwig Studio.

**Since:** API version 1

---

### `escape`

```java
void escape()
```

Equivalent to an Escape key stroke on the computer keyboard. The concrete functionality depends on the current keyboard focus in Bitwig Studio.

**Since:** API version 1

---

### `selectAll`

```java
void selectAll()
```

Selects all items according the current selection focus in Bitwig Studio.

**Since:** API version 1

---

### `selectAllAction`

```java
HardwareActionBindable selectAllAction()
```

---

### `selectNone`

```java
void selectNone()
```

Deselects any items according the current selection focus in Bitwig Studio.

**Since:** API version 1

---

### `selectNoneAction`

```java
HardwareActionBindable selectNoneAction()
```

---

### `selectPrevious`

```java
void selectPrevious()
```

Selects the previous item in the current selection.

**Since:** API version 10

---

### `selectPreviousAction`

```java
HardwareActionBindable selectPreviousAction()
```

---

### `selectNext`

```java
void selectNext()
```

Selects the next item in the current selection.

**Since:** API version 10

---

### `selectNextAction`

```java
HardwareActionBindable selectNextAction()
```

---

### `selectFirst`

```java
void selectFirst()
```

Selects the first item in the current selection.

**Since:** API version 10

---

### `selectFirstAction`

```java
HardwareActionBindable selectFirstAction()
```

---

### `selectLast`

```java
void selectLast()
```

Selects the last item in the current selection.

**Since:** API version 10

---

### `selectLastAction`

```java
HardwareActionBindable selectLastAction()
```

---

### `cut`

```java
void cut()
```

Cuts the selected items in Bitwig Studio if applicable.

**Since:** API version 1

---

### `cutAction`

```java
HardwareActionBindable cutAction()
```

---

### `copy`

```java
void copy()
```

Copies the selected items in Bitwig Studio to the clipboard if applicable.

**Since:** API version 1

---

### `copyAction`

```java
HardwareActionBindable copyAction()
```

---

### `paste`

```java
void paste()
```

Pastes the clipboard contents into the current selection focus in Bitwig Studio if applicable.

**Since:** API version 1

---

### `pasteAction`

```java
HardwareActionBindable pasteAction()
```

---

### `duplicate`

```java
void duplicate()
```

Duplicates the active selection in Bitwig Studio if applicable.

**Since:** API version 1

---

### `duplicateAction`

```java
HardwareActionBindable duplicateAction()
```

**Since:** API version 10

---

### `remove`

```java
void remove()
```

Deletes the selected items in Bitwig Studio if applicable. Originally this function was called `delete` (Bitwig Studio 1.0). But as `delete` is reserved in JavaScript this function got renamed to `remove` in Bitwig Studio 1.0.9.

**Since:** API version 1

---

### `removeAction`

```java
HardwareActionBindable removeAction()
```

---

### `rename`

```java
void rename()
```

Opens a text input field in Bitwig Studio for renaming the selected item.

**Since:** API version 1

---

### `zoomIn`

```java
void zoomIn()
```

Zooms in one step into the currently focused editor of the Bitwig Studio user interface.

**Since:** API version 1

---

### `zoomInAction`

```java
HardwareActionBindable zoomInAction()
```

---

### `zoomOut`

```java
void zoomOut()
```

Zooms out one step in the currently focused editor of the Bitwig Studio user interface.

**Since:** API version 1

---

### `zoomOutAction`

```java
HardwareActionBindable zoomOutAction()
```

---

### `zoomLevel`

```java
RelativeHardwarControlBindable zoomLevel()
```

Same as zoomIn/zoomOut, but as a stepper

**Since:** API version 14

---

### `zoomToSelection`

```java
void zoomToSelection()
```

Adjusts the zoom level of the currently focused editor so that it matches the active selection.

**Since:** API version 1

---

### `zoomToSelectionAction`

```java
HardwareActionBindable zoomToSelectionAction()
```

---

### `zoomToSelectionOrAll`

```java
void zoomToSelectionOrAll()
```

Toggles between zoomToSelection and zoomToFit.

**Since:** API version 10

---

### `zoomToSelectionOrAllAction`

```java
HardwareActionBindable zoomToSelectionOrAllAction()
```

---

### `zoomToSelectionOrPrevious`

```java
void zoomToSelectionOrPrevious()
```

Toggles between zoomToSelection and the last śet zoom level.

**Since:** API version 10

---

### `zoomToSelectionOrPreviousAction`

```java
HardwareActionBindable zoomToSelectionOrPreviousAction()
```

---

### `zoomToFit`

```java
void zoomToFit()
```

Adjusts the zoom level of the currently focused editor so that all content becomes visible.

**Since:** API version 1

---

### `zoomToFitAction`

```java
HardwareActionBindable zoomToFitAction()
```

---

### `focusPanelToLeft`

```java
void focusPanelToLeft()
```

Moves the panel focus to the panel on the left of the currently focused panel.

**Since:** API version 1

---

### `focusPanelToRight`

```java
void focusPanelToRight()
```

Moves the panel focus to the panel right to the currently focused panel.

**Since:** API version 1

---

### `focusPanelAbove`

```java
void focusPanelAbove()
```

Moves the panel focus to the panel above the currently focused panel.

**Since:** API version 1

---

### `focusPanelBelow`

```java
void focusPanelBelow()
```

Moves the panel focus to the panel below the currently focused panel.

**Since:** API version 1

---

### `toggleFullScreen`

```java
void toggleFullScreen()
```

Toggles between full screen and windowed user interface.

**Since:** API version 1

---

### `setPerspective`

```java
@Deprecated void setPerspective(String perspective)
```

**Since:** API version 1

---

### `nextPerspective`

```java
@Deprecated void nextPerspective()
```

**Since:** API version 1

---

### `previousPerspective`

```java
@Deprecated void previousPerspective()
```

**Since:** API version 1

---

### `addSelectedModeObserver`

```java
@Deprecated void addSelectedModeObserver(StringValueChangedCallback callable, int maxChars, String fallbackText)
```

**Since:** API version 1

---

### `recordQuantizationGrid`

```java
SettableEnumValue recordQuantizationGrid()
```

Returns the record quantization grid setting from the preferences. Possible values are "OFF", "1/32", "1/16", "1/8", "1/4".

**Since:** API version 10

---

### `recordQuantizeNoteLength`

```java
SettableBooleanValue recordQuantizeNoteLength()
```

Returns a settable value to choose if the record quantization should quantize note length.

**Since:** API version 10

---

