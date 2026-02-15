import type { ControllerModule, RequestParams } from "../types/controller";

export class ApplicationModule implements ControllerModule {
  public readonly application: Application;

  constructor(host: ControllerHost) {
    this.application = host.createApplication();
  }

  handleRequest(method: string, _params?: RequestParams): unknown {
    switch (method) {
      case "application.createInstrumentTrack":
        this.application.createInstrumentTrack(-1);
        return "OK";
      case "application.createAudioTrack":
        this.application.createAudioTrack(-1);
        return "OK";
      case "application.createEffectTrack":
        this.application.createEffectTrack(-1);
        return "OK";

      // Edit Commands
      case "application.undo": this.application.undo(); return "OK";
      case "application.redo": this.application.redo(); return "OK";
      case "application.cut": this.application.cut(); return "OK";
      case "application.copy": this.application.copy(); return "OK";
      case "application.paste": this.application.paste(); return "OK";
      case "application.delete": this.application.remove(); return "OK";
      case "application.duplicate": this.application.duplicate(); return "OK";
      case "application.select_all": this.application.selectAll(); return "OK";
      case "application.select_none": this.application.selectNone(); return "OK";

      // Navigation
      case "application.arrow_key":
        if (_params && _params[0]) {
          const dir = _params[0] as string;
          switch (dir) {
            case "up": this.application.arrowKeyUp(); break;
            case "down": this.application.arrowKeyDown(); break;
            case "left": this.application.arrowKeyLeft(); break;
            case "right": this.application.arrowKeyRight(); break;
          }
          return "OK";
        }
        throw "Missing direction for arrow_key";

      case "application.enter": this.application.enter(); return "OK";
      case "application.escape": this.application.escape(); return "OK";

      // View
      case "application.zoom_in": this.application.zoomIn(); return "OK";
      case "application.zoom_out": this.application.zoomOut(); return "OK";
    }
    return undefined;
  }
}
