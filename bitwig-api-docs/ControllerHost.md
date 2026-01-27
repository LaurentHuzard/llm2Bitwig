# Interface ControllerHost

An interface representing the host application to the script. A singleton instance of this interface is available in the global scope of each script. The methods provided by this interface can be divided in different categories: 1. functions for registering the script in Bitwig Studio, so that it can be listed, detected and configured in the controller preferences. The methods that belong to this group are defineController(String, String, String, String, String), defineMidiPorts(int, int), defineSysexIdentityReply(String) and addDeviceNameBasedDiscoveryPair(String[], String[]). 2. functions for creating objects that provide access to the various areas of Bitwig Studio to the script. The name of those methods typically start with `create...` 3. functions for printing to the Control Surface Console, which can be opened from the `View` menu of Bitwig Studio. 4. functions for determining the name of the host application, API version, the host operating system and such. The first group of methods should be called on the global scope of the script. The function in the second and third group are typically called from the init method of the script or other handler functions. The last group is probably only required in rare cases and can be called any time.

## Method Details

### `restart`

```java
void restart()
```

Restarts this controller.

**Since:** API version 7

---

### `loadAPI`

```java
void loadAPI(int version)
```

Loads the supplied API version into the calling script. This is only intended to be called from a controller script. It cannot be called from a Java controller extension.

---

### `useBetaApi`

```java
void useBetaApi()
```

Call this method to allow your script to use Beta APIs. Beta APIs are still on development and might not be available in a future version of Bitwig Studio. Turning this flag to true, will flag your extension as being a beta extension which might not work after updating Bitwig Studio.

**Since:** API version 7

---

### `shouldFailOnDeprecatedUse`

```java
boolean shouldFailOnDeprecatedUse()
```

Determines whether the calling script should fail if it calls a deprecated method based on the API version that it requested.

---

### `setShouldFailOnDeprecatedUse`

```java
void setShouldFailOnDeprecatedUse(boolean value)
```

Sets whether the calling script should fail if it calls a deprecated method based on the API version that it requested. This is only intended to be called from a controller script. It cannot be called from a Java controller extension.

---

### `load`

```java
void load(String path)
```

Loads the script defined by the supplied path. This is only intended to be called from a controller script. It cannot be called from a Java controller extension.

---

### `platformIsWindows`

```java
boolean platformIsWindows()
```

Indicates if the host platform is Windows.

**Returns:** `true` if the host platform is Windows, `false` otherwise.
**Since:** API version 1

---

### `platformIsMac`

```java
boolean platformIsMac()
```

Indicates if the host platform is Apple Mac OS X.

**Returns:** `true` if the host platform is Mac, `false` otherwise.
**Since:** API version 1

---

### `platformIsLinux`

```java
boolean platformIsLinux()
```

Indicates if the host platform is Linux.

**Returns:** `true` if the host platform is Linux, `false` otherwise.
**Since:** API version 1

---

### `defineController`

```java
void defineController(String vendor, String name, String version, String uuid, String author)
```

Registers a controller script with the given parameters. This function must be called once at the global scope of the script.

**Parameters:**
- vendor - the name of the hardware vendor. Must not be null.
**Since:** API version 1

---

### `defineMidiPorts`

```java
void defineMidiPorts(int numInports, int numOutports)
```

Defines the number of MIDI ports for input and output that the device uses. This method should be called once in the global scope if the script is supposed to exchange MIDI messages with the device, or if the script adds entries to the MIDI input/output choosers in Bitwig Studio. After calling this method the individual port objects can be accessed using getMidiInPort(int index) and getMidiInPort(int index).

**Parameters:**
- numInports - the number of input ports
**Since:** API version 1

---

### `getMidiInPort`

```java
MidiIn getMidiInPort(int index)
```

Returns the MIDI input port with the given index.

**Parameters:**
- index - the index of the MIDI input port, must be valid.
**Returns:** the requested MIDI input port
**Since:** API version 1

---

### `getMidiOutPort`

```java
MidiOut getMidiOutPort(int index)
```

Returns the MIDI output port with the given index.

**Parameters:**
- index - the index of the MIDI output port, must be valid.
**Returns:** the requested MIDI output port
**Since:** API version 1

---

### `hardwareDevice`

```java
HardwareDevice hardwareDevice(int index)
```

Gets the HardwareDevice at the specified index. This index corresponds to the index of the HardwareDeviceMatcher specified in the ControllerExtensionDefinition.listHardwareDevices(HardwareDeviceMatcherList)

