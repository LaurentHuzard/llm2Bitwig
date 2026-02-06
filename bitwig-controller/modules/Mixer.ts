import type { ControllerModule, RequestParams } from "../types/controller";

export class MixerModule implements ControllerModule {
  private readonly masterTrack: MasterTrack;
  private readonly effectTrackBank: EffectTrackBank;

  constructor(host: ControllerHost) {
    this.masterTrack = host.createMasterTrack(0);
    this.masterTrack.volume().markInterested();
    this.masterTrack.pan().markInterested();

    this.effectTrackBank = host.createEffectTrackBank(8, 2, 8);
    for (let i = 0; i < 8; i++) {
      const track = this.effectTrackBank.getItemAt(i);
      track.volume().markInterested();
      track.pan().markInterested();
      track.mute().markInterested();
      track.solo().markInterested();
      track.name().markInterested();
    }
  }

  handleRequest(method: string, params?: RequestParams): unknown {
    switch (method) {
      case "mixer.master.get_volume":
        return this.masterTrack.volume().get();
      case "mixer.master.set_volume":
        if (params && params[0] !== undefined) {
          this.masterTrack.volume().set(params[0] as number);
          return "OK";
        }
        throw "Missing volume parameter";
      case "mixer.return.list": {
        const tracks: Array<{ index: number; name: string; volume: number; pan: number; mute: boolean; solo: boolean }> = [];
        for (let i = 0; i < 8; i++) {
          const track = this.effectTrackBank.getItemAt(i);
          tracks.push({
            index: i,
            name: track.name().get(),
            volume: track.volume().get(),
            pan: track.pan().get(),
            mute: track.mute().get(),
            solo: track.solo().get()
          });
        }
        return tracks;
      }
      case "mixer.return.volume":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.effectTrackBank.getItemAt(params[0] as number).volume().set(params[1] as number);
          return "OK";
        }
        throw "Missing parameters (index, value)";
      case "mixer.return.pan":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.effectTrackBank.getItemAt(params[0] as number).pan().set(params[1] as number);
          return "OK";
        }
        throw "Missing parameters (index, value)";
    }
    return undefined;
  }
}
