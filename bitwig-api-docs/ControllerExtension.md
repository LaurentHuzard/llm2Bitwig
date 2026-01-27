# Class ControllerExtension

Defines an extension that enabled a controller to work with Bitwig Studio.

## Method Details

### `getMidiInPort`

```java
public final MidiIn getMidiInPort(int index)
```

---

### `getMidiOutPort`

```java
public final MidiOut getMidiOutPort(int index)
```

---

### `init`

```java
public abstract void init()
```

Initializes this controller extension. This will be called once when the extension is started. During initialization the extension should call the various create methods available via the ControllerHost interface in order to create objects used to communicate with various parts of the Bitwig Studio application (e.g ControllerHost.createCursorTrack(int, int).

---

### `exit`

```java
public abstract void exit()
```

Called once when this controller extension is stopped.

---

### `flush`

```java
public abstract void flush()
```

Called when this controller extension should flush any pending updates to the controller.

---