**Since:** API version 7

---

### `addDeviceNameBasedDiscoveryPair`

```java
void addDeviceNameBasedDiscoveryPair(String[] inputs, String[] outputs)
```

Registers patterns which are used to automatically detect hardware devices that can be used with the script. When the user clicks on the `detect` button in the Bitwig Studio controller preferences dialog, Bitwig Studio searches for connected controller hardware by comparing the parameters passed into this function are compared with the port names of the available MIDI drivers. Found controller scripts are automatically added with their input/output ports configured. Calling this function is optional, but can also be called multiple times in the global script scope in order to support alternative driver names.

**Parameters:**
- inputs - the array of strings used to detect MIDI input ports, must not be `null`.
**Since:** API version 1

---

### `defineSysexIdentityReply`

```java
@Deprecated void defineSysexIdentityReply(String reply)
```

Registers the `Identity Reply Universal SysEx` message (if any) that the MIDI device sends after receiving the `Identity Request Universal SysEx` message (`F0 7E 7F 06 01 F7`), as defined in the MIDI standard. This function may be called at the global scope of the script, but is optional. Please note that this function is only applicable to scripts with one MIDI input and one MIDI output. Also note that not all MIDI hardware supports SysEx identity messages.

**Parameters:**
- reply - the `Identity Reply Universal SysEx` message. Must not be null
**Since:** API version 1

---

### `getPreferences`

```java
Preferences getPreferences()
```

Creates a preferences object that can be used to insert settings into the Controller Preferences panel in Bitwig Studio.

**Returns:** an object that provides access to custom controller preferences
**Since:** API version 1

---

### `getDocumentState`

```java
DocumentState getDocumentState()
```

Creates a document state object that can be used to insert settings into the Studio I/O Panel in Bitwig Studio.

**Returns:** an object that provides access to custom document settings
**Since:** API version 1

---

### `getNotificationSettings`

```java
NotificationSettings getNotificationSettings()
```

Returns an object that is used to configure automatic notifications. Bitwig Studio supports automatic visual feedback from controllers that shows up as popup notifications. For example when the selected track or the current device preset was changed on the controller these notifications are shown, depending on your configuration.

**Returns:** a configuration object used to enable/disable the various automatic notifications supported by Bitwig Studio
**Since:** API version 1

---

### `getProject`

```java
Project getProject()
```

Returns an object for controlling various aspects of the currently selected project.

**Since:** API version 1

---

### `createTransport`

```java
Transport createTransport()
```

Returns an object for controlling and monitoring the elements of the `Transport` section in Bitwig Studio. This function should be called once during initialization of the script if transport access is desired.

**Returns:** an object that represents the `Transport` section in Bitwig Studio.
**Since:** API version 1

---

### `createGroove`

```java
Groove createGroove()
```

Returns an object for controlling and monitoring the `Groove` section in Bitwig Studio. This function should be called once during initialization of the script if groove control is desired.

**Returns:** an object that represents the `Groove` section in Bitwig Studio.
**Since:** API version 1

---

### `createApplication`

```java
Application createApplication()
```

Returns an object that provides access to general application functionality, including global view settings, the list of open projects, and other global settings that are not related to a certain document.

**Returns:** an application object.
**Since:** API version 1

---

### `createArranger`

```java
Arranger createArranger()
```

Returns an object which provides access to the `Arranger` panel of Bitwig Studio. Calling this function is equal to `createArranger(-1)`.

**Returns:** an arranger object
**Since:** API version 1

---

### `createArranger`

```java
Arranger createArranger(int window)
```

Returns an object which provides access to the `Arranger` panel inside the specified window.

**Parameters:**
- window - the index of the window where the arranger panel is shown, or -1 in case the first arranger panel found on any window should be taken
**Returns:** an arranger object
**Since:** API version 1

---

### `createMixer`

```java
Mixer createMixer()
```

Returns an object which provides access to the `Mixer` panel of Bitwig Studio. Calling this function is equal to `createMixer(-1, null)`.

**Returns:** a `Mixer` object
**Since:** API version 1

---

### `createMixer`

```java
Mixer createMixer(String panelLayout)
```

Returns an object which provides access to the `Mixer` panel that belongs to the specified panel layout. Calling this function is equal to `createMixer(-1, panelLayout)`.

