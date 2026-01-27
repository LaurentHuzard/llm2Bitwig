# Class ExtensionDefinition

Base class for defining any kind of extension for Bitwig Studio.

## Method Details

### `getName`

```java
public abstract String getName()
```

The name of the extension.

---

### `getAuthor`

```java
public abstract String getAuthor()
```

The author of the extension.

---

### `getVersion`

```java
public abstract String getVersion()
```

The version of the extension.

---

### `getId`

```java
public abstract UUID getId()
```

A unique id that identifies this extension.

---

### `getRequiredAPIVersion`

```java
public abstract int getRequiredAPIVersion()
```

The minimum API version number that this extensions requires.

---

### `isUsingBetaAPI`

```java
public boolean isUsingBetaAPI()
```

Is this extension is using Beta APIs? Beta APIs are still on development and might not be available in a future version of Bitwig Studio. Turning this flag to true, will flag your extension as being a beta extension which might not work after updating Bitwig Studio.

**Returns:** true if the extension wants to use Beta APIs.

---

### `getHelpFilePath`

```java
public String getHelpFilePath()
```

Gets a remote URI or a path within the extension's jar file where documentation for this extension can be found or null if there is none. If the path is not a URI then it is assumed to be a path below the directory "Documentation" within the extension's jar file.

---

### `getSupportFolderPath`

```java
public String getSupportFolderPath()
```

Gets a remote URI or a path within the extension's jar file where support files for this extension can be found or null if there is none. If the path is not a URI then it is assumed to be a path below the directory "Documentation" within the extension's jar file. Support files are for example a configuration file that one has use with a configuration software.

**Since:** API version 13

---

### `shouldFailOnDeprecatedUse`

```java
public boolean shouldFailOnDeprecatedUse()
```

If true then this extension should fail when it calls a deprecated method in the API. This is useful during development.

---

### `getErrorReportingEMail`

```java
public String getErrorReportingEMail()
```

An e-mail address that can be used to contact the author of this extension if a problem is detected with it or null if none.

---

### `toString`

```java
public String toString()
```


---

