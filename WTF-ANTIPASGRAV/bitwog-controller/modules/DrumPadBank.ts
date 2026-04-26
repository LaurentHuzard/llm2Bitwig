import type { ControllerModule, RequestParams, SendEvent } from "../types/controller";

export class DrumPadBankModule implements ControllerModule {
  private readonly drumPadBank: DrumPadBank;
  private readonly sendEvent: SendEvent;

  constructor(host: ControllerHost, cursorDevice: CursorDevice, sendEvent: SendEvent) {
    this.sendEvent = sendEvent;
    // Create a bank of 16 pads
    this.drumPadBank = cursorDevice.createDrumPadBank(16);
    this.drumPadBank.scrollPosition().markInterested();
    
    for (let i = 0; i < 16; i++) {
      const pad = this.drumPadBank.getItemAt(i);
      pad.name().markInterested();
      pad.exists().markInterested();
      pad.color().markInterested();
      pad.solo().markInterested();
      pad.mute().markInterested();
      pad.volume().markInterested();
      pad.pan().markInterested();

      pad.name().addValueObserver((name) => {
        this.sendEvent("drumpad.update", { index: i, name });
      });
      pad.exists().addValueObserver((exists) => {
        this.sendEvent("drumpad.update", { index: i, exists });
      });
    }
  }

  handleRequest(method: string, params?: RequestParams): unknown {
    const args = params as unknown[];
    switch (method) {
      case "drumpad.get_status": {
        const pads = [];
        for (let i = 0; i < 16; i++) {
          const pad = this.drumPadBank.getItemAt(i);
          if (pad.exists().get()) {
            pads.push({
              index: i,
              name: pad.name().get(),
              volume: pad.volume().get(),
              pan: pad.pan().get(),
              mute: pad.mute().get(),
              solo: pad.solo().get(),
              color: {
                red: pad.color().red(),
                green: pad.color().green(),
                blue: pad.color().blue()
              }
            });
          }
        }
        return {
          scrollPosition: this.drumPadBank.scrollPosition().get(),
          pads
        };
      }
      case "drumpad.select":
        if (args && args[0] !== undefined) {
          this.drumPadBank.getItemAt(args[0] as number).selectInEditor();
          return "OK";
        }
        throw "Missing pad index parameter";
      case "drumpad.scroll_forward":
        this.drumPadBank.scrollForwards();
        return "OK";
      case "drumpad.scroll_backward":
        this.drumPadBank.scrollBackwards();
        return "OK";
      case "drumpad.set_volume":
        if (args && args[0] !== undefined && args[1] !== undefined) {
          this.drumPadBank.getItemAt(args[0] as number).volume().set(args[1] as number);
          return "OK";
        }
        throw "Missing parameters (index, value)";
      case "drumpad.set_mute":
        if (args && args[0] !== undefined && args[1] !== undefined) {
          this.drumPadBank.getItemAt(args[0] as number).mute().set(args[1] as boolean);
          return "OK";
        }
        throw "Missing parameters (index, state)";
      case "drumpad.set_solo":
        if (args && args[0] !== undefined && args[1] !== undefined) {
          this.drumPadBank.getItemAt(args[0] as number).solo().set(args[1] as boolean);
          return "OK";
        }
        throw "Missing parameters (index, state)";
    }
    return undefined;
  }
}