**Parameters:**
- panelLayout - the name of the panel layout that contains the mixer panel, or `null` in case the selected panel layout in Bitwig Studio should be followed. Empty strings or invalid names are treated the same way as `null`. To receive the list of available panel layouts see Application.addPanelLayoutObserver(StringValueChangedCallback, int).
**Returns:** a `Mixer` object
**Since:** API version 1

---

### `createMixer`

```java
Mixer createMixer(int window)
```

Returns an object which provides access to the `Mixer` panel inside the specified window. Calling this function is equal to `createMixer(window, null)`.

**Parameters:**
- window - the index of the window where the mixer panel is shown, or -1 in case the first mixer panel found on any window should be taken
**Returns:** a `Mixer` object
**Since:** API version 1

---

### `createMixer`

```java
Mixer createMixer(String panelLayout, int window)
```

Returns an object which provides access to the `Mixer` panel that matches the specified parameters.

**Parameters:**
- panelLayout - the name of the panel layout that contains the mixer panel, or `null` in case the selected panel layout in Bitwig Studio should be followed. Empty strings or invalid names are treated the same way as `null`. To receive the list of available panel layouts see Application.addPanelLayoutObserver(StringValueChangedCallback, int).
**Returns:** a `Mixer` object
**Since:** API version 1

---

### `createDetailEditor`

```java
DetailEditor createDetailEditor()
```

Returns an object which provides access to the `DetailEditor` panel of Bitwig Studio. Calling this function is equal to `createDetailEditor(-1)`.

**Returns:** a detail editor object
**Since:** API version 14

---

### `createDetailEditor`

```java
DetailEditor createDetailEditor(int window)
```

Returns an object which provides access to the `DetailEditor` panel inside the specified window.

**Parameters:**
- window - the index of the window where the detail editor panel is shown, or -1 in case the first detail editor panel found on any window should be taken
**Returns:** a detail editor object
**Since:** API version 14

---

### `createTrackBank`

```java
TrackBank createTrackBank(int numTracks, int numSends, int numScenes)
```

Returns a track bank with the given number of tracks, sends and scenes. A track bank can be seen as a fixed-size window onto the list of tracks in the current document including their sends and scenes, that can be scrolled in order to access different parts of the track list. For example a track bank configured for 8 tracks can show track 1-8, 2-9, 3-10 and so on. The idea behind the `bank pattern` is that hardware typically is equipped with a fixed amount of channel strips or controls, for example consider a mixing console with 8 channels, but Bitwig Studio documents contain a dynamic list of tracks, most likely more tracks than the hardware can control simultaneously. The track bank returned by this function provides a convenient interface for controlling which tracks are currently shown on the hardware. Creating a track bank using this method will consider all tracks in the document, including effect tracks and the master track. Use createMainTrackBank(int, int, int) or createEffectTrackBank(int, int, int) in case you are only interested in tracks of a certain kind.

**Parameters:**
- numTracks - the number of tracks spanned by the track bank
**Returns:** an object for bank-wise navigation of tracks, sends and scenes
**Since:** API version 1

---

### `createTrackBank`

```java
TrackBank createTrackBank(int numTracks, int numSends, int numScenes, boolean hasFlatTrackList)
```

Returns a track bank with the given number of child tracks, sends and scenes. A track bank can be seen as a fixed-size window onto the list of tracks in the connected track group including their sends and scenes, that can be scrolled in order to access different parts of the track list. For example a track bank configured for 8 tracks can show track 1-8, 2-9, 3-10 and so on. The idea behind the `bank pattern` is that hardware typically is equipped with a fixed amount of channel strips or controls, for example consider a mixing console with 8 channels, but Bitwig Studio documents contain a dynamic list of tracks, most likely more tracks than the hardware can control simultaneously. The track bank returned by this function provides a convenient interface for controlling which tracks are currently shown on the hardware. Creating a track bank using this method will consider all tracks in the document, including effect tracks and the master track. Use createMainTrackBank(int, int, int) or createEffectTrackBank(int, int, int) in case you are only interested in tracks of a certain kind.

**Parameters:**
- numTracks - the number of child tracks spanned by the track bank
**Returns:** an object for bank-wise navigation of tracks, sends and scenes
**Since:** API version 1

---

### `createMainTrackBank`

```java
TrackBank createMainTrackBank(int numTracks, int numSends, int numScenes)
```

Returns a track bank with the given number of tracks, sends and scenes. Only audio tracks, instrument tracks and hybrid tracks are considered. For more information about track banks and the `bank pattern` in general, see the documentation for createTrackBank(int, int, int).

