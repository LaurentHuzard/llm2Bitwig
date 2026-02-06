import type { ControllerModule, RequestParams, SendEvent } from "../types/controller";

export class TrackBankModule implements ControllerModule {
  public readonly trackBank: TrackBank;
  private readonly sendEvent: SendEvent;

  constructor(host: ControllerHost, sendEvent: SendEvent) {
    this.trackBank = host.createMainTrackBank(8, 2, 8);
    this.trackBank.followCursorTrack(host.createCursorTrack(0, 0));
    this.sendEvent = sendEvent;

    for (let i = 0; i < 8; i++) {
      this.initTrack(i);
    }
  }

  private initTrack(index: number): void {
    const track = this.trackBank.getItemAt(index);
    track.volume().markInterested();
    track.pan().markInterested();
    track.mute().markInterested();
    track.solo().markInterested();
    track.arm().markInterested();
    track.name().markInterested();
    track.color().markInterested();
    track.exists().markInterested();
    track.trackType().markInterested();
    track.position().markInterested();
    track.isGroup().markInterested();

    track.volume().addValueObserver(101, (val) => {
      this.sendEvent("track.update", { index, volume: val });
    });
    track.pan().addValueObserver(101, (val) => {
      this.sendEvent("track.update", { index, pan: val });
    });
    track.mute().addValueObserver((val) => {
      this.sendEvent("track.update", { index, mute: val });
    });
    track.solo().addValueObserver((val) => {
      this.sendEvent("track.update", { index, solo: val });
    });
    track.arm().addValueObserver((val) => {
      this.sendEvent("track.update", { index, arm: val });
    });
    track.name().addValueObserver((val) => {
      this.sendEvent("track.update", { index, name: val });
    });
    track.color().addValueObserver((red, green, blue) => {
      this.sendEvent("track.update", { index, color: { red, green, blue } });
    });

    const sendBank = track.sendBank();
    for (let k = 0; k < 2; k++) {
      sendBank.getItemAt(k).markInterested();
    }

    const clipLauncher = track.clipLauncherSlotBank();
    for (let j = 0; j < 8; j++) {
      const slot = clipLauncher.getItemAt(j);
      slot.hasContent().markInterested();
      slot.isPlaying().markInterested();
      slot.isRecording().markInterested();
      slot.isPlaybackQueued().markInterested();
      slot.color().markInterested();
      slot.name().markInterested();

      slot.hasContent().addValueObserver((val) => {
        this.sendEvent("clip_launcher.slot_update", { trackIndex: index, sceneIndex: j, hasContent: val });
      });
      slot.isPlaying().addValueObserver((val) => {
        this.sendEvent("clip_launcher.slot_update", { trackIndex: index, sceneIndex: j, isPlaying: val });
      });
      slot.isRecording().addValueObserver((val) => {
        this.sendEvent("clip_launcher.slot_update", { trackIndex: index, sceneIndex: j, isRecording: val });
      });
      slot.isPlaybackQueued().addValueObserver((val) => {
        this.sendEvent("clip_launcher.slot_update", { trackIndex: index, sceneIndex: j, isPlaybackQueued: val });
      });
      slot.color().addValueObserver((r, g, b) => {
        this.sendEvent("clip_launcher.slot_update", { trackIndex: index, sceneIndex: j, color: { r, g, b } });
      });
      slot.name().addValueObserver((val) => {
        this.sendEvent("clip_launcher.slot_update", { trackIndex: index, sceneIndex: j, name: val });
      });
    }
  }

