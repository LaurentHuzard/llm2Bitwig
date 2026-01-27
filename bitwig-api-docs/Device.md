# Interface Device

This interface represents a device in Bitwig Studio, both internal devices and plugins.

## Method Details

### `getDeviceChain`

```java
@Deprecated DeviceChain getDeviceChain()
```

Returns a representation of the device chain that contains this device. Possible device chain instances are tracks, device layers, drums pads, or FX slots.

**Returns:** the requested device chain object
**Since:** API version 1

---

### `deviceChain`

```java
DeviceChain deviceChain()
```

Returns a representation of the device chain that contains this device. Possible device chain instances are tracks, device layers, drums pads, or FX slots.

**Returns:** the requested device chain object
**Since:** API version 5

---

### `position`

```java
IntegerValue position()
```

Value that reports the position of the device within the parent device chain.

**Since:** API version 2

---

### `addPositionObserver`

```java
@Deprecated void addPositionObserver(IntegerValueChangedCallback callback)
```

Registers an observer that reports the position of the device within the parent device chain.

**Parameters:**
- callback - a callback function that receives a single integer parameter
**Since:** API version 1

---

### `isWindowOpen`

```java
SettableBooleanValue isWindowOpen()
```

Returns an object that provides access to the open state of plugin windows.

**Returns:** a boolean value object that represents the open state of the editor window, in case the device features a custom editor window (such as plugins).
**Since:** API version 1

---

### `isExpanded`

```java
SettableBooleanValue isExpanded()
```

Returns an object that provides access to the expanded state of the device.

**Returns:** a boolean value object that represents the expanded state of the device.
**Since:** API version 1

---

### `isMacroSectionVisible`

```java
@Deprecated SettableBooleanValue isMacroSectionVisible()
```

Returns an object that provides access to the visibility of the device macros section.

**Returns:** a boolean value object that represents the macro section visibility.
**Since:** API version 1

---

### `isRemoteControlsSectionVisible`

```java
SettableBooleanValue isRemoteControlsSectionVisible()
```

Returns an object that provides access to the visibility of the device remote controls section.

**Returns:** a boolean value object that represents the remote controls section visibility.
**Since:** API version 2

---

### `isParameterPageSectionVisible`

```java
@Deprecated SettableBooleanValue isParameterPageSectionVisible()
```

Returns an object that provides access to the visibility of the parameter page mapping editor.

**Returns:** a boolean value object that represents visibility of the parameter page mapping editor.
**Since:** API version 1

---

### `getParameter`

```java
@Deprecated Parameter getParameter(int indexInPage)
```

Returns the parameter with the given index in the current parameter page.

**Parameters:**
- indexInPage - the index of the parameter within the current parameter page.
**Returns:** an object that provides access to the requested parameter
**Since:** API version 1

---

### `createCursorRemoteControlsPage`

```java
CursorRemoteControlsPage createCursorRemoteControlsPage(int parameterCount)
```

Creates a cursor for the selected remote controls page in the device with the supplied number of parameters. This section will follow the current page selection made by the user in the application.

**Parameters:**
- parameterCount - The number of parameters the remote controls should contain
**Since:** API version 2

---

### `createCursorRemoteControlsPage`

```java
CursorRemoteControlsPage createCursorRemoteControlsPage(String name, int parameterCount, String filterExpression)
```

Creates a cursor for a remote controls page in the device with the supplied number of parameters. This section will be independent from the current page selected by the user in Bitwig Studio's user interface. The supplied filter is an expression that can be used to match pages this section is interested in. The expression is matched by looking at the tags added to the pages. If the expression is empty then no filtering will occur.

**Parameters:**
- name - A name to associate with this section. This will be used to remember manual mappings made by the user within this section.
**Since:** API version 2

---

### `getEnvelopeParameter`

```java
@Deprecated Parameter getEnvelopeParameter(int index)
```

Returns the parameter with the given index in the envelope parameter page.

**Parameters:**
- index - the index of the parameter within the envelope parameter page.
**Returns:** an object that provides access to the requested parameter
**Since:** API version 1

---

### `getCommonParameter`

```java
@Deprecated Parameter getCommonParameter(int index)
```

Returns the parameter with the given index in the common parameter page.

**Parameters:**
- index - the index of the parameter within the common parameter page.
**Returns:** an object that provides access to the requested parameter
**Since:** API version 1

