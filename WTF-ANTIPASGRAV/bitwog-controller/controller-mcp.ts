import { ApplicationModule } from "./modules/Application";
import { BrowserModule } from "./modules/Browser";
import { ClipModule } from "./modules/Clip";
import { CursorModule } from "./modules/Cursor";
import { DeviceModule } from "./modules/Device";
import { MixerModule } from "./modules/Mixer";
import { SceneBankModule } from "./modules/SceneBank";
import { TrackBankModule } from "./modules/TrackBank";
import { TransportModule } from "./modules/Transport";
import { HardwareSurfaceModule } from "./modules/HardwareSurface";
import { ArrangerModule } from "./modules/Arranger";
import { NoteInputModule } from "./modules/NoteInput";
import { DrumPadBankModule } from "./modules/DrumPadBank";
import { GrooveModule } from "./modules/Groove";
import { SettingsModule } from "./modules/Settings";
import { MidiModule } from "./modules/Midi";
import { OscModule } from "./modules/Osc";
import type { ControllerModule, SendEvent } from "./types/controller";

loadAPI(25);

host.defineController("BitwigPOC", "BitwigPOC", "0.2", "761be710-90df-4577-8094-01314323214c", "Laurent Huzard");

type RequestMessage = {
  id?: string | number | null;
  method?: string;
  params?: unknown[];
};

type ProjectSummary = {
  transport: unknown | null;
  tracks: unknown[];
  scenes: unknown[];
  selection: {
    track: unknown | null;
    device: unknown | null;
    clip: unknown | null;
  };
  mixer: {
    masterVolume: unknown | null;
    status: unknown | null;
  };
  arranger: unknown | null;
  groove: unknown | null;
  settings: unknown | null;
};

const modules: ControllerModule[] = [];
let activeConnection: RemoteConnection | null = null;

function init(): void {
  const sendEvent: SendEvent = (method, params) => {
    if (!activeConnection) return;
    sendJSON(activeConnection, { jsonrpc: "2.0", method, params });
  };

  const transportModule = new TransportModule(host, sendEvent);
  modules.push(transportModule);

  const trackBankModule = new TrackBankModule(host, sendEvent);
  modules.push(trackBankModule);

  modules.push(new SceneBankModule(host));
  modules.push(new MixerModule(host, sendEvent));
  
  const cursorModule = new CursorModule(host, sendEvent);
  modules.push(cursorModule);
  
  const applicationModule = new ApplicationModule(host);
  modules.push(applicationModule);
  modules.push(new DeviceModule(trackBankModule.trackBank));
  modules.push(new ClipModule(host, sendEvent));
  modules.push(new BrowserModule(host));
  modules.push(new HardwareSurfaceModule(host));
  modules.push(new ArrangerModule(host, sendEvent, (transportModule as any).transport));
  modules.push(new NoteInputModule(host));
  modules.push(new DrumPadBankModule(host, (cursorModule as any).cursorDevice, sendEvent));
  modules.push(new GrooveModule(host));
  modules.push(new SettingsModule(host));
  
  modules.push(new MidiModule(host, sendEvent));
  modules.push(new OscModule(host, sendEvent));

  println(`BitwigPOC Initialized with ${modules.length} modules (v0.2)`);

  const remoteSocket = host.createRemoteConnection("BitwigMCP", 8888);

  remoteSocket.setClientConnectCallback((remoteConnection) => {
    println("Client connected");
    activeConnection = remoteConnection;

    remoteConnection.setDisconnectCallback(() => {
      println("Client disconnected");
      activeConnection = null;
    });

    remoteConnection.setReceiveCallback((data) => {
      let msgString = "";
      for (let i = 0; i < data.length; i++) {
        msgString += String.fromCharCode(data[i]);
      }

      try {
        const request = JSON.parse(msgString) as RequestMessage;
        handleRequest(request, remoteConnection);
      } catch (error) {
        println(`Error parsing JSON: ${String(error)}`);
        sendError(remoteConnection, null, -32700, "Parse error");
      }
    });
  });
}

function handleRequest(request: RequestMessage, connection: RemoteConnection): void {
  if (!request.method) {
    sendError(connection, request.id ?? null, -32600, "Invalid Request");
    return;
  }

  let result: unknown;
  let handled = false;

  if (request.method === "ping") {
    result = "pong";
    handled = true;
  } else if (request.method === "project.get_summary") {
    const summary: ProjectSummary = {
      transport: null,
      tracks: [],
      scenes: [],
      selection: {
        track: null,
        device: null,
        clip: null
      },
      mixer: {
        masterVolume: null,
        status: null
      },
      arranger: null,
      groove: null,
      settings: null
    };
    for (const module of modules) {
      try {
        if (module instanceof TransportModule) summary.transport = module.handleRequest("transport.get_status");
        if (module instanceof TrackBankModule) summary.tracks = module.handleRequest("track.list") as unknown[];
        if (module instanceof SceneBankModule) summary.scenes = module.handleRequest("scene.list") as unknown[];
        if (module instanceof CursorModule) {
          summary.selection.track = module.handleRequest("cursor_track.get_status");
          summary.selection.device = module.handleRequest("cursor_device.get_status");
          summary.selection.clip = module.handleRequest("cursor_clip.get_status");
        }
        if (module instanceof MixerModule) {
          summary.mixer.masterVolume = module.handleRequest("mixer.master.get_volume");
          summary.mixer.status = module.handleRequest("project.get_mixer_status");
        }
        if (module instanceof ArrangerModule) {
          summary.arranger = module.handleRequest("arranger.get_status");
        }
        if (module instanceof GrooveModule) {
          summary.groove = module.handleRequest("groove.get_status");
        }
        if (module instanceof SettingsModule) {
          summary.settings = module.handleRequest("settings.get_all");
        }
      } catch {
        // Swallow errors
      }
    }
    result = summary;
    handled = true;
  } else {
    for (const module of modules) {
      try {
        const response = module.handleRequest(request.method, request.params);
        if (response !== undefined) {
          result = response;
          handled = true;
          break;
        }
      } catch (error) {
        sendError(connection, request.id ?? null, -32602, `Error processing ${request.method}: ${String(error)}`);
        return;
      }
    }
  }

  if (handled) {
    sendResponse(connection, request.id ?? null, result);
  } else {
    sendError(connection, request.id ?? null, -32601, `Method not found: ${request.method}`);
  }
}

function sendResponse(connection: RemoteConnection, id: string | number | null, result: unknown): void {
  sendJSON(connection, {
    jsonrpc: "2.0",
    id,
    result
  });
}

function sendError(connection: RemoteConnection, id: string | number | null, code: number, message: string): void {
  sendJSON(connection, {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message
    }
  });
}

function sendJSON(connection: RemoteConnection, data: unknown): void {
  const str = `${JSON.stringify(data)}\n`;
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  connection.send(bytes);
}

function flush(): void {
}

function exit(): void {
  println("BitwigPOC Exited");
}

const globalScope =
  typeof globalThis !== "undefined"
    ? (globalThis as { init?: () => void; flush?: () => void; exit?: () => void })
    : (Function("return this")() as { init?: () => void; flush?: () => void; exit?: () => void });

globalScope.init = init;
globalScope.flush = flush;
globalScope.exit = exit;