  handleRequest(method: string, params?: RequestParams): unknown {
    switch (method) {
      case "track.bank.get_status": {
        const tracks: Array<{
          index: number;
          name: string;
          volume: number;
          pan: number;
          mute: boolean;
          solo: boolean;
          arm: boolean;
          color: { red: number; green: number; blue: number };
        }> = [];
        for (let i = 0; i < 8; i++) {
          const track = this.trackBank.getItemAt(i);
          tracks.push({
            index: i,
            name: track.name().get(),
            volume: track.volume().get(),
            pan: track.pan().get(),
            mute: track.mute().get(),
            solo: track.solo().get(),
            arm: track.arm().get(),
            color: {
              red: track.color().red(),
              green: track.color().green(),
              blue: track.color().blue()
            }
          });
        }
        return tracks;
      }
      case "track.bank.volume":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.trackBank.getItemAt(params[0] as number).volume().set(params[1] as number);
          return "OK";
        }
        throw "Missing parameters";
      case "track.bank.pan":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.trackBank.getItemAt(params[0] as number).pan().set(params[1] as number);
          return "OK";
        }
        throw "Missing parameters";
      case "track.bank.mute":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.trackBank.getItemAt(params[0] as number).mute().set(params[1] as boolean);
          return "OK";
        }
        throw "Missing parameters";
      case "track.bank.solo":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.trackBank.getItemAt(params[0] as number).solo().set(params[1] as boolean);
          return "OK";
        }
        throw "Missing parameters";
      case "track.bank.select":
        if (params && params[0] !== undefined) {
          this.trackBank.getItemAt(params[0] as number).selectInMixer();
          return "OK";
        }
        throw "Missing parameters";
      case "track.delete":
        if (params && params[0] !== undefined) {
          this.trackBank.getItemAt(params[0] as number).deleteObject();
          return "OK";
        }
        throw "Missing parameter";
      case "track.rename":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.trackBank.getItemAt(params[0] as number).name().set(params[1] as string);
          return "OK";
        }
        throw "Missing parameters";
      case "track.duplicate":
        if (params && params[0] !== undefined) {
          this.trackBank.getItemAt(params[0] as number).duplicate();
          return "OK";
        }
        throw "Missing parameter";
      case "track.set_color":
        if (
          params &&
          params[0] !== undefined &&
          params[1] !== undefined &&
          params[2] !== undefined &&
          params[3] !== undefined
        ) {
          this.trackBank.getItemAt(params[0] as number).color().set(
            params[1] as number,
            params[2] as number,
            params[3] as number
          );
          return "OK";
        }
        throw "Missing parameters";
      case "clip.launch":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.trackBank
            .getItemAt(params[0] as number)
            .clipLauncherSlotBank()
            .getItemAt(params[1] as number)
            .launch();
          return "OK";
        }
        throw "Missing parameters";
      case "clip.record":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.trackBank
            .getItemAt(params[0] as number)
            .clipLauncherSlotBank()
            .getItemAt(params[1] as number)
            .record();
          return "OK";
        }
        throw "Missing parameters";
      case "clip.stop":
        if (params && params[0] !== undefined) {
          this.trackBank.getItemAt(params[0] as number).stop();
          return "OK";
        }
        throw "Missing parameters";
      case "clip.duplicate":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.trackBank
            .getItemAt(params[0] as number)
            .clipLauncherSlotBank()
            .duplicateClip(params[1] as number);
          return "OK";
        }
        throw "Missing parameters (trackIndex, slotIndex)";
      case "clip.select_slot":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.trackBank
            .getItemAt(params[0] as number)
            .clipLauncherSlotBank()
            .select(params[1] as number);
          return "OK";
        }
        throw "Missing parameters (trackIndex, slotIndex)";
      case "clip.create":
        if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined) {
          this.trackBank
            .getItemAt(params[0] as number)
            .clipLauncherSlotBank()
            .getItemAt(params[1] as number)
            .createEmptyClip(params[2] as number);
          return "OK";
        }
        throw "Missing parameters (trackIndex, slotIndex, length)";
      case "clip.delete":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.trackBank
            .getItemAt(params[0] as number)
            .clipLauncherSlotBank()
            .deleteClip(params[1] as number);
          return "OK";
        }
        throw "Missing parameters (trackIndex, slotIndex)";
      case "clip.browse_insert":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.trackBank
            .getItemAt(params[0] as number)
            .clipLauncherSlotBank()
            .getItemAt(params[1] as number)
            .browseToInsertClip();
          return "OK";
        }
        throw "Missing parameters (trackIndex, slotIndex)";
      case "clip.get_status":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          const trackIdx = params[0] as number;
          const sceneIdx = params[1] as number;
          const clipSlot = this.trackBank.getItemAt(trackIdx).clipLauncherSlotBank().getItemAt(sceneIdx);
          return {
            hasContent: clipSlot.hasContent().get(),
            isPlaying: clipSlot.isPlaying().get(),
            isRecording: clipSlot.isRecording().get(),
            isPlaybackQueued: clipSlot.isPlaybackQueued().get()
          };
        }
        throw "Missing parameters (trackIndex, sceneIndex)";
      case "clip.get_grid": {
        const grid: Array<
          Array<{
            trackIndex: number;
            sceneIndex: number;
            hasContent: boolean;
            isPlaying: boolean;
            isRecording: boolean;
            isPlaybackQueued: boolean;
            name: string;
          }>
        > = [];
        for (let t = 0; t < 8; t++) {
          const trackSlots: Array<{
            trackIndex: number;
            sceneIndex: number;
            hasContent: boolean;
            isPlaying: boolean;
            isRecording: boolean;
            isPlaybackQueued: boolean;
            name: string;
          }> = [];
          const clipLauncher = this.trackBank.getItemAt(t).clipLauncherSlotBank();
          for (let s = 0; s < 8; s++) {
            const slot = clipLauncher.getItemAt(s);
            trackSlots.push({
              trackIndex: t,
              sceneIndex: s,
              hasContent: slot.hasContent().get(),
              isPlaying: slot.isPlaying().get(),
              isRecording: slot.isRecording().get(),
              isPlaybackQueued: slot.isPlaybackQueued().get(),
              name: slot.name().get()
            });
          }
          grid.push(trackSlots);
        }
        return grid;
      }
      case "clip.set_color":
        if (
          params &&
          params[0] !== undefined &&
          params[1] !== undefined &&
          params[2] !== undefined &&
          params[3] !== undefined &&
          params[4] !== undefined
        ) {
          const trackIdx = params[0] as number;
          const sceneIdx = params[1] as number;
          const red = params[2] as number;
          const green = params[3] as number;
          const blue = params[4] as number;
          this.trackBank
            .getItemAt(trackIdx)
            .clipLauncherSlotBank()
            .getItemAt(sceneIdx)
            .color()
            .set(red, green, blue);
          return "OK";
        }
        throw "Missing parameters (trackIndex, sceneIndex, r, g, b)";
      case "clip.get_color":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          const trackIdx = params[0] as number;
          const sceneIdx = params[1] as number;
          const clipColor = this.trackBank.getItemAt(trackIdx).clipLauncherSlotBank().getItemAt(sceneIdx).color();
          return {
            r: clipColor.red(),
            g: clipColor.green(),
            b: clipColor.blue()
          };
        }
        throw "Missing parameters (trackIndex, sceneIndex)";
      case "mixer.track.get_send":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          return this.trackBank.getItemAt(params[0] as number).sendBank().getItemAt(params[1] as number).get();
        }
        throw "Missing parameters";
      case "mixer.track.set_send":
        if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined) {
          this.trackBank
            .getItemAt(params[0] as number)
            .sendBank()
            .getItemAt(params[1] as number)
            .set(params[2] as number);
          return "OK";
        }
        throw "Missing parameters";
      case "track.list": {
        const allTracks: Array<{
          index: number;
          name: string;
          type: string;
          position: number;
          isGroup: boolean;
          color: { red: number; green: number; blue: number };
        }> = [];
        for (let i = 0; i < 8; i++) {
          const track = this.trackBank.getItemAt(i);
          if (track.exists().get()) {
            allTracks.push({
              index: i,
              name: track.name().get(),
              type: track.trackType().get(),
              position: track.position().get(),
              isGroup: track.isGroup().get(),
              color: {
                red: track.color().red(),
                green: track.color().green(),
                blue: track.color().blue()
              }
            });
          }
        }
        return allTracks;
      }
      case "track.get_info":
        if (params && params[0] !== undefined) {
          const track = this.trackBank.getItemAt(params[0] as number);
          return {
            index: params[0],
            exists: track.exists().get(),
            name: track.name().get(),
            type: track.trackType().get(),
            position: track.position().get(),
            isGroup: track.isGroup().get(),
            volume: track.volume().get(),
            pan: track.pan().get(),
            mute: track.mute().get(),
            solo: track.solo().get(),
            arm: track.arm().get(),
            color: {
              red: track.color().red(),
              green: track.color().green(),
              blue: track.color().blue()
            }
          };
        }
        throw "Missing track index parameter";
      case "track.scroll_into_view":
        if (params && params[0] !== undefined) {
          const track = this.trackBank.getItemAt(params[0] as number);
          track.makeVisibleInArranger();
          track.makeVisibleInMixer();
          return "OK";
        }
        throw "Missing track index parameter";
      case "track.bank.scroll_forward":
        this.trackBank.scrollForwards();
        return "OK";
      case "track.bank.scroll_backward":
        this.trackBank.scrollBackwards();
        return "OK";
      case "track.bank.scroll_to_position":
        if (params && params[0] !== undefined) {
          this.trackBank.scrollPosition().set(params[0] as number);
          return "OK";
        }
        throw "Missing position parameter";
    }
    return undefined;
  }
}
