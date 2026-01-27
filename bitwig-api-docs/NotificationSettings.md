# Interface NotificationSettings

Bitwig Studio supports automatic visual feedback from controllers that shows up as popup notifications. For example when the selected track or the current device preset was changed on the controller, these notifications are shown, depending on the configuration. It depends both on the users preference and the capabilities of the controller hardware if a certain notification should be shown. This interface provides functions for enabling/disabling the various kinds of automatic notifications from the hardware point of view. Typically, controllers that include an advanced display don't need to show many notifications additionally on screen. For other controllers that do not include a display it might be useful to show all notifications. By default all notifications are disabled. In addition, the user can enable or disable all notifications the have been enabled using this interface in the preferences dialog of Bitwig Studio.

## Method Details

### `getUserNotificationsEnabled`

```java
SettableBooleanValue getUserNotificationsEnabled()
```

Returns an object that reports if user notifications are enabled and that allows to enable/disable user notifications from the control surface. If user notifications are disabled, no automatic notifications will be shown in the Bitwig Studio user interface. If user notifications are enabled, all automatic notifications will be shown that are enabled using the methods of this interface.

**Returns:** a boolean value object
**Since:** API version 1

---

### `setShouldShowSelectionNotifications`

```java
void setShouldShowSelectionNotifications(boolean shouldShowNotifications)
```

Specifies if user notification related to selection changes should be shown. Please note that this setting only applies when user notifications are enabled in general, otherwise no notification are shown. By default this setting is `false`.

**Parameters:**
- shouldShowNotifications - `true` in case selection notifications should be shown, `false` otherwise.
**Since:** API version 1

---

### `setShouldShowChannelSelectionNotifications`

```java
void setShouldShowChannelSelectionNotifications(boolean shouldShowNotifications)
```

Specifies if user notification related to selection changes should be shown. Please note that this setting only applies when user notifications are enabled in general, otherwise no notification are shown. By default this setting is `false`.

**Parameters:**
- shouldShowNotifications - `true` in case selection notifications should be shown, `false` otherwise.
**Since:** API version 1

---

### `setShouldShowTrackSelectionNotifications`

```java
void setShouldShowTrackSelectionNotifications(boolean shouldShowNotifications)
```

Specifies if user notification related to selection changes should be shown. Please note that this setting only applies when user notifications are enabled in general, otherwise no notification are shown. By default this setting is `false`.

**Parameters:**
- shouldShowNotifications - `true` in case selection notifications should be shown, `false` otherwise.
**Since:** API version 1

---

### `setShouldShowDeviceSelectionNotifications`

```java
void setShouldShowDeviceSelectionNotifications(boolean shouldShowNotifications)
```

Specifies if user notification related to selection changes should be shown. Please note that this setting only applies when user notifications are enabled in general, otherwise no notification are shown. By default this setting is `false`.

**Parameters:**
- shouldShowNotifications - `true` in case selection notifications should be shown, `false` otherwise.
**Since:** API version 1

---

### `setShouldShowDeviceLayerSelectionNotifications`

```java
void setShouldShowDeviceLayerSelectionNotifications(boolean shouldShowNotifications)
```

Specifies if user notification related to selection changes should be shown. Please note that this setting only applies when user notifications are enabled in general, otherwise no notification are shown. By default this setting is `false`.

**Parameters:**
- shouldShowNotifications - `true` in case selection notifications should be shown, `false` otherwise.
**Since:** API version 1

---

### `setShouldShowPresetNotifications`

```java
void setShouldShowPresetNotifications(boolean shouldShowNotifications)
```

Specifies if user notification related to selection changes should be shown. Please note that this setting only applies when user notifications are enabled in general, otherwise no notification are shown.

**Parameters:**
- shouldShowNotifications - `true` in case selection notifications should be shown, `false` otherwise.
**Since:** API version 1

---

### `setShouldShowMappingNotifications`

```java
void setShouldShowMappingNotifications(boolean shouldShowNotifications)
```

Specifies if user notification related to selection changes should be shown. Please note that this setting only applies when user notifications are enabled in general, otherwise no notification are shown. By default this setting is `false`.

**Parameters:**
- shouldShowNotifications - `true` in case selection notifications should be shown, `false` otherwise.
**Since:** API version 1

---

### `setShouldShowValueNotifications`

```java
void setShouldShowValueNotifications(boolean shouldShowNotifications)
```

Specifies if user notification related to selection changes should be shown. Please note that this setting only applies when user notifications are enabled in general, otherwise no notification are shown. By default this setting is `false`.

**Parameters:**
- shouldShowNotifications - `true` in case selection notifications should be shown, `false` otherwise.
**Since:** API version 1

---

