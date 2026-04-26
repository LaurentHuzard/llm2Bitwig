import type { ControllerModule, RequestParams } from "../types/controller";

export class GrooveModule implements ControllerModule {
  private readonly groove: Groove;

  constructor(host: ControllerHost) {
    this.groove = host.createGroove();
    this.groove.getEnabled().markInterested();
    this.groove.getShuffleAmount().markInterested();
    this.groove.getShuffleRate().markInterested();
    this.groove.getAccentAmount().markInterested();
    this.groove.getAccentRate().markInterested();
    this.groove.getAccentPhase().markInterested();
  }

  handleRequest(method: string, params?: RequestParams): unknown {
    const args = params as unknown[];
    switch (method) {
      case "groove.get_status":
        return {
          enabled: this.groove.getEnabled().get(),
          shuffleAmount: this.groove.getShuffleAmount().get(),
          shuffleRate: this.groove.getShuffleRate().get(),
          accentAmount: this.groove.getAccentAmount().get(),
          accentRate: this.groove.getAccentRate().get(),
          accentPhase: this.groove.getAccentPhase().get()
        };
      case "groove.set_enabled":
        if (args && args[0] !== undefined) {
          this.groove.getEnabled().set(args[0] as boolean);
          return "OK";
        }
        throw "Missing enabled parameter";
      case "groove.set_shuffle_amount":
        if (args && args[0] !== undefined) {
          this.groove.getShuffleAmount().set(args[0] as number);
          return "OK";
        }
        throw "Missing amount parameter";
      case "groove.set_shuffle_rate":
        if (args && args[0] !== undefined) {
          this.groove.getShuffleRate().set(args[0] as number);
          return "OK";
        }
        throw "Missing rate parameter";
      case "groove.set_accent_amount":
        if (args && args[0] !== undefined) {
          this.groove.getAccentAmount().set(args[0] as number);
          return "OK";
        }
        throw "Missing amount parameter";
      case "groove.set_accent_rate":
        if (args && args[0] !== undefined) {
          this.groove.getAccentRate().set(args[0] as number);
          return "OK";
        }
        throw "Missing rate parameter";
      case "groove.set_accent_phase":
        if (args && args[0] !== undefined) {
          this.groove.getAccentPhase().set(args[0] as number);
          return "OK";
        }
        throw "Missing phase parameter";
    }
    return undefined;
  }
}