---

### `getModulationSource`

```java
@Deprecated ModulationSource getModulationSource(int index)
```

Returns the modulation source at the given index.

**Parameters:**
- index - the index of the modulation source
**Returns:** An object that represents the requested modulation source
**Since:** API version 1

---

### `getMacro`

```java
@Deprecated Macro getMacro(int index)
```

Returns the macro control at the given index.

**Parameters:**
- index - the index of the macro control, must be in the range [0..7]
**Returns:** An object that represents the requested macro control
**Since:** API version 1

---

### `addHasSelectedDeviceObserver`

```java
@Deprecated void addHasSelectedDeviceObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the device is selected.

**Parameters:**
- callback - a callback function that receives a single boolean parameter.
**Since:** API version 1

---

### `selectInEditor`

```java
void selectInEditor()
```

Selects the device in Bitwig Studio.

**Since:** API version 1

---

### `isPlugin`

```java
BooleanValue isPlugin()
```

Value that reports if the device is a plugin.

**Since:** API version 2

---

### `addIsPluginObserver`

```java
@Deprecated void addIsPluginObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the device is a plugin.

**Parameters:**
- callback - a callback function that receives a single boolean parameter.
**Since:** API version 1

---

### `previousParameterPage`

```java
void previousParameterPage()
```

Switches to the previous parameter page.

**Since:** API version 1

---

### `nextParameterPage`

```java
void nextParameterPage()
```

Switches to the next parameter page.

**Since:** API version 1

---

### `addPreviousParameterPageEnabledObserver`

```java
void addPreviousParameterPageEnabledObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if there is a previous parameter page.

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

### `addNextParameterPageEnabledObserver`

```java
void addNextParameterPageEnabledObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if there is a next parameter page.

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

### `setParameterPage`

```java
void setParameterPage(int page)
```

Switches to the parameter page at the given page index.

**Parameters:**
- page - the index of the desired parameter page
**Since:** API version 1

---

### `switchToPreviousPreset`

```java
@Deprecated void switchToPreviousPreset()
```

Loads the previous preset.

**Since:** API version 1

---

### `switchToNextPreset`

```java
@Deprecated void switchToNextPreset()
```

Loads the next preset.

**Since:** API version 1

---

### `switchToPreviousPresetCategory`

```java
@Deprecated void switchToPreviousPresetCategory()
```

Switches to the previous preset category.

**Since:** API version 1

---

### `switchToNextPresetCategory`

```java
@Deprecated void switchToNextPresetCategory()
```

Switches to the next preset category.

**Since:** API version 1

---

### `switchToPreviousPresetCreator`

```java
@Deprecated void switchToPreviousPresetCreator()
```

Switches to the previous preset creator.

**Since:** API version 1

---

### `switchToNextPresetCreator`

```java
@Deprecated void switchToNextPresetCreator()
```

Switches to the next preset creator.

**Since:** API version 1

---

### `createDeviceBrowser`

```java
@Deprecated Browser createDeviceBrowser(int numFilterColumnEntries, int numResultsColumnEntries)
```

Returns an object used for browsing devices, presets and other content. Committing the browsing session will load or create a device from the selected resource and replace the current device.

**Parameters:**
- numFilterColumnEntries - the size of the window used to navigate the filter column entries.
**Returns:** the requested device browser object.
**Since:** API version 1

---

### `name`

```java
StringValue name()
```

Value that reports the name of the device.

**Since:** API version 2

---

### `addNameObserver`

```java
@Deprecated void addNameObserver(int len, String textWhenUnassigned, StringValueChangedCallback callback)
```

Registers an observer that reports the name of the device.

**Parameters:**
- len - the maximum length of the name. Longer names will get truncated.
**Since:** API version 1

---

### `presetName`

```java
StringValue presetName()
```

Value that reports the last loaded preset name.

**Since:** API version 2

---

### `addPresetNameObserver`

```java
@Deprecated void addPresetNameObserver(int len, String textWhenUnassigned, StringValueChangedCallback callback)
```

Registers an observer that reports the last loaded preset name.

**Parameters:**
- len - the maximum length of the name. Longer names will get truncated.
**Since:** API version 1

---

### `presetCategory`

```java
StringValue presetCategory()
```

