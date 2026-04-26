"use strict";
(() => {
  // bitwig-controller/modules/Application.ts
  var ApplicationModule = class {
    constructor(host2) {
      this.application = host2.createApplication();
    }
    handleRequest(method, _params) {
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
        case "application.undo":
          this.application.undo();
          return "OK";
        case "application.redo":
          this.application.redo();
          return "OK";
        case "application.cut":
          this.application.cut();
          return "OK";
        case "application.copy":
          this.application.copy();
          return "OK";
        case "application.paste":
          this.application.paste();
          return "OK";
        case "application.delete":
          this.application.remove();
          return "OK";
        case "application.duplicate":
          this.application.duplicate();
          return "OK";
        case "application.select_all":
          this.application.selectAll();
          return "OK";
        case "application.select_none":
          this.application.selectNone();
          return "OK";
        // Navigation
        case "application.arrow_key":
          if (_params && _params[0]) {
            const dir = _params[0];
            switch (dir) {
              case "up":
                this.application.arrowKeyUp();
                break;
              case "down":
                this.application.arrowKeyDown();
                break;
              case "left":
                this.application.arrowKeyLeft();
                break;
              case "right":
                this.application.arrowKeyRight();
                break;
            }
            return "OK";
          }
          throw "Missing direction for arrow_key";
        case "application.enter":
          this.application.enter();
          return "OK";
        case "application.escape":
          this.application.escape();
          return "OK";
        // View
        case "application.zoom_in":
          this.application.zoomIn();
          return "OK";
        case "application.zoom_out":
          this.application.zoomOut();
          return "OK";
      }
      return void 0;
    }
  };

  // bitwig-controller/modules/Browser.ts
  var BrowserModule = class {
    constructor(host2) {
      this.popupBrowser = host2.createPopupBrowser();
      this.popupBrowser.exists().markInterested();
      this.popupBrowser.resultsColumn().createCursorItem();
      this.resultBank = this.popupBrowser.resultsColumn().createItemBank(100);
      for (let i = 0; i < 100; i++) {
        this.resultBank.getItemAt(i).name().markInterested();
      }
    }
    handleRequest(method, params) {
      switch (method) {
        case "browser.get_status":
          return {
            exists: this.popupBrowser.exists().get(),
            filter: null
          };
        case "browser.list_results": {
          const items = [];
          for (let i = 0; i < 100; i++) {
            const item = this.resultBank.getItemAt(i);
            const name = item.name().get();
            if (name && name.length > 0) {
              items.push({ index: i, name });
            }
          }
          return items;
        }
        case "browser.select_result":
          if (params && params[0] !== void 0) {
            const index = params[0];
            const item = this.resultBank.getItemAt(index);
            if (item) {
              item.isSelected().set(true);
              return "OK";
            }
            return `Item not found at index ${index}`;
          }
          return "Missing index parameter";
        case "browser.set_filter":
          if (params && params[0] !== void 0) {
            this.popupBrowser.smartCollectionColumn().getWildcardFilter().set(params[0]);
            return "OK";
          }
          return "Missing filter text parameter";
        case "browser.commit":
          this.popupBrowser.commit();
          return "OK";
        case "browser.cancel":
          this.popupBrowser.cancel();
          return "OK";
      }
      return void 0;
    }
  };

  // bitwig-controller/modules/Clip.ts
  var ClipModule = class {
    constructor(host2, sendEvent) {
      this.cursorClip = host2.createCursorClip(16, 128);
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
    handleRequest(method, params) {
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
          if (params && params[0] !== void 0 && params[1] !== void 0 && params[2] !== void 0 && params[3] !== void 0) {
            const step = params[0];
            const pitch = params[1];
            const velocity = params[2];
            const duration = params[3];
            this.cursorClip.setStep(0, step, pitch, velocity, duration);
            return "OK";
          }
          throw "Missing parameters (step, pitch, velocity, duration)";
        case "clip.clear_note":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            const step = params[0];
            const pitch = params[1];
            this.cursorClip.clearStep(0, step, pitch);
            return "OK";
          }
          throw "Missing parameters (step, pitch)";
        case "clip.toggle_note":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            const step = params[0];
            const pitch = params[1];
            const velocity = params[2] || 1;
            this.cursorClip.toggleStep(step, pitch, velocity);
            return "OK";
          }
          throw "Missing parameters (step, pitch)";
        case "clip.get_notes":
          if (params && params[0] !== void 0 && params[1] !== void 0 && params[2] !== void 0) {
            return {
              message: "Note reading requires observer pattern - use clip.get_info for now",
              startStep: params[0],
              stepCount: params[1],
              pitch: params[2]
            };
          }
          throw "Missing parameters (startStep, stepCount, pitch)";
      }
      return void 0;
    }
  };

  // bitwig-controller/modules/Cursor.ts
  var CursorModule = class {
    constructor(host2, sendEvent) {
      this.sendEvent = sendEvent;
      this.cursorTrack = host2.createCursorTrack("MCP_CURSOR", "Cursor Track", 0, 0, true);
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
    handleRequest(method, params) {
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
          if (params && params[0] !== void 0) {
            this.cursorTrack.volume().set(params[0]);
            return "OK";
          }
          throw "Missing parameter";
        case "track.selected.pan":
          if (params && params[0] !== void 0) {
            this.cursorTrack.pan().set(params[0]);
            return "OK";
          }
          throw "Missing parameter";
        case "track.selected.mute":
          if (params && params[0] !== void 0) {
            this.cursorTrack.mute().set(params[0]);
            return "OK";
          }
          throw "Missing parameter";
        case "track.selected.solo":
          if (params && params[0] !== void 0) {
            this.cursorTrack.solo().set(params[0]);
            return "OK";
          }
          throw "Missing parameter";
        case "track.selected.arm":
          if (params && params[0] !== void 0) {
            this.cursorTrack.arm().set(params[0]);
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
          const controls = [];
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
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.remoteControlsBank.getParameter(params[0]).value().set(params[1]);
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
          this.cursorDevice.browseToInsertBeforeDevice();
          return "OK";
        case "device.browse_insert_after":
          this.cursorDevice.browseToInsertAfterDevice();
          return "OK";
        case "device.browse_replace":
          this.cursorDevice.browseToReplaceDevice();
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
      return void 0;
    }
  };

  // bitwig-controller/modules/Device.ts
  var DeviceModule = class {
    constructor(trackBank) {
      this.deviceBanks = [];
      this.trackBank = trackBank;
      for (let i = 0; i < 8; i++) {
        const track = this.trackBank.getItemAt(i);
        const deviceBank = track.createDeviceBank(8);
        for (let j = 0; j < 8; j++) {
          const device = deviceBank.getItemAt(j);
          device.name().markInterested();
          device.isEnabled().markInterested();
          device.exists().markInterested();
        }
        this.deviceBanks.push(deviceBank);
      }
    }
    handleRequest(method, params) {
      switch (method) {
        case "device.list":
          if (params && params[0] !== void 0) {
            const trackIndex = params[0];
            if (trackIndex < 0 || trackIndex >= 8) throw "Track index out of range (0-7)";
            const devices = [];
            const deviceBank = this.deviceBanks[trackIndex];
            for (let i = 0; i < 8; i++) {
              const device = deviceBank.getItemAt(i);
              if (device.exists().get()) {
                devices.push({
                  index: i,
                  name: device.name().get(),
                  enabled: device.isEnabled().get()
                });
              }
            }
            return devices;
          }
          throw "Missing trackIndex parameter";
        case "device.bypass":
          if (params && params[0] !== void 0 && params[1] !== void 0 && params[2] !== void 0) {
            const trackIndex = params[0];
            const deviceIndex = params[1];
            const state = params[2];
            const device = this.deviceBanks[trackIndex].getItemAt(deviceIndex);
            device.isEnabled().set(!state);
            return "OK";
          }
          throw "Missing parameters (trackIndex, deviceIndex, bypassState)";
        case "device.delete":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            const trackIndex = params[0];
            const deviceIndex = params[1];
            this.deviceBanks[trackIndex].getItemAt(deviceIndex).deleteObject();
            return "OK";
          }
          throw "Missing parameters (trackIndex, deviceIndex)";
      }
      return void 0;
    }
  };

  // bitwig-controller/modules/Mixer.ts
  var MixerModule = class {
    constructor(host2) {
      this.masterTrack = host2.createMasterTrack(0);
      this.masterTrack.volume().markInterested();
      this.masterTrack.pan().markInterested();
      this.effectTrackBank = host2.createEffectTrackBank(8, 2, 8);
      for (let i = 0; i < 8; i++) {
        const track = this.effectTrackBank.getItemAt(i);
        track.volume().markInterested();
        track.pan().markInterested();
        track.mute().markInterested();
        track.solo().markInterested();
        track.name().markInterested();
      }
    }
    handleRequest(method, params) {
      switch (method) {
        case "mixer.master.get_volume":
          return this.masterTrack.volume().get();
        case "mixer.master.set_volume":
          if (params && params[0] !== void 0) {
            this.masterTrack.volume().set(params[0]);
            return "OK";
          }
          throw "Missing volume parameter";
        case "mixer.return.list": {
          const tracks = [];
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
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.effectTrackBank.getItemAt(params[0]).volume().set(params[1]);
            return "OK";
          }
          throw "Missing parameters (index, value)";
        case "mixer.return.pan":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.effectTrackBank.getItemAt(params[0]).pan().set(params[1]);
            return "OK";
          }
          throw "Missing parameters (index, value)";
      }
      return void 0;
    }
  };

  // bitwig-controller/modules/SceneBank.ts
  var SceneBankModule = class {
    constructor(host2) {
      this.sceneBank = host2.createSceneBank(8);
      this.project = host2.getProject();
      for (let i = 0; i < 8; i++) {
        const scene = this.sceneBank.getScene(i);
        scene.name().markInterested();
        scene.sceneIndex().markInterested();
      }
    }
    handleRequest(method, params) {
      switch (method) {
        case "scene.launch":
          if (params && params[0] !== void 0) {
            this.sceneBank.getScene(params[0]).launch();
            return "OK";
          }
          throw "Missing parameters";
        case "scene.select":
          if (params && params[0] !== void 0) {
            this.sceneBank.getScene(params[0]).selectInEditor();
            return "OK";
          }
          throw "Missing parameters";
        case "scene.create_from_playing":
          this.project.createSceneFromPlayingLauncherClips();
          return "OK";
        case "scene.list": {
          const scenes = [];
          for (let i = 0; i < 8; i++) {
            const scene = this.sceneBank.getScene(i);
            scenes.push({
              index: i,
              name: scene.name().get()
            });
          }
          return scenes;
        }
        case "scene.create":
          this.sceneBank.createScene();
          return "OK";
        case "scene.delete":
          if (params && params[0] !== void 0) {
            this.sceneBank.getScene(params[0]).deleteObject();
            return "OK";
          }
          throw "Missing sceneIndex parameter";
        case "scene.rename":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.sceneBank.getScene(params[0]).name().set(params[1]);
            return "OK";
          }
          throw "Missing parameters (sceneIndex, name)";
      }
      return void 0;
    }
  };

  // bitwig-controller/modules/TrackBank.ts
  var TrackBankModule = class {
    constructor(host2, sendEvent) {
      this.trackBank = host2.createMainTrackBank(8, 2, 8);
      this.trackBank.followCursorTrack(host2.createCursorTrack(0, 0));
      this.sendEvent = sendEvent;
      for (let i = 0; i < 8; i++) {
        this.initTrack(i);
      }
    }
    initTrack(index) {
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
    handleRequest(method, params) {
      switch (method) {
        case "track.bank.get_status": {
          const tracks = [];
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
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.trackBank.getItemAt(params[0]).volume().set(params[1]);
            return "OK";
          }
          throw "Missing parameters";
        case "track.bank.pan":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.trackBank.getItemAt(params[0]).pan().set(params[1]);
            return "OK";
          }
          throw "Missing parameters";
        case "track.bank.mute":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.trackBank.getItemAt(params[0]).mute().set(params[1]);
            return "OK";
          }
          throw "Missing parameters";
        case "track.bank.solo":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.trackBank.getItemAt(params[0]).solo().set(params[1]);
            return "OK";
          }
          throw "Missing parameters";
        case "track.bank.select":
          if (params && params[0] !== void 0) {
            this.trackBank.getItemAt(params[0]).selectInMixer();
            return "OK";
          }
          throw "Missing parameters";
        case "track.delete":
          if (params && params[0] !== void 0) {
            this.trackBank.getItemAt(params[0]).deleteObject();
            return "OK";
          }
          throw "Missing parameter";
        case "track.rename":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.trackBank.getItemAt(params[0]).name().set(params[1]);
            return "OK";
          }
          throw "Missing parameters";
        case "track.duplicate":
          if (params && params[0] !== void 0) {
            this.trackBank.getItemAt(params[0]).duplicate();
            return "OK";
          }
          throw "Missing parameter";
        case "track.set_color":
          if (params && params[0] !== void 0 && params[1] !== void 0 && params[2] !== void 0 && params[3] !== void 0) {
            this.trackBank.getItemAt(params[0]).color().set(
              params[1],
              params[2],
              params[3]
            );
            return "OK";
          }
          throw "Missing parameters";
        case "clip.launch":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().getItemAt(params[1]).launch();
            return "OK";
          }
          throw "Missing parameters";
        case "clip.record":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().getItemAt(params[1]).record();
            return "OK";
          }
          throw "Missing parameters";
        case "clip.stop":
          if (params && params[0] !== void 0) {
            this.trackBank.getItemAt(params[0]).stop();
            return "OK";
          }
          throw "Missing parameters";
        case "clip.duplicate":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().duplicateClip(params[1]);
            return "OK";
          }
          throw "Missing parameters (trackIndex, slotIndex)";
        case "clip.select_slot":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().select(params[1]);
            return "OK";
          }
          throw "Missing parameters (trackIndex, slotIndex)";
        case "clip.create":
          if (params && params[0] !== void 0 && params[1] !== void 0 && params[2] !== void 0) {
            this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().getItemAt(params[1]).createEmptyClip(params[2]);
            return "OK";
          }
          throw "Missing parameters (trackIndex, slotIndex, length)";
        case "clip.delete":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().deleteClip(params[1]);
            return "OK";
          }
          throw "Missing parameters (trackIndex, slotIndex)";
        case "clip.browse_insert":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().getItemAt(params[1]).browseToInsertClip();
            return "OK";
          }
          throw "Missing parameters (trackIndex, slotIndex)";
        case "clip.get_status":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            const trackIdx = params[0];
            const sceneIdx = params[1];
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
          const grid = [];
          for (let t = 0; t < 8; t++) {
            const trackSlots = [];
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
          if (params && params[0] !== void 0 && params[1] !== void 0 && params[2] !== void 0 && params[3] !== void 0 && params[4] !== void 0) {
            const trackIdx = params[0];
            const sceneIdx = params[1];
            const red = params[2];
            const green = params[3];
            const blue = params[4];
            this.trackBank.getItemAt(trackIdx).clipLauncherSlotBank().getItemAt(sceneIdx).color().set(red, green, blue);
            return "OK";
          }
          throw "Missing parameters (trackIndex, sceneIndex, r, g, b)";
        case "clip.get_color":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            const trackIdx = params[0];
            const sceneIdx = params[1];
            const clipColor = this.trackBank.getItemAt(trackIdx).clipLauncherSlotBank().getItemAt(sceneIdx).color();
            return {
              r: clipColor.red(),
              g: clipColor.green(),
              b: clipColor.blue()
            };
          }
          throw "Missing parameters (trackIndex, sceneIndex)";
        case "mixer.track.get_send":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            return this.trackBank.getItemAt(params[0]).sendBank().getItemAt(params[1]).get();
          }
          throw "Missing parameters";
        case "mixer.track.set_send":
          if (params && params[0] !== void 0 && params[1] !== void 0 && params[2] !== void 0) {
            this.trackBank.getItemAt(params[0]).sendBank().getItemAt(params[1]).set(params[2]);
            return "OK";
          }
          throw "Missing parameters";
        case "track.list": {
          const allTracks = [];
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
          if (params && params[0] !== void 0) {
            const track = this.trackBank.getItemAt(params[0]);
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
          if (params && params[0] !== void 0) {
            const track = this.trackBank.getItemAt(params[0]);
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
          if (params && params[0] !== void 0) {
            this.trackBank.scrollPosition().set(params[0]);
            return "OK";
          }
          throw "Missing position parameter";
      }
      return void 0;
    }
  };

  // bitwig-controller/modules/Transport.ts
  var TransportModule = class {
    constructor(host2, sendEvent) {
      this.transport = host2.createTransport();
      this.sendEvent = sendEvent;
      this.transport.tempo().value().markInterested();
      this.transport.getPosition().markInterested();
      this.transport.isPlaying().markInterested();
      this.transport.isArrangerRecordEnabled().markInterested();
      this.transport.isArrangerLoopEnabled().markInterested();
      this.transport.getInPosition().markInterested();
      this.transport.getOutPosition().markInterested();
      this.transport.isMetronomeEnabled().markInterested();
      this.transport.timeSignature().numerator().markInterested();
      this.transport.timeSignature().denominator().markInterested();
      this.transport.isPunchInEnabled().markInterested();
      this.transport.isPunchOutEnabled().markInterested();
      this.transport.isArrangerOverdubEnabled().markInterested();
      this.transport.isClipLauncherOverdubEnabled().markInterested();
      this.transport.isPlaying().addValueObserver((isPlaying) => {
        this.sendEvent("transport.state", { isPlaying });
      });
      this.transport.tempo().value().addRawValueObserver((tempo) => {
        this.sendEvent("transport.state", { tempo });
      });
    }
    handleRequest(method, params) {
      switch (method) {
        case "transport.get_status":
          return {
            isPlaying: this.transport.isPlaying().get(),
            isRecording: this.transport.isArrangerRecordEnabled().get(),
            tempo: this.transport.tempo().value().getRaw(),
            position: this.transport.getPosition().get(),
            timeSignature: `${this.transport.timeSignature().numerator().get()}/${this.transport.timeSignature().denominator().get()}`,
            loop: {
              enabled: this.transport.isArrangerLoopEnabled().get(),
              start: this.transport.getInPosition().get(),
              end: this.transport.getOutPosition().get()
            },
            punch: {
              in: this.transport.isPunchInEnabled().get(),
              out: this.transport.isPunchOutEnabled().get()
            },
            overdub: {
              arranger: this.transport.isArrangerOverdubEnabled().get(),
              launcher: this.transport.isClipLauncherOverdubEnabled().get()
            },
            metronome: this.transport.isMetronomeEnabled().get()
          };
        case "transport.play":
          this.transport.play();
          return "OK";
        case "transport.stop":
          this.transport.stop();
          return "OK";
        case "transport.restart":
          this.transport.restart();
          return "OK";
        case "transport.record":
          this.transport.record();
          return "OK";
        case "transport.getTempo":
          return this.transport.tempo().value().getRaw();
        case "transport.setTempo":
          if (params && params[0]) {
            this.transport.tempo().value().setRaw(params[0]);
            return "OK";
          }
          throw "Missing tempo parameter";
        case "transport.getPosition":
          return this.transport.getPosition().get();
        case "transport.setPosition":
          if (params && params[0]) {
            this.transport.getPosition().set(params[0]);
            return "OK";
          }
          throw "Missing position parameter";
        case "transport.getIsPlaying":
          return this.transport.isPlaying().get();
        case "transport.getIsRecording":
          return this.transport.isArrangerRecordEnabled().get();
        case "transport.toggleLoop":
          this.transport.isArrangerLoopEnabled().toggle();
          return "OK";
        case "transport.setLoopStart":
          if (params && params[0] !== void 0) {
            this.transport.getInPosition().set(params[0]);
            return "OK";
          }
          throw "Missing loop start parameter";
        case "transport.setLoopEnd":
          if (params && params[0] !== void 0) {
            this.transport.getOutPosition().set(params[0]);
            return "OK";
          }
          throw "Missing loop end parameter";
        case "transport.getLoopStatus":
          return {
            enabled: this.transport.isArrangerLoopEnabled().get(),
            start: this.transport.getInPosition().get(),
            end: this.transport.getOutPosition().get()
          };
        case "transport.toggle_metronome":
          this.transport.isMetronomeEnabled().toggle();
          return "OK";
        case "transport.time_signature":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            this.transport.timeSignature().set(params[0], params[1]);
            return "OK";
          }
          return `${this.transport.timeSignature().numerator().get()}/${this.transport.timeSignature().denominator().get()}`;
        case "transport.tap_tempo":
          this.transport.tapTempo();
          return "OK";
        case "transport.toggle_punch_in":
          this.transport.isPunchInEnabled().toggle();
          return "OK";
        case "transport.toggle_punch_out":
          this.transport.isPunchOutEnabled().toggle();
          return "OK";
        case "transport.set_punch_in":
          if (params && params[0] !== void 0) {
            this.transport.isPunchInEnabled().set(params[0]);
            return "OK";
          }
          throw "Missing punch in state parameter";
        case "transport.set_punch_out":
          if (params && params[0] !== void 0) {
            this.transport.isPunchOutEnabled().set(params[0]);
            return "OK";
          }
          throw "Missing punch out state parameter";
        case "transport.get_punch_status":
          return {
            punchIn: this.transport.isPunchInEnabled().get(),
            punchOut: this.transport.isPunchOutEnabled().get()
          };
        case "transport.toggle_arranger_overdub":
          this.transport.isArrangerOverdubEnabled().toggle();
          return "OK";
        case "transport.toggle_launcher_overdub":
          this.transport.isClipLauncherOverdubEnabled().toggle();
          return "OK";
        case "transport.get_overdub_status":
          return {
            arranger: this.transport.isArrangerOverdubEnabled().get(),
            launcher: this.transport.isClipLauncherOverdubEnabled().get()
          };
        case "transport.continue_playback":
          this.transport.continuePlayback();
          return "OK";
        case "transport.return_to_zero":
          this.transport.returnToZero();
          return "OK";
        case "transport.fast_forward":
          this.transport.fastForward();
          return "OK";
        case "transport.rewind":
          this.transport.rewind();
          return "OK";
        case "transport.nudge_forward":
          this.transport.incPosition(1, false);
          return "OK";
        case "transport.nudge_backward":
          this.transport.incPosition(-1, false);
          return "OK";
        case "transport.add_cue_marker":
          this.transport.addCueMarkerAtPlaybackPosition();
          return "OK";
      }
      return void 0;
    }
  };

  // bitwig-controller/modules/HardwareSurface.ts
  var HardwareSurfaceModule = class {
    constructor(host2) {
      this.controls = /* @__PURE__ */ new Map();
      this.surface = host2.createHardwareSurface();
    }
    handleRequest(method, params) {
      var _a;
      switch (method) {
        case "hardware.create_slider":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            const id = params[0];
            const label = params[1];
            const isHorizontal = params[2];
            this.createSlider(id, label, isHorizontal);
            return "OK";
          }
          throw "Missing parameters (id, label)";
        case "hardware.create_knob":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            const id = params[0];
            const label = params[1];
            const isAbsolute = params[2];
            this.createKnob(id, label, isAbsolute);
            return "OK";
          }
          throw "Missing parameters (id, label)";
        case "hardware.create_button":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            const id = params[0];
            const label = params[1];
            this.createButton(id, label);
            return "OK";
          }
          throw "Missing parameters (id, label)";
        case "hardware.create_light":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            const id = params[0];
            const label = params[1];
            const linkedButtonId = params[2];
            this.createLight(id, label, linkedButtonId);
            return "OK";
          }
          throw "Missing parameters (id, label)";
        case "hardware.bind_cc":
          if (params && params[0] !== void 0 && params[1] !== void 0 && params[2] !== void 0) {
            const id = params[0];
            const channel = params[1];
            const cc = params[2];
            const isAbsolute = (_a = params[3]) != null ? _a : true;
            this.bindCC(id, channel, cc, isAbsolute);
            return "OK";
          }
          throw "Missing parameters (id, channel, cc)";
        case "hardware.bind_note":
          if (params && params[0] !== void 0 && params[1] !== void 0 && params[2] !== void 0) {
            const id = params[0];
            const channel = params[1];
            const note = params[2];
            this.bindNote(id, channel, note);
            return "OK";
          }
          throw "Missing parameters (id, channel, note)";
        case "hardware.update":
          this.surface.updateHardware();
          return "OK";
        case "hardware.invalidate":
          this.surface.invalidateHardwareOutputState();
          return "OK";
        case "hardware.get_controls":
          return this.getControls();
        // Inspection of controls
        case "hardware.control.get_value":
          if (params && params[0] !== void 0) {
            return this.getControlValue(params[0]);
          }
          throw "Missing parameter (id)";
      }
      return void 0;
    }
    createSlider(id, label, isHorizontal) {
      const slider = this.surface.createHardwareSlider(id);
      slider.setLabel(label);
      if (isHorizontal) {
        slider.setOrientation(Orientation.HORIZONTAL);
      } else {
        slider.setOrientation(Orientation.VERTICAL);
      }
      slider.value().markInterested();
      this.controls.set(id, slider);
    }
    createKnob(id, label, isAbsolute) {
      if (isAbsolute) {
        const knob = this.surface.createAbsoluteHardwareKnob(id);
        knob.setLabel(label);
        knob.value().markInterested();
        this.controls.set(id, knob);
      } else {
        const knob = this.surface.createRelativeHardwareKnob(id);
        knob.setLabel(label);
        this.controls.set(id, knob);
      }
    }
    createButton(id, label) {
      const button = this.surface.createHardwareButton(id);
      button.setLabel(label);
      button.isPressed().markInterested();
      this.controls.set(id, button);
    }
    createLight(id, label, linkedButtonId) {
      const light = this.surface.createMultiStateHardwareLight(id);
      light.setLabel(label);
      light.isOn().markInterested();
      light.color().markInterested();
      if (linkedButtonId) {
        const button = this.controls.get(linkedButtonId);
        if (button && "setBackgroundLight" in button) {
          button.setBackgroundLight(light);
        }
      }
      this.controls.set(id, light);
    }
    bindCC(id, channel, cc, isAbsolute) {
      const control = this.controls.get(id);
      if (!control) throw `Control not found: ${id}`;
      const port = host.getMidiIn(0);
      if (isAbsolute) {
        const matcher = port.createAbsoluteCCValueMatcher(channel, cc);
        if ("setAdjustValueMatcher" in control) {
          control.setAdjustValueMatcher(matcher);
        }
      } else {
        const matcher = port.createRelativeSignedBitCCValueMatcher(channel, cc, 128);
        if ("setAdjustValueMatcher" in control) {
          control.setAdjustValueMatcher(matcher);
        }
      }
      if ("pressedAction" in control) {
        const actionMatcher = port.createCCActionMatcher(channel, cc, 127);
        control.pressedAction().setActionMatcher(actionMatcher);
      }
    }
    bindNote(id, channel, note) {
      const control = this.controls.get(id);
      if (!control) throw `Control not found: ${id}`;
      const port = host.getMidiIn(0);
      if ("pressedAction" in control) {
        const matcher = port.createNoteOnActionMatcher(channel, note);
        control.pressedAction().setActionMatcher(matcher);
      } else {
        throw "Binding notes to non-buttons not fully supported yet";
      }
    }
    getControls() {
      const list = [];
      this.controls.forEach((control, id) => {
        let type = "unknown";
        if ("value" in control) {
          type = "knob/slider";
        } else if ("isPressed" in control) {
          type = "button";
        }
        list.push({
          id,
          label: control.getName(),
          type
        });
      });
      return list;
    }
    getControlValue(id) {
      const control = this.controls.get(id);
      if (!control) throw `Control not found: ${id}`;
      const c = control;
      if (typeof c.value === "function") {
        return c.value().get();
      }
      if (typeof c.isPressed === "function") {
        return c.isPressed().get();
      }
      return null;
    }
  };

  // bitwig-controller/modules/Arranger.ts
  var ArrangerModule = class {
    constructor(host2, sendEvent, application) {
      this.arranger = host2.createArranger();
      this.cueMarkerBank = this.arranger.createCueMarkerBank(32);
      this.sendEvent = sendEvent;
      this.application = application;
      this.arranger.isTimelineVisible().markInterested();
      this.arranger.isIoSectionVisible().markInterested();
      this.arranger.isClipLauncherVisible().markInterested();
      this.arranger.areEffectTracksVisible().markInterested();
      this.arranger.hasDoubleRowTrackHeight().markInterested();
      this.arranger.areCueMarkersVisible().markInterested();
      this.arranger.isPlaybackFollowEnabled().markInterested();
      this.cueMarkerBank.cursorIndex().markInterested();
      this.cueMarkerBank.itemCount().markInterested();
      for (let i = 0; i < 32; i++) {
        const marker = this.cueMarkerBank.getItemAt(i);
        marker.name().markInterested();
        marker.position().markInterested();
        marker.color().markInterested();
        marker.exists().markInterested();
      }
    }
    handleRequest(method, params) {
      const args = params;
      switch (method) {
        case "arranger.get_status":
          return {
            isTimelineVisible: this.arranger.isTimelineVisible().get(),
            isIoSectionVisible: this.arranger.isIoSectionVisible().get(),
            isClipLauncherVisible: this.arranger.isClipLauncherVisible().get(),
            areEffectTracksVisible: this.arranger.areEffectTracksVisible().get(),
            hasDoubleRowTrackHeight: this.arranger.hasDoubleRowTrackHeight().get(),
            areCueMarkersVisible: this.arranger.areCueMarkersVisible().get(),
            isPlaybackFollowEnabled: this.arranger.isPlaybackFollowEnabled().get()
          };
        case "arranger.set_panel_visibility":
          if (!args || args.length < 2) throw "Missing params. Expecting [panel_name, state]";
          const panel = args[0];
          const state = args[1];
          switch (panel) {
            case "timeline":
              this.arranger.isTimelineVisible().set(state);
              break;
            case "io":
              this.arranger.isIoSectionVisible().set(state);
              break;
            case "clip_launcher":
              this.arranger.isClipLauncherVisible().set(state);
              break;
            case "effect_tracks":
              this.arranger.areEffectTracksVisible().set(state);
              break;
            case "double_row_height":
              this.arranger.hasDoubleRowTrackHeight().set(state);
              break;
            case "cue_markers":
              this.arranger.areCueMarkersVisible().set(state);
              break;
            case "playback_follow":
              this.arranger.isPlaybackFollowEnabled().set(state);
              break;
            default:
              throw `Unknown panel: ${panel}`;
          }
          return "OK";
        case "arranger.zoom":
          if (!args || args.length < 1) throw "Missing zoom action";
          const action = args[0];
          switch (action) {
            case "in_all":
              this.arranger.zoomInLaneHeightsAll();
              break;
            case "out_all":
              this.arranger.zoomOutLaneHeightsAll();
              break;
            case "in_selected":
              this.arranger.zoomInLaneHeightsSelected();
              break;
            case "out_selected":
              this.arranger.zoomOutLaneHeightsSelected();
              break;
            default:
              throw `Unknown zoom action: ${action}`;
          }
          return "OK";
        case "arranger.cues.list":
          const markers = [];
          for (let i = 0; i < 32; i++) {
            const marker = this.cueMarkerBank.getItemAt(i);
            if (marker.exists().get()) {
              markers.push({
                index: i,
                name: marker.name().get(),
                position: marker.position().get(),
                color: {
                  r: marker.color().red(),
                  g: marker.color().green(),
                  b: marker.color().blue()
                }
              });
            }
          }
          return markers;
        case "arranger.cues.jump":
          if (args && args[0] !== void 0) {
            const index = args[0];
            const marker = this.cueMarkerBank.getItemAt(index);
            if (marker.exists().get()) {
              marker.launch(true);
              return "OK";
            } else {
              throw `Marker at index ${index} does not exist`;
            }
          }
          throw "Missing marker index";
        case "arranger.cues.create":
          throw "Use transport.add_cue_marker to create cues at playback position.";
        case "arranger.cues.rename":
          if (args && args[0] !== void 0 && args[1] !== void 0) {
            const index = args[0];
            const name = args[1];
            const marker = this.cueMarkerBank.getItemAt(index);
            if (marker.exists().get()) {
              marker.name().set(name);
              return "OK";
            }
            throw `Marker at index ${index} does not exist`;
          }
          throw "Missing parameters (index, name)";
        case "arranger.cues.color":
          if (args && args.length >= 4) {
            const index = args[0];
            const r = args[1];
            const g = args[2];
            const b = args[3];
            const marker = this.cueMarkerBank.getItemAt(index);
            if (marker.exists().get()) {
              marker.color().set(r, g, b);
              return "OK";
            }
            throw `Marker at index ${index} does not exist`;
          }
          throw "Missing parameters (index, r, g, b)";
        case "arranger.cues.launch":
          if (args && args[0] !== void 0) {
            const index = args[0];
            const marker = this.cueMarkerBank.getItemAt(index);
            if (marker.exists().get()) {
              marker.launch(true);
              return "OK";
            }
            throw `Marker at index ${index} does not exist`;
          }
          throw "Missing parameters (index)";
      }
      return void 0;
    }
  };

  // bitwig-controller/modules/NoteInput.ts
  var NoteInputModule = class {
    constructor(host2) {
      this.noteInput = host2.getMidiIn(0).createNoteInput("MCP Notes", "80????", "90????", "A0????", "B0????", "D0????", "E0????");
      this.noteInput.setShouldConsumeEvents(false);
    }
    handleRequest(method, params) {
      const args = params;
      switch (method) {
        case "note_input.send_raw_midi":
          if (!args || args.length < 3) throw "Missing params. Expecting [status, data1, data2]";
          this.noteInput.sendRawMidiEvent(args[0], args[1], args[2]);
          return "OK";
        case "note_input.send_note_on":
          if (!args || args.length < 3) throw "Missing params. Expecting [channel, key, velocity]";
          this.noteInput.sendNoteOn(args[0], args[1], args[2]);
          return "OK";
        case "note_input.send_note_off":
          if (!args || args.length < 3) throw "Missing params. Expecting [channel, key, velocity]";
          this.noteInput.sendNoteOff(args[0], args[1], args[2]);
          return "OK";
        case "note_input.send_poly_aftertouch":
          if (!args || args.length < 3) throw "Missing params. Expecting [channel, key, pressure]";
          this.noteInput.sendPolyphonicAftertouch(args[0], args[1], args[2]);
          return "OK";
      }
      return void 0;
    }
  };

  // bitwig-controller/modules/Midi.ts
  var MidiModule = class {
    constructor(host2, sendEvent) {
      this.sendEvent = sendEvent;
      this.midiIn = host2.getMidiIn(0);
      this.midiOut = host2.getMidiOutPort(0);
      this.midiIn.setMidiCallback((status, data1, data2) => {
        this.sendEvent("midi.short_message", { status, data1, data2 });
      });
      this.midiIn.setSysexCallback((data) => {
        this.sendEvent("midi.sysex", { data });
      });
    }
    handleRequest(method, params) {
      switch (method) {
        case "midi.send_short":
          if (params && params[0] !== void 0 && params[1] !== void 0 && params[2] !== void 0) {
            this.midiOut.sendMidi(params[0], params[1], params[2]);
            return "OK";
          }
          throw "Missing parameters (status, data1, data2)";
        case "midi.send_sysex":
          if (params && params[0] !== void 0) {
            this.midiOut.sendSysex(params[0]);
            return "OK";
          }
          throw "Missing parameter (hexString)";
      }
      return void 0;
    }
  };

  // bitwig-controller/modules/Osc.ts
  var OscModule = class {
    constructor(host2, sendEvent) {
      this.sendEvent = sendEvent;
      this.oscConnection = null;
      this.oscModule = host2.getOscModule();
      this.oscAddressSpace = this.oscModule.createAddressSpace();
      this.oscAddressSpace.registerDefaultMethod((connection, message) => {
        this.sendEvent("osc.message", {
          addressPattern: message.getAddressPattern(),
          typeTagPattern: message.getTypeTagPattern(),
          arguments: message.getArguments()
        });
      });
    }
    handleRequest(method, params) {
      switch (method) {
        case "osc.start_server":
          if (params && params[0] !== void 0) {
            const port = params[0];
            this.oscModule.createUdpServer(port, this.oscAddressSpace);
            return "OK";
          }
          throw "Missing parameter (port)";
        case "osc.connect":
          if (params && params[0] !== void 0 && params[1] !== void 0) {
            const host2 = params[0];
            const port = params[1];
            this.oscConnection = this.oscModule.connectToUdpServer(host2, port, this.oscAddressSpace);
            return "OK";
          }
          throw "Missing parameters (host, port)";
        case "osc.send":
          if (this.oscConnection) {
            if (params && params[0] !== void 0) {
              const address = params[0];
              const args = params.slice(1);
              this.oscConnection.sendMessage(address, ...args);
              return "OK";
            }
            throw "Missing parameter (address)";
          }
          throw "OSC Connection not established. Call osc.connect first.";
      }
      return void 0;
    }
  };

  // bitwig-controller/controller-mcp.ts
  loadAPI(25);
  host.defineController("BitwigPOC", "BitwigPOC", "0.2", "761be710-90df-4577-8094-01314323214c", "Laurent Huzard");
  var modules = [];
  var activeConnection = null;
  function init() {
    const sendEvent = (method, params) => {
      if (!activeConnection) return;
      sendJSON(activeConnection, { jsonrpc: "2.0", method, params });
    };
    modules.push(new TransportModule(host, sendEvent));
    const trackBankModule = new TrackBankModule(host, sendEvent);
    modules.push(trackBankModule);
    modules.push(new SceneBankModule(host));
    modules.push(new MixerModule(host));
    modules.push(new CursorModule(host, sendEvent));
    const applicationModule = new ApplicationModule(host);
    modules.push(applicationModule);
    modules.push(new DeviceModule(trackBankModule.trackBank));
    modules.push(new ClipModule(host, sendEvent));
    modules.push(new BrowserModule(host));
    modules.push(new HardwareSurfaceModule(host));
    modules.push(new ArrangerModule(host, sendEvent, applicationModule.application));
    modules.push(new NoteInputModule(host));
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
          const request = JSON.parse(msgString);
          handleRequest(request, remoteConnection);
        } catch (error) {
          println(`Error parsing JSON: ${String(error)}`);
          sendError(remoteConnection, null, -32700, "Parse error");
        }
      });
    });
  }
  function handleRequest(request, connection) {
    var _a, _b, _c, _d;
    if (!request.method) {
      sendError(connection, (_a = request.id) != null ? _a : null, -32600, "Invalid Request");
      return;
    }
    let result;
    let handled = false;
    if (request.method === "ping") {
      result = "pong";
      handled = true;
    } else if (request.method === "project.get_summary") {
      const summary = {
        transport: null,
        tracks: [],
        scenes: [],
        selection: {
          track: null,
          device: null,
          clip: null
        },
        mixer: {
          masterVolume: null
        },
        arranger: null
      };
      for (const module of modules) {
        try {
          if (module instanceof TransportModule) summary.transport = module.handleRequest("transport.get_status");
          if (module instanceof TrackBankModule) summary.tracks = module.handleRequest("track.list");
          if (module instanceof SceneBankModule) summary.scenes = module.handleRequest("scene.list");
          if (module instanceof CursorModule) {
            summary.selection.track = module.handleRequest("cursor_track.get_status");
            summary.selection.device = module.handleRequest("cursor_device.get_status");
            summary.selection.clip = module.handleRequest("cursor_clip.get_status");
          }
          if (module instanceof MixerModule) {
            summary.mixer.masterVolume = module.handleRequest("mixer.master.get_volume");
          }
          if (module instanceof ArrangerModule) {
            summary.arranger = module.handleRequest("arranger.get_status");
          }
        } catch (e) {
        }
      }
      result = summary;
      handled = true;
    } else {
      for (const module of modules) {
        try {
          const response = module.handleRequest(request.method, request.params);
          if (response !== void 0) {
            result = response;
            handled = true;
            break;
          }
        } catch (error) {
          sendError(connection, (_b = request.id) != null ? _b : null, -32602, `Error processing ${request.method}: ${String(error)}`);
          return;
        }
      }
    }
    if (handled) {
      sendResponse(connection, (_c = request.id) != null ? _c : null, result);
    } else {
      sendError(connection, (_d = request.id) != null ? _d : null, -32601, `Method not found: ${request.method}`);
    }
  }
  function sendResponse(connection, id, result) {
    sendJSON(connection, {
      jsonrpc: "2.0",
      id,
      result
    });
  }
  function sendError(connection, id, code, message) {
    sendJSON(connection, {
      jsonrpc: "2.0",
      id,
      error: {
        code,
        message
      }
    });
  }
  function sendJSON(connection, data) {
    const str = `${JSON.stringify(data)}
`;
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i));
    }
    connection.send(bytes);
  }
  function flush() {
  }
  function exit() {
    println("BitwigPOC Exited");
  }
  var globalScope = typeof globalThis !== "undefined" ? globalThis : Function("return this")();
  globalScope.init = init;
  globalScope.flush = flush;
  globalScope.exit = exit;
})();
