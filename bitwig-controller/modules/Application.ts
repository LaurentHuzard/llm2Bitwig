import type { ControllerModule, RequestParams } from "../types/controller";

export class ApplicationModule implements ControllerModule {
  private readonly application: Application;

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
    }
    return undefined;
  }
}