**Parameters:**
- numTracks - the number of tracks spanned by the track bank
**Returns:** an object for bank-wise navigation of tracks, sends and scenes
**Since:** API version 1

---

### `createEffectTrackBank`

```java
TrackBank createEffectTrackBank(int numTracks, int numSends, int numScenes)
```

Returns a track bank with the given number of effect tracks, sends and scenes. Only effect tracks are considered. For more information about track banks and the `bank pattern` in general, see the documentation for createTrackBank(int, int, int).

**Parameters:**
- numTracks - the number of tracks spanned by the track bank
**Returns:** an object for bank-wise navigation of tracks, sends and scenes
**Since:** API version 18

---

### `createEffectTrackBank`

```java
TrackBank createEffectTrackBank(int numTracks, int numScenes)
```

Returns a track bank with the given number of effect tracks and scenes. Only effect tracks are considered. For more information about track banks and the `bank pattern` in general, see the documentation for createTrackBank(int, int, int).

**Parameters:**
- numTracks - the number of tracks spanned by the track bank
**Returns:** an object for bank-wise navigation of tracks, sends and scenes
**Since:** API version 1

---

### `createMasterTrack`

```java
MasterTrack createMasterTrack(int numScenes)
```

Returns an object that represents the master track of the document.

**Parameters:**
- numScenes - the number of scenes for bank-wise navigation of the master tracks clip launcher slots.
**Returns:** an object representing the master track.
**Since:** API version 1

---

### `createArrangerCursorTrack`

```java
@Deprecated CursorTrack createArrangerCursorTrack(int numSends, int numScenes)
```

Returns an object that represents the cursor item of the arranger track selection.

**Parameters:**
- numSends - the number of sends for bank-wise navigation of the sends that are associated with the track selection
**Returns:** an object representing the currently selected arranger track (in the future also multiple tracks)
**Since:** API version 1

---

### `createCursorTrack`

```java
@Deprecated CursorTrack createCursorTrack(String name, int numSends, int numScenes)
```

Returns an object that represents a named cursor track, that is independent from the arranger or mixer track selection in the user interface of Bitwig Studio.

**Parameters:**
- name - the name of the track cursor
**Returns:** an object representing the currently selected arranger track (in the future also multiple tracks).
**Since:** API version 1

---

### `createCursorTrack`

```java
CursorTrack createCursorTrack(String id, String name, int numSends, int numScenes, boolean shouldFollowSelection)
```

Returns an object that represents a named cursor track, that is independent from the arranger or mixer track selection in the user interface of Bitwig Studio.

**Parameters:**
- name - the name of the track cursor
**Returns:** an object representing the currently selected arranger track (in the future also multiple tracks).
**Since:** API version 1

---

### `createSceneBank`

```java
SceneBank createSceneBank(int numScenes)
```

Returns a scene bank with the given number of scenes. A scene bank can be seen as a fixed-size window onto the list of scenes in the current document, that can be scrolled in order to access different parts of the scene list. For example a scene bank configured for 8 scenes can show scene 1-8, 2-9, 3-10 and so on. The idea behind the `bank pattern` is that hardware typically is equipped with a fixed amount of channel strips or controls, for example consider a mixing console with 8 channels, but Bitwig Studio documents contain a dynamic list of scenes, most likely more scenes than the hardware can control simultaneously. The scene bank returned by this function provides a convenient interface for controlling which scenes are currently shown on the hardware.

**Parameters:**
- numScenes - the number of scenes spanned by the track bank
**Returns:** an object for bank-wise navigation of scenes
**Since:** API version 1

---

### `createEditorCursorDevice`

```java
@Deprecated CursorDevice createEditorCursorDevice()
```

Returns an object that represents the cursor device in devices selections made by the user in Bitwig Studio. Calling this method is equal to the following code: var cursorTrack = createArrangerCursorTrack(numSends, numScenes); var cursorDevice = cursorTrack.createCursorDevice(); To create a custom device selection that is not connected to the main device selection in the user interface, call cursorTrack.createCursorDevice(String name).

**Returns:** an object representing the currently selected device.
**Since:** API version 1

---

### `createEditorCursorDevice`

```java
@Deprecated CursorDevice createEditorCursorDevice(int numSends)
```

Returns an object that represents the cursor device in devices selections made by the user in Bitwig Studio. Calling this method is equal to the following code: var cursorTrack = createArrangerCursorTrack(numSends, numScenes); var cursorDevice = cursorTrack.createCursorDevice(); To create a custom device selection that is not connected to the main device selection in the user interface, call cursorTrack.createCursorDevice(String name).

