import type { ControllerModule, RequestParams, SendEvent } from "../types/controller";

export class CursorModule implements ControllerModule {
  private readonly cursorTrack: CursorTrack;
  private readonly cursorDevice: CursorDevice;
  private readonly cursorClip: CursorClip;
  private readonly remoteControlsBank: RemoteControlsPage;
  private readonly sendEvent: SendEvent;

  constructor(host: ControllerHost, sendEvent: SendEvent) {
    this.sendEvent = sendEvent;
    this.cursorTrack = host.createCursorTrack("MCP_CURSOR", "Cursor Track", 0, 0, true);

    this.cursorTrack.volume().markInterested();
    this.cursorTrack.pan().markInterested();
    this.cursorTrack.mute().markInterested();
    this.cursorTrack.solo().markInterested();
    this.cursorTrack.arm().markInterested();
    this.cursorTrack.name().markInterested();
    this.cursorTrack.color().markInterested();
    this.cursorTrack.exists().markInterested();
    this.cursorTrack.trackType().markInterested();
    this.cursorTrack.position().markInterested();

    this.cursorDevice = this.cursorTrack.createCursorDevice(
      "MCP_DEVICE",
      "Cursor Device",
      0,
      CursorDeviceFollowMode.FOLLOW_SELECTION
    );
    this.cursorDevice.name().markInterested();
    this.cursorDevice.isWindowOpen().markInterested();
    this.cursorDevice.isExpanded().markInterested();
    this.cursorDevice.isEnabled().markInterested();
    this.cursorDevice.exists().markInterested();
    this.cursorDevice.position().markInterested();

    this.cursorClip = this.cursorTrack.createLauncherCursorClip("MCP_CLIP", "Cursor Clip", 16, 128);
    this.cursorClip.exists().markInterested();
    this.cursorClip.getLoopLength().markInterested();
    this.cursorClip.getLoopStart().markInterested();
    this.cursorClip.getPlayStart().markInterested();
    this.cursorClip.getPlayStop().markInterested();
    this.cursorClip.color().markInterested();

    this.remoteControlsBank = this.cursorDevice.createCursorRemoteControlsPage(8);
    for (let i = 0; i < 8; i++) {
      const param = this.remoteControlsBank.getParameter(i);
      param.name().markInterested();
      param.value().markInterested();
      param.setIndication(true);

      param.name().addValueObserver((name) => {
        this.sendEvent("device.remote_control.update", { index: i, name });
      });
      param.value().addValueObserver((value) => {
        this.sendEvent("device.remote_control.update", { index: i, value });
      });
    }

    this.cursorTrack.name().addValueObserver((val) => {
      this.sendEvent("track.selected.update", { name: val });
    });
    this.cursorTrack.volume().addValueObserver((val) => {
      this.sendEvent("track.selected.update", { volume: val });
    });
    this.cursorTrack.pan().addValueObserver((val) => {
      this.sendEvent("track.selected.update", { pan: val });
    });
    this.cursorTrack.mute().addValueObserver((val) => {
      this.sendEvent("track.selected.update", { mute: val });
    });
    this.cursorTrack.solo().addValueObserver((val) => {
      this.sendEvent("track.selected.update", { solo: val });
    });
    this.cursorTrack.arm().addValueObserver((val) => {
      this.sendEvent("track.selected.update", { arm: val });
    });

    this.cursorDevice.name().addValueObserver((val) => {
      this.sendEvent("device.selected.update", { name: val });
    });
    this.cursorDevice.isWindowOpen().addValueObserver((val) => {
      this.sendEvent("device.selected.update", { isWindowOpen: val });
    });
    this.cursorDevice.isExpanded().addValueObserver((val) => {
      this.sendEvent("device.selected.update", { isExpanded: val });
    });
  }

