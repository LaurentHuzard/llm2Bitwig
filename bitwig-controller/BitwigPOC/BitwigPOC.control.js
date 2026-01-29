loadAPI(10);

host.defineController("BitwigPOC", "BitwigPOC", "0.1", "761be710-90df-4577-8094-01314323214c", "Laurent Huzard");

// Load Modules
load("modules/Transport.js");
load("modules/TrackBank.js");
load("modules/Cursor.js");
load("modules/Application.js");

var modules = [];
var isConnected = false;

function init() {
  // Instantiate Modules
  // Note: These constructors are defined in the loaded files globally
  modules.push(new TransportModule(host));
  modules.push(new TrackBankModule(host));
  modules.push(new CursorModule(host));
  modules.push(new ApplicationModule(host));

  println("BitwigPOC Initialized with " + modules.length + " modules");

  // --- Network Server Setup ---
  var remoteSocket = host.createRemoteConnection("BitwigMCP", 8888);

  remoteSocket.setClientConnectCallback(function (remoteConnection) {
    println("Client connected");
    isConnected = true;

    remoteConnection.setDisconnectCallback(function () {
      println("Client disconnected");
      isConnected = false;
    });

    remoteConnection.setReceiveCallback(function (data) {
      // Decode data (simplistic bytes to string)
      var msgString = "";
      for (var i = 0; i < data.length; i++) {
        msgString += String.fromCharCode(data[i]);
      }

      // Handle JSON-RPC
      try {
        var request = JSON.parse(msgString);
        handleRequest(request, remoteConnection);
      } catch (e) {
        println("Error parsing JSON: " + e);
        sendError(remoteConnection, null, -32700, "Parse error");
      }
    });
  });
}

function handleRequest(request, connection) {
  if (!request.method) {
    sendError(connection, request.id, -32600, "Invalid Request");
    return;
  }

  var result;
  var handled = false;

  // Basic Ping
  if (request.method === "ping") {
    result = "pong";
    handled = true;
  } else {
    // Delegate to modules
    for (var i = 0; i < modules.length; i++) {
      try {
        // Each module's handleRequest returns undefined if it doesn't handle the method
        // Returns the result (or null) if it handles it.
        var res = modules[i].handleRequest(request.method, request.params);
        if (res !== undefined) {
          result = res;
          handled = true;
          break;
        }
      } catch (e) {
        // Module threw a specific error (e.g., "Missing parameters")
        sendError(connection, request.id, -32602, "Error processing " + request.method + ": " + e);
        return;
      }
    }
  }

  if (handled) {
    sendResponse(connection, request.id, result);
  } else {
    sendError(connection, request.id, -32601, "Method not found: " + request.method);
  }
}

// --- Helpers ---

function sendResponse(connection, id, result) {
  var response = {
    jsonrpc: "2.0",
    id: id,
    result: result
  };
  sendJSON(connection, response);
}

function sendError(connection, id, code, message) {
  var response = {
    jsonrpc: "2.0",
    id: id,
    error: {
      code: code,
      message: message
    }
  };
  sendJSON(connection, response);
}

function sendJSON(connection, data) {
  var str = JSON.stringify(data) + "\n";
  var bytes = [];
  for (var i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  connection.send(bytes);
}

function flush() {
  // Callback for GUI refresh/frame updates
}

function exit() {
  println("BitwigPOC Exited");
}
