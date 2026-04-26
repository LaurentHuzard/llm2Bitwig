import type { ControllerModule, RequestParams, SendEvent } from "../types/controller";

export class MixerModule implements ControllerModule {
  private readonly masterTrack: MasterTrack;
  private readonly effectTrackBank: EffectTrackBank;
  private readonly project: Project;
  private readonly sendEvent: SendEvent;

  constructor(host: ControllerHost, sendEvent: SendEvent) {
    this.sendEvent = sendEvent;
    this.masterTrack = host.createMasterTrack(0);
    this.masterTrack.volume().markInterested();
    this.masterTrack.pan().markInterested();

    // Master VU Meter
    this.masterTrack.addVuMeterObserver(128, -1, true, (val) => {
      this.sendEvent("mixer.master.vu", { value: val });
    });

    this.project = host.getProject();
    this.project.hasSoloedTracks().markInterested();
    this.project.hasMutedTracks().markInterested();
    this.project.hasArmedTracks().markInterested();

    this.effectTrackBank = host.createEffectTrackBank(8, 2, 8);
    for (let i = 0; i < 8; i++) {
      const track = this.effectTrackBank.getItemAt(i);
      track.volume().markInterested();
      track.pan().markInterested();
      track.mute().markInterested();
      track.solo().markInterested();
      track.name().markInterested();
      
      track.addVuMeterObserver(128, -1, true, (val) => {
        this.sendEvent("mixer.return.vu", { index: i, value: val });
      });
    }
  }

  handleRequest(method: string, params?: RequestParams): unknown {
    const args = params as unknown[];
    switch (method) {
      case "mixer.master.get_volume":
        return this.masterTrack.volume().get();
      case "mixer.master.set_volume":
        if (args && args[0] !== undefined) {
          this.masterTrack.volume().set(args[0] as number);
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
        if (args && args[0] !== undefined && args[1] !== undefined) {
          this.effectTrackBank.getItemAt(args[0] as number).volume().set(args[1] as number);
          return "OK";
        }
        throw "Missing parameters (index, value)";
      case "mixer.return.pan":
        if (args && args[0] !== undefined && args[1] !== undefined) {
          this.effectTrackBank.getItemAt(args[0] as number).pan().set(args[1] as number);
          return "OK";
        }
        throw "Missing parameters (index, value)";
      
      case "project.unsolo_all":
        this.project.unsoloAll();
        return "OK";
      case "project.unmute_all":
        this.project.unmuteAll();
        return "OK";
      case "project.unarm_all":
        this.project.unarmAll();
        return "OK";
      case "project.get_mixer_status":
        return {
          hasSoloedTracks: this.project.hasSoloedTracks().get(),
          hasMutedTracks: this.project.hasMutedTracks().get(),
          hasArmedTracks: this.project.hasArmedTracks().get()
        };
    }
    return undefined;
  }
}