**Parameters:**
- numSends - the number of sends that are simultaneously accessible in nested channels.
**Returns:** an object representing the currently selected device.
**Since:** API version 1

---

### `createCursorClip`

```java
@Deprecated Clip createCursorClip(int gridWidth, int gridHeight)
```

**Since:** API version 1

---

### `createLauncherCursorClip`

```java
Clip createLauncherCursorClip(int gridWidth, int gridHeight)
```

Returns a clip object that represents the cursor of the launcher clip selection. The gridWidth and gridHeight parameters specify the grid dimensions used to access the note content of the clip.

**Parameters:**
- gridWidth - the number of steps spanned by one page of the note content grid.
**Returns:** an object representing the currently selected cursor clip
**Since:** API version 1

---

### `createArrangerCursorClip`

```java
Clip createArrangerCursorClip(int gridWidth, int gridHeight)
```

Returns a clip object that represents the cursor of the arranger clip selection. The gridWidth and gridHeight parameters specify the grid dimensions used to access the note content of the clip.

**Parameters:**
- gridWidth - the number of steps spanned by one page of the note content grid.
**Returns:** an object representing the currently selected cursor clip
**Since:** API version 1

---

### `createUserControls`

```java
UserControlBank createUserControls(int numControllers)
```

Returns an object that is used to define a bank of custom user controls. These controls are available to the user for free controller assignments and are typically used when bank-wise navigation is inconvenient.

**Parameters:**
- numControllers - the number of controls that are available for free assignments
**Returns:** An object that represents a set of custom user controls.
**Since:** API version 1

---

### `createLastClickedParameter`

```java
LastClickedParameter createLastClickedParameter(String id, String name)
```

The last clicked parameter in the gui. Can also be pinned

**Parameters:**
- id - used for persistent state. Extensions should use different IDs for different objects, but should try to not change IDs in between different versions.
**Since:** API version 20

---

### `scheduleTask`

```java
@Deprecated void scheduleTask(Object callback, Object[] args, long delay)
```

Schedules the given callback function for execution after the given delay. For timer applications call this method once initially and then from within the callback function.

**Parameters:**
- callback - the callback function that will be called
**Since:** API version 1

---

### `scheduleTask`

```java
void scheduleTask(Runnable callback, long delay)
```

Schedules the given callback function for execution after the given delay. For timer applications call this method once initially and then from within the callback function.

**Parameters:**
- callback - the callback function that will be called
**Since:** API version 2

---

### `requestFlush`

```java
void requestFlush()
```

Requests that the driver's flush method gets called.

**Since:** API version 2

---

### `println`

```java
void println(String s)
```

Prints the given string in the control surface console window. The console window can be opened in the view menu of Bitwig Studio.

**Parameters:**
- s - the string to be printed
**Since:** API version 1

---

### `errorln`

```java
void errorln(String s)
```

Prints the given string in the control surface console window using a text style that highlights the string as error. The console window can be opened in the view menu of Bitwig Studio.

**Parameters:**
- s - the error string to be printed
**Since:** API version 1

---

### `showPopupNotification`

```java
void showPopupNotification(String text)
```

Shows a temporary text overlay on top of the application GUI, that will fade-out after a short interval. If the overlay is already shown, it will get updated with the given text.

**Parameters:**
- text - the text to be shown
**Since:** API version 1

---

### `createRemoteConnection`

```java
RemoteSocket createRemoteConnection(String name, int defaultPort)
```

Opens a TCP (Transmission Control Protocol) host socket for allowing network connections from other hardware and software.

**Parameters:**
- name - a meaningful name that describes the purpose of this connection.
**Returns:** the object that represents the socket
**Since:** API version 1

---

### `connectToRemoteHost`

```java
void connectToRemoteHost(String host, int port, ConnectionEstablishedCallback callback)
```

Connects to a remote TCP (Transmission Control Protocol) socket.

**Parameters:**
- host - the host name or IP address to connect to.
**Since:** API version 1

---

### `sendDatagramPacket`

```java
void sendDatagramPacket(String host, int port, byte[] data)
```

Sends a UDP (User Datagram Protocol) packet with the given data to the specified host.

**Parameters:**
- host - the destination host name or IP address
**Since:** API version 1

---

### `addDatagramPacketObserver`