Value that reports the current preset category name.

**Since:** API version 2

---

### `addPresetCategoryObserver`

```java
@Deprecated void addPresetCategoryObserver(int len, String textWhenUnassigned, StringValueChangedCallback callback)
```

Registers an observer that reports the current preset category name.

**Parameters:**
- len - the maximum length of the name. Longer names will get truncated.
**Since:** API version 1

---

### `presetCreator`

```java
StringValue presetCreator()
```

Value that reports the current preset creator name.

**Since:** API version 2

---

### `addPresetCreatorObserver`

```java
@Deprecated void addPresetCreatorObserver(int len, String textWhenUnassigned, StringValueChangedCallback callback)
```

Registers an observer that reports the current preset creator name.

**Parameters:**
- len - the maximum length of the name. Longer names will get truncated.
**Since:** API version 1

---

### `addSelectedPageObserver`

```java
@Deprecated void addSelectedPageObserver(int valueWhenUnassigned, IntegerValueChangedCallback callback)
```

Registers an observer that reports the currently selected parameter page.

**Parameters:**
- valueWhenUnassigned - the default page index that gets reported when the device is not associated with a device instance in Bitwig Studio yet.
**Since:** API version 1

---

### `addActiveModulationSourceObserver`

```java
@Deprecated void addActiveModulationSourceObserver(int len, String textWhenUnassigned, StringValueChangedCallback callback)
```

Registers an observer that reports the name of the active modulation source.

**Parameters:**
- len - the maximum length of the name. Longer names will get truncated.
**Since:** API version 1

---

### `addPageNamesObserver`

```java
@Deprecated void addPageNamesObserver(StringArrayValueChangedCallback callback)
```

Registers an observer that reports the names of the devices parameter pages.

**Parameters:**
- callback - a callback function that receives a single string array parameter containing the names of the parameter pages
**Since:** API version 1

---

### `addPresetNamesObserver`

```java
@Deprecated void addPresetNamesObserver(StringArrayValueChangedCallback callback)
```

Registers an observer that reports the names of the available presets for the device according to the current configuration of preset category and creator filtering.

**Parameters:**
- callback - a callback function that receives a single string array parameter containing the names of the presets for the current category and creator filter.
**Since:** API version 1

---

### `loadPreset`

```java
@Deprecated void loadPreset(int index)
```

Loads the preset with the index from the list provided by addPresetNamesObserver(StringArrayValueChangedCallback).

**Since:** API version 1

---

### `addPresetCategoriesObserver`

```java
@Deprecated void addPresetCategoriesObserver(StringArrayValueChangedCallback callback)
```

Registers an observer that reports the names of the available preset categories for the device.

**Parameters:**
- callback - a callback function that receives a single string array parameter containing the names of the preset categories
**Since:** API version 1

---

### `setPresetCategory`

```java
@Deprecated void setPresetCategory(int index)
```

Sets the preset category filter with the index from the array provided by addPresetCategoriesObserver(StringArrayValueChangedCallback).

**Since:** API version 1

---

### `addPresetCreatorsObserver`

```java
@Deprecated void addPresetCreatorsObserver(StringArrayValueChangedCallback callback)
```

Registers an observer that reports the names of the available preset creators for the device.

**Parameters:**
- callback - a callback function that receives a single string array parameter containing the names of the preset creators
**Since:** API version 1

---

### `setPresetCreator`

```java
@Deprecated void setPresetCreator(int index)
```

Sets the preset creator filter with the index from the list provided by addPresetCreatorsObserver(StringArrayValueChangedCallback).

**Since:** API version 1

---

### `toggleEnabledState`

```java
@Deprecated void toggleEnabledState()
```

Toggles the enabled state of the device.

**Since:** API version 1

---

### `isEnabled`

```java
SettableBooleanValue isEnabled()
```

Value that reports if the device is enabled.

**Since:** API version 2

---

### `addIsEnabledObserver`

```java
@Deprecated void addIsEnabledObserver(BooleanValueChangedCallback callback)
```

Registers an observer that reports if the device is enabled.

**Parameters:**
- callback - a callback function that receives a single boolean parameter
**Since:** API version 1

---

### `hasSlots`

```java
BooleanValue hasSlots()
```

Indicates if the device has nested device chain slots. Use slotNames() to get a list of available slot names, and navigate to devices in those slots using the CursorDevice interface.