  handleRequest(method: string, params?: RequestParams): unknown {
    switch (method) {
      case "track.selected.get_status":
        return {
          name: this.cursorTrack.name().get(),
          volume: this.cursorTrack.volume().get(),
          pan: this.cursorTrack.pan().get(),
          mute: this.cursorTrack.mute().get(),
          solo: this.cursorTrack.solo().get(),
          arm: this.cursorTrack.arm().get()
        };
      case "track.selected.volume":
        if (params && params[0] !== undefined) {
          this.cursorTrack.volume().set(params[0] as number);
          return "OK";
        }
        throw "Missing parameter";
      case "track.selected.pan":
        if (params && params[0] !== undefined) {
          this.cursorTrack.pan().set(params[0] as number);
          return "OK";
        }
        throw "Missing parameter";
      case "track.selected.mute":
        if (params && params[0] !== undefined) {
          this.cursorTrack.mute().set(params[0] as boolean);
          return "OK";
        }
        throw "Missing parameter";
      case "track.selected.solo":
        if (params && params[0] !== undefined) {
          this.cursorTrack.solo().set(params[0] as boolean);
          return "OK";
        }
        throw "Missing parameter";
      case "track.selected.arm":
        if (params && params[0] !== undefined) {
          this.cursorTrack.arm().set(params[0] as boolean);
          return "OK";
        }
        throw "Missing parameter";
      case "device.get_status":
        return {
          name: this.cursorDevice.name().get(),
          isWindowOpen: this.cursorDevice.isWindowOpen().get(),
          isExpanded: this.cursorDevice.isExpanded().get()
        };
      case "device.toggle_window":
        this.cursorDevice.isWindowOpen().toggle();
        return "OK";
      case "device.toggle_expanded":
        this.cursorDevice.isExpanded().toggle();
        return "OK";
      case "device.get_remote_controls": {
        const controls: Array<{ index: number; name: string; value: number }> = [];
        for (let i = 0; i < 8; i++) {
          const param = this.remoteControlsBank.getParameter(i);
          controls.push({
            index: i,
            name: param.name().get(),
            value: param.value().get()
          });
        }
        return controls;
      }
      case "device.set_remote_control":
        if (params && params[0] !== undefined && params[1] !== undefined) {
          this.remoteControlsBank.getParameter(params[0] as number).value().set(params[1] as number);
          return "OK";
        }
        throw "Missing parameters (index, value)";
      case "device.page_next":
        this.remoteControlsBank.selectNextPage(true);
        return "OK";
      case "device.page_previous":
        this.remoteControlsBank.selectPreviousPage(true);
        return "OK";
      case "device.select_next":
        this.cursorDevice.selectNext();
        return "OK";
      case "device.select_previous":
        this.cursorDevice.selectPrevious();
        return "OK";
      case "device.select_first":
        this.cursorDevice.selectFirst();
        return "OK";
      case "device.select_last":
        this.cursorDevice.selectLast();
        return "OK";
      case "device.browse_insert_before":
        this.cursorDevice.beforeDeviceInsertionPoint().browse();
        return "OK";
      case "device.browse_insert_after":
        if (this.cursorDevice.exists().get()) {
          this.cursorDevice.afterDeviceInsertionPoint().browse();
        } else {
          this.cursorDevice.beforeDeviceInsertionPoint().browse();
        }
        return "OK";
      case "device.browse_replace":
        if (this.cursorDevice.exists().get()) {
          this.cursorDevice.replaceDeviceInsertionPoint().browse();
        } else {
          this.cursorDevice.beforeDeviceInsertionPoint().browse();
        }
        return "OK";
      case "cursor_track.get_status":
        return {
          exists: this.cursorTrack.exists().get(),
          name: this.cursorTrack.name().get(),
          type: this.cursorTrack.trackType().get(),
          position: this.cursorTrack.position().get(),
          volume: this.cursorTrack.volume().get(),
          pan: this.cursorTrack.pan().get(),
          mute: this.cursorTrack.mute().get(),
          solo: this.cursorTrack.solo().get(),
          arm: this.cursorTrack.arm().get(),
          color: {
            red: this.cursorTrack.color().red(),
            green: this.cursorTrack.color().green(),
            blue: this.cursorTrack.color().blue()
          }
        };
      case "cursor_device.get_status":
        return {
          exists: this.cursorDevice.exists().get(),
          name: this.cursorDevice.name().get(),
          position: this.cursorDevice.position().get(),
          isEnabled: this.cursorDevice.isEnabled().get(),
          isWindowOpen: this.cursorDevice.isWindowOpen().get(),
          isExpanded: this.cursorDevice.isExpanded().get()
        };
      case "cursor_clip.get_status":
        return {
          exists: this.cursorClip.exists().get(),
          loopLength: this.cursorClip.getLoopLength().get(),
          loopStart: this.cursorClip.getLoopStart().get(),
          playStart: this.cursorClip.getPlayStart().get(),
          playStop: this.cursorClip.getPlayStop().get(),
          color: {
            red: this.cursorClip.color().red(),
            green: this.cursorClip.color().green(),
            blue: this.cursorClip.color().blue()
          }
        };
    }
    return undefined;
  }
}