```java
boolean addDatagramPacketObserver(String name, int port, DataReceivedCallback callback)
```

Adds an observer for incoming UDP (User Datagram Protocol) packets on the selected port.

**Parameters:**
- name - a meaningful name that describes the purpose of this observer.
**Returns:** true if was possible to bind the port, false otherwise
**Since:** API version 1

---

### `defineController`

```java
@Deprecated void defineController(String vendor, String name, String version, String uuid)
```

**Since:** API version 1

---

### `createTransportSection`

```java
@Deprecated Transport createTransportSection()
```

**Since:** API version 1

---

### `createCursorTrack`

```java
CursorTrack createCursorTrack(int numSends, int numScenes)
```

**Since:** API version 1

---

### `createGrooveSection`

```java
@Deprecated Groove createGrooveSection()
```

**Since:** API version 1

---

### `createApplicationSection`

```java
@Deprecated Application createApplicationSection()
```

**Since:** API version 1

---

### `createArrangerSection`

```java
@Deprecated Arranger createArrangerSection(int screenIndex)
```

**Since:** API version 1

---

### `createMixerSection`

```java
@Deprecated Mixer createMixerSection(String perspective, int screenIndex)
```

**Since:** API version 1

---

### `createTrackBankSection`

```java
@Deprecated TrackBank createTrackBankSection(int numTracks, int numSends, int numScenes)
```

**Since:** API version 1

---

### `createMainTrackBankSection`

```java
@Deprecated TrackBank createMainTrackBankSection(int numTracks, int numSends, int numScenes)
```

**Since:** API version 1

---

### `createEffectTrackBankSection`

```java
@Deprecated TrackBank createEffectTrackBankSection(int numTracks, int numScenes)
```

**Since:** API version 1

---

### `createCursorTrackSection`

```java
@Deprecated CursorTrack createCursorTrackSection(int numSends, int numScenes)
```

**Since:** API version 1

---

### `createMasterTrackSection`

```java
@Deprecated Track createMasterTrackSection(int numScenes)
```

**Since:** API version 1

---

### `createCursorClipSection`

```java
@Deprecated Clip createCursorClipSection(int gridWidth, int gridHeight)
```

**Since:** API version 1

---

### `createCursorDeviceSection`

```java
@Deprecated CursorDevice createCursorDeviceSection(int numControllers)
```

**Since:** API version 1

---

### `createCursorDevice`

```java
@Deprecated CursorDevice createCursorDevice()
```

**Since:** API version 1

---

### `createUserControlsSection`

```java
@Deprecated UserControlBank createUserControlsSection(int numControllers)
```

**Since:** API version 1

---

### `defineSysexDiscovery`

```java
@Deprecated void defineSysexDiscovery(String request, String reply)
```

**Since:** API version 1

---

### `createPopupBrowser`

```java
PopupBrowser createPopupBrowser()
```

Creates a PopupBrowser that represents the pop-up browser in Bitwig Studio.

**Since:** API version 2

---

### `defaultBeatTimeFormatter`

```java
BeatTimeFormatter defaultBeatTimeFormatter()
```

BeatTimeFormatter used to format beat times by default. This will be used to format beat times when asking for a beat time in string format without providing any formatting options. For example by calling DoubleValue.get().

**Since:** API version 2

---

### `setDefaultBeatTimeFormatter`

```java
void setDefaultBeatTimeFormatter(BeatTimeFormatter formatter)
```

Sets the BeatTimeFormatter to use by default for formatting beat times.

**Since:** API version 2

---

### `createBeatTimeFormatter`

```java
BeatTimeFormatter createBeatTimeFormatter(String separator, int barsLen, int beatsLen, int subdivisionLen, int ticksLen)
```

Creates a BeatTimeFormatter that can be used to format beat times.

**Parameters:**
- separator - the character used to separate the segments of the formatted beat time, typically ":", "." or "-"
**Since:** API version 2

---

### `createHardwareSurface`

```java
HardwareSurface createHardwareSurface()
```

Creates a HardwareSurface that can contain hardware controls.

**Since:** API version 10

---

### `createOrHardwareActionMatcher`

```java
HardwareActionMatcher createOrHardwareActionMatcher(HardwareActionMatcher matcher1, HardwareActionMatcher matcher2)
```

Creates a HardwareActionMatcher that is matched by either of the 2 supplied action matchers.

**Since:** API version 10

---

### `createOrRelativeHardwareValueMatcher`