**Returns:** a value object that indicates if the device has nested device chains in FX slots.
**Since:** API version 1

---

### `slotNames`

```java
StringArrayValue slotNames()
```

Value of the list of available FX slots in this device.

**Since:** API version 2

---

### `addSlotsObserver`

```java
@Deprecated void addSlotsObserver(StringArrayValueChangedCallback callback)
```

Registers an observer that gets notified when the list of available FX slots changes.

**Parameters:**
- callback - a callback function which takes a single string array argument that contains the names of the slots.
**Since:** API version 1

---

### `getCursorSlot`

```java
DeviceSlot getCursorSlot()
```

Returns an object that represents the selected device slot as shown in the user interface, and that provides access to the contents of slot's device chain.

**Returns:** the requested slot cursor object
**Since:** API version 1

---

### `isNested`

```java
BooleanValue isNested()
```

Indicates if the device is contained by another device.

**Returns:** a value object that indicates if the device is nested
**Since:** API version 1

---

### `hasLayers`

```java
BooleanValue hasLayers()
```

Indicates if the device supports nested layers.

**Returns:** a value object that indicates if the device supports nested layers.
**Since:** API version 1

---

### `hasDrumPads`

```java
BooleanValue hasDrumPads()
```

Indicates if the device has individual device chains for each note value.

**Returns:** a value object that indicates if the device has individual device chains for each note value.
**Since:** API version 1

---

### `createLayerBank`

```java
DeviceLayerBank createLayerBank(int numChannels)
```

Create a bank for navigating the nested layers of the device using a fixed-size window. This bank will work over the following devices: - Instrument Layer - Effect Layer - Instrument Selector - Effect Selector

**Parameters:**
- numChannels - the number of channels that the device layer bank should be configured with
**Returns:** a device layer bank object configured with the desired number of channels
**Since:** API version 1

---

### `createDrumPadBank`

```java
DrumPadBank createDrumPadBank(int numPads)
```

Create a bank for navigating the nested layers of the device using a fixed-size window.

**Parameters:**
- numPads - the number of channels that the drum pad bank should be configured with
**Returns:** a drum pad bank object configured with the desired number of pads
**Since:** API version 1

---

### `createCursorLayer`

```java
CursorDeviceLayer createCursorLayer()
```

Returns a device layer instance that can be used to navigate the layers or drum pads of the device, in case it has any This is the selected layer from the user interface.

**Returns:** a cursor device layer instance
**Since:** API version 1

---

### `createChainSelector`

```java
ChainSelector createChainSelector()
```

Creates a ChainSelector object which will give you control over the current device if it is an Instrument Selector or an Effect Selector. To check if the device is currently a ChainSelector, use invalid @link {@link ChainSelector.exists() }. If you want to have access to all the chains, use createLayerBank(int).

**Returns:** a chain selector instance
**Since:** API version 6

---

### `createSpecificBitwigDevice`

```java
SpecificBitwigDevice createSpecificBitwigDevice(UUID deviceId)
```

Creates an interface for accessing the features of a specific Bitwig device.

**Since:** API version 12

---

### `createSpecificVst2Device`

```java
SpecificPluginDevice createSpecificVst2Device(int deviceId)
```

Creates an interface for accessing the features of a specific VST2 device.

**Since:** API version 12

---

### `createSpecificVst2Device`

```java
SpecificPluginDevice createSpecificVst2Device(int... deviceIds)
```

Creates an interface for accessing the features of a specific VST2 device.

**Since:** API version 12

---

### `createSpecificVst3Device`

```java
SpecificPluginDevice createSpecificVst3Device(String deviceId)
```

Creates an interface for accessing the features of a specific VST2 device.

**Since:** API version 12

---

### `createSpecificVst3Device`

```java
SpecificPluginDevice createSpecificVst3Device(String... deviceIds)
```

Creates an interface for accessing the features of a specific VST2 device.

**Since:** API version 12

---

### `addDirectParameterIdObserver`

```java
void addDirectParameterIdObserver(StringArrayValueChangedCallback callback)
```

Adds an observer on a list of all parameters for the device. The callback always updates with an array containing all the IDs for the device.

**Parameters:**
- callback - function with the signature (String[])
**Since:** API version 1

---

