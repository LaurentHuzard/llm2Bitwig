import type { ControllerModule, RequestParams, SendEvent } from "../types/controller";

export class ClipModule implements ControllerModule {
  private readonly cursorClip: CursorClip;
  private readonly sendEvent: SendEvent;

  constructor(host: ControllerHost, sendEvent: SendEvent) {
    this.cursorClip = host.createCursorClip(16, 128);
    this.sendEvent = sendEvent;

    this.cursorClip.getLoopLength().markInterested();
    this.cursorClip.getLoopStart().markInterested();
    this.cursorClip.getPlayStart().markInterested();
    this.cursorClip.getPlayStop().markInterested();
    this.cursorClip.playingStep().markInterested();

    this.cursorClip.addStepDataObserver((x, y, state) => {
      this.sendEvent("clip.step_update", { x, y, state });
    });

    this.cursorClip.addPlayingStepObserver((step) => {
      this.sendEvent("clip.play_step", { step });
    });
  }

  handleRequest(method: string, params?: RequestParams): unknown {
    switch (method) {
      case "clip.get_info":
        return {
          loopLength: this.cursorClip.getLoopLength().get(),
          loopStart: this.cursorClip.getLoopStart().get(),
          playStart: this.cursorClip.getPlayStart().get(),
          playStop: this.cursorClip.getPlayStop().get(),
          playingStep: this.cursorClip.playingStep().get()
        };
      case "clip.set_note":
        if (
          params &&
          params[0] !== undefined &&
          params[1] !== undefined &&
          params[2] !== undefined &&
          params[3] !== undefined
        ) {
          const step = params[0] as number;
          const pitch = params[1] as number;
          const velocity = params[2] as number;
          const duration = params[3] as number;

          this.cursorClip.setStep(0, step, pitch, velocity, duration);
          return "OK";
        }
        throw "Missing parameters (step, pitch, velocity, duration)";
      case "clip.clear_note":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          const step = params[0] as number;
          const pitch = params[1] as number;
          this.cursorClip.clearStep(0, step, pitch);
          return "OK";
        }
        throw "Missing parameters (step, pitch)";
      case "clip.toggle_note":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          const step = params[0] as number;
          const pitch = params[1] as number;
          const velocity = (params[2] as number | undefined) || 1.0;
          this.cursorClip.toggleStep(step, pitch, velocity);
          return "OK";
        }
        throw "Missing parameters (step, pitch)";
      case "clip.get_notes":
        if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined) {
          return {
            message: "Note reading requires observer pattern - use clip.get_info for now",
            startStep: params[0],
            stepCount: params[1],
            pitch: params[2]
          };
        }
        throw "Missing parameters (startStep, stepCount, pitch)";
    }
    return undefined;
  }
}