```java
RelativeHardwareValueMatcher createOrRelativeHardwareValueMatcher(RelativeHardwareValueMatcher matcher1, RelativeHardwareValueMatcher matcher2)
```

Creates a RelativeHardwareValueMatcher that is matched by either of the 2 supplied action matchers.

**Since:** API version 10

---

### `createOrAbsoluteHardwareValueMatcher`

```java
AbsoluteHardwareValueMatcher createOrAbsoluteHardwareValueMatcher(AbsoluteHardwareValueMatcher matcher1, AbsoluteHardwareValueMatcher matcher2)
```

Creates a AbsoluteHardwareValueMatcher that is matched by either of the 2 supplied action matchers.

**Since:** API version 10

---

### `midiExpressions`

```java
MidiExpressions midiExpressions()
```

An object that can be used to generate useful MIDI expression strings which can be used in MidiIn.createActionMatcher(String) and other related methods.

**Since:** API version 10

---

### `createCallbackAction`

```java
default HardwareActionBindable createCallbackAction(Runnable runnable, Supplier<String> descriptionProvider)
```

Creates a HardwareActionBindable that can be bound to some HardwareAction (such as a button press) and when that action occurs the supplied Runnable will be run. This is exactly the same as createAction(Runnable, Supplier) but does not use parameter overloading so can be used from non type safe languages like JavaScript.

**Parameters:**
- runnable - The runnable to be run
**Since:** API version 18

---

### `createAction`

```java
HardwareActionBindable createAction(Runnable runnable, Supplier<String> descriptionProvider)
```

Creates a HardwareActionBindable that can be bound to some HardwareAction (such as a button press) and when that action occurs the supplied Runnable will be run.

**Parameters:**
- runnable - The runnable to be run
**Since:** API version 10

---

### `createPressureCallbackAction`

```java
default HardwareActionBindable createPressureCallbackAction(DoubleConsumer actionPressureConsumer, Supplier<String> descriptionProvider)
```

Creates a HardwareActionBindable that can be bound to some HardwareAction (such as a button press) and when that action occurs the supplied Runnable will be run. This is exactly the same as createAction(DoubleConsumer, Supplier) but does not use parameter overloading so can be used from non type safe languages like JavaScript.

**Parameters:**
- actionPressureConsumer - Consumer that will be notified of the pressure of the action
**Since:** API version 18

---

### `createAction`

```java
HardwareActionBindable createAction(DoubleConsumer actionPressureConsumer, Supplier<String> descriptionProvider)
```

Creates a HardwareActionBindable that can be bound to some HardwareAction (such as a button press) and when that action occurs the supplied Runnable will be run

**Parameters:**
- actionPressureConsumer - Consumer that will be notified of the pressure of the action
**Since:** API version 10

---

### `createRelativeHardwareControlStepTarget`

```java
RelativeHardwarControlBindable createRelativeHardwareControlStepTarget(HardwareActionBindable stepForwardsAction, HardwareActionBindable stepBackwardsAction)
```

Creates a RelativeHardwarControlBindable that can be used to step forwards or backwards when a RelativeHardwareControl is adjusted. A step is defined by the RelativeHardwareControl.setStepSize(double).

**Parameters:**
- stepForwardsAction - The action that should happen when stepping forwards
**Since:** API version 10

---

### `createRelativeHardwareControlAdjustmentTarget`

```java
RelativeHardwarControlBindable createRelativeHardwareControlAdjustmentTarget(DoubleConsumer adjustmentConsumer)
```

Creates a RelativeHardwarControlBindable that can be used to adjust some value in an arbitrary way.

**Parameters:**
- adjustmentConsumer - A consumer that will receive the relative adjustment amount when bound to a RelativeHardwareControl.
**Since:** API version 10

---

### `createAbsoluteHardwareControlAdjustmentTarget`

```java
AbsoluteHardwarControlBindable createAbsoluteHardwareControlAdjustmentTarget(DoubleConsumer adjustmentConsumer)
```

Creates a AbsoluteHardwarControlBindable that can be used to adjust some value in an arbitrary way.

**Parameters:**
- adjustmentConsumer - A consumer that will receive the absolute adjustment amount when bound to an AbsoluteHardwareControl.
**Since:** API version 10

---

### `deleteObjects`

```java
void deleteObjects(String undoName, DeleteableObject... objects)
```

It will delete multiple object within one undo step.

**Since:** API version 10

---

### `deleteObjects`