### `addDirectParameterNameObserver`

```java
void addDirectParameterNameObserver(int maxChars, DirectParameterNameChangedCallback callback)
```

Adds an observer for the parameter names (initial and changes) of all parameters for the device.

**Parameters:**
- maxChars - maximum length of the string sent to the observer.
**Since:** API version 1

---

### `addDirectParameterValueDisplayObserver`

```java
DirectParameterValueDisplayObserver addDirectParameterValueDisplayObserver(int maxChars, DirectParameterDisplayedValueChangedCallback callback)
```

Returns an observer that reports changes of parameter display values, i.e. parameter values formatted as a string to be read by the user, for example "-6.02 dB". The returned observer object can be used to configure which parameters should be observed. By default no parameters are observed. It should be avoided to observe all parameters at the same time for performance reasons.

**Parameters:**
- maxChars - maximum length of the string sent to the observer.
**Returns:** an observer object that can be used to enable or disable actual observing for certain parameters.
**Since:** API version 1

---

### `addDirectParameterNormalizedValueObserver`

```java
void addDirectParameterNormalizedValueObserver(DirectParameterNormalizedValueChangedCallback callback)
```

Adds an observer for the parameter display value (initial and changes) of all parameters for the device.

**Parameters:**
- callback - a callback function with the signature (String ID, float normalizedValue). If the value is not accessible 'Number.NaN' (not-a-number) is reported, can be checked with 'isNaN(value)'.
**Since:** API version 1

---

### `setDirectParameterValueNormalized`

```java
void setDirectParameterValueNormalized(String id, Number value, Number resolution)
```

Sets the parameter with the specified `id` to the given `value` according to the given `resolution`.

**Parameters:**
- id - the parameter identifier string
**Since:** API version 1

---

### `incDirectParameterValueNormalized`

```java
void incDirectParameterValueNormalized(String id, Number increment, Number resolution)
```

Increases the parameter with the specified `id` by the given `increment` according to the given `resolution`. To decrease the parameter value pass in a negative increment.

**Parameters:**
- id - the parameter identifier string
**Since:** API version 1

---

### `sampleName`

```java
StringValue sampleName()
```

Value that reports the file name of the currently loaded sample, in case the device is a sample container device.

**Since:** API version 2

---

### `addSampleNameObserver`

```java
@Deprecated void addSampleNameObserver(int maxChars, String textWhenUnassigned, StringValueChangedCallback callback)
```

Registers an observer that reports the file name of the currently loaded sample, in case the device is a sample container device.

**Parameters:**
- maxChars - maximum length of the string sent to the observer.

---

### `createSiblingsDeviceBank`

```java
DeviceBank createSiblingsDeviceBank(int numDevices)
```

Returns an object that provides bank-wise navigation of sibling devices of the same device chain (including the device instance used to create the siblings bank).

**Parameters:**
- numDevices - the number of devices that are simultaneously accessible
**Returns:** the requested device bank object
**Since:** API version 1

---

### `browseToInsertBeforeDevice`

```java
@Deprecated void browseToInsertBeforeDevice()
```

Starts browsing for content that can be inserted before this device in Bitwig Studio's popup browser.

**Since:** API version 2

---

### `browseToInsertAfterDevice`

```java
@Deprecated void browseToInsertAfterDevice()
```

Starts browsing for content that can be inserted before this device in Bitwig Studio's popup browser.

**Since:** API version 2

---

### `browseToReplaceDevice`

```java
@Deprecated void browseToReplaceDevice()
```

Starts browsing for content that can replace this device in Bitwig Studio's popup browser.

**Since:** API version 2

---

### `afterDeviceInsertionPoint`

```java
InsertionPoint afterDeviceInsertionPoint()
```

InsertionPoint that can be used for inserting after this device.

**Since:** API version 7

---

### `beforeDeviceInsertionPoint`

```java
InsertionPoint beforeDeviceInsertionPoint()
```

InsertionPoint that can be used for inserting before this device.

**Since:** API version 7

---

### `replaceDeviceInsertionPoint`

```java
InsertionPoint replaceDeviceInsertionPoint()
```

InsertionPoint that can be used for replacing this device.

**Since:** API version 7

---

### `deviceType`

```java
EnumValue deviceType()
```

The type of this device.

**Since:** API version 12

---