```java
void deleteObjects(DeleteableObject... objects)
```

It will delete multiple object within one undo step.

**Since:** API version 10

---

### `duplicateObjects`

```java
void duplicateObjects(String undoName, DuplicableObject... objects)
```

It will duplicate multiple object within one undo step.

**Since:** API version 19

---

### `duplicateObjects`

```java
void duplicateObjects(DuplicableObject... objects)
```

It will duplicate multiple object within one undo step.

**Since:** API version 19

---

### `createInstrumentMatcher`

```java
DeviceMatcher createInstrumentMatcher()
```

Creates a DeviceMatcher that will match any instrument.

**Since:** API version 12

---

### `createAudioEffectMatcher`

```java
DeviceMatcher createAudioEffectMatcher()
```

Creates a DeviceMatcher that will match any audio effect.

**Since:** API version 12

---

### `createNoteEffectMatcher`

```java
DeviceMatcher createNoteEffectMatcher()
```

Creates a DeviceMatcher that will match any note effect.

**Since:** API version 12

---

### `createBitwigDeviceMatcher`

```java
DeviceMatcher createBitwigDeviceMatcher(UUID id)
```

Creates a DeviceMatcher that will match any Bitwig native device with the supplied id.

**Since:** API version 12

---

### `createVST2DeviceMatcher`

```java
DeviceMatcher createVST2DeviceMatcher(int id)
```

Creates a DeviceMatcher that will match any VST2 plug-in with the supplied id.

**Since:** API version 12

---

### `createVST3DeviceMatcher`

```java
DeviceMatcher createVST3DeviceMatcher(String id)
```

Creates a DeviceMatcher that will match any VST3 plug-in with the supplied id.

**Since:** API version 12

---

### `createActiveDeviceMatcher`

```java
DeviceMatcher createActiveDeviceMatcher()
```

Creates a DeviceMatcher that will only match devices that are currently active.

**Since:** API version 12

---

### `createFirstDeviceInChainMatcher`

```java
DeviceMatcher createFirstDeviceInChainMatcher()
```

Creates a DeviceMatcher that will only match devices if it is the last device in the chain.

**Since:** API version 12

---

### `createLastDeviceInChainMatcher`

```java
DeviceMatcher createLastDeviceInChainMatcher()
```

Creates a DeviceMatcher that will only match devices if it is the last device in the chain.

**Since:** API version 12

---

### `createOrDeviceMatcher`

```java
DeviceMatcher createOrDeviceMatcher(DeviceMatcher... deviceMatchers)
```

Creates a DeviceMatcher that matches a device if any of the supplied matchers match the device.

**Since:** API version 12

---

### `createAndDeviceMatcher`

```java
DeviceMatcher createAndDeviceMatcher(DeviceMatcher... deviceMatchers)
```

Creates a DeviceMatcher that matches a device if all the supplied matchers match the device.

**Since:** API version 12

---

### `createNotDeviceMatcher`

```java
DeviceMatcher createNotDeviceMatcher(DeviceMatcher deviceMatcher)
```

Creates a DeviceMatcher that matches a device if the supplied matcher does not match the device.

**Since:** API version 12

---

### `createMasterRecorder`

```java
MasterRecorder createMasterRecorder()
```

Creates a MasterRecorder.

**Since:** API version 20

---

### `createAudioIoDeviceHardwareAddressMatcher`

```java
AudioIoDeviceMatcher createAudioIoDeviceHardwareAddressMatcher(String hardwareAddress)
```

Creates a matcher that matches devices with the given hardware address.

**Since:** API version 22

---

### `createUsbAudioIoDeviceMatcher`

```java
AudioIoDeviceMatcher createUsbAudioIoDeviceMatcher(int vendorId, int productId)
```

Creates a matcher that matches devices with the given USB vendor and product id.

**Since:** API version 22

---

### `createAudioHardwareOutputInfo`

```java
AudioHardwareIoInfo createAudioHardwareOutputInfo(AudioIoDeviceMatcher matcher, int[] channels)
```

Creates a AudioHardwareIoInfo for the specified output.

**Parameters:**
- channels - zero based channel indices
**Since:** API version 22

---

### `createAudioHardwareInputInfo`

```java
AudioHardwareIoInfo createAudioHardwareInputInfo(AudioIoDeviceMatcher matcher, int[] channels)
```

Creates a AudioHardwareIoInfo for the specified input.

**Parameters:**
- channels - zero based channel indices
**Since:** API version 22

---

