function TrackBankModule(host) {
    this.trackBank = host.createMainTrackBank(8, 2, 8);
    this.trackBank.followCursorTrack(host.createCursorTrack(0, 0));

    var self = this;

    function initTrack(i) {
        var track = self.trackBank.getItemAt(i);
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

        // Track Observers
        track.volume().addValueObserver(101, function (val) {
            sendEvent("track.update", { index: i, volume: val });
        });
        track.pan().addValueObserver(101, function (val) {
            sendEvent("track.update", { index: i, pan: val });
        });
        track.mute().addValueObserver(function (val) {
            sendEvent("track.update", { index: i, mute: val });
        });
        track.solo().addValueObserver(function (val) {
            sendEvent("track.update", { index: i, solo: val });
        });
        track.arm().addValueObserver(function (val) {
            sendEvent("track.update", { index: i, arm: val });
        });
        track.name().addValueObserver(function (val) {
            sendEvent("track.update", { index: i, name: val });
        });
        track.color().addValueObserver(function (r, g, b) {
            sendEvent("track.update", { index: i, color: { red: r, green: g, blue: b } });
        });

        // Sends
        var sendBank = track.sendBank();
        for (var k = 0; k < 2; k++) {
            sendBank.getItemAt(k).markInterested();
        }

        // Clip Launcher Slots
        var clipLauncher = track.clipLauncherSlotBank();
        function initSlot(j) {
            var slot = clipLauncher.getItemAt(j);
            slot.hasContent().markInterested();
            slot.isPlaying().markInterested();
            slot.isRecording().markInterested();
            slot.isPlaybackQueued().markInterested();
            slot.color().markInterested();
            slot.name().markInterested();

            slot.hasContent().addValueObserver(function (val) {
                sendEvent("clip_launcher.slot_update", { trackIndex: i, sceneIndex: j, hasContent: val });
            });
            slot.isPlaying().addValueObserver(function (val) {
                sendEvent("clip_launcher.slot_update", { trackIndex: i, sceneIndex: j, isPlaying: val });
            });
            slot.isRecording().addValueObserver(function (val) {
                sendEvent("clip_launcher.slot_update", { trackIndex: i, sceneIndex: j, isRecording: val });
            });
            slot.isPlaybackQueued().addValueObserver(function (val) {
                sendEvent("clip_launcher.slot_update", { trackIndex: i, sceneIndex: j, isPlaybackQueued: val });
            });
            slot.color().addValueObserver(function (r, g, b) {
                sendEvent("clip_launcher.slot_update", { trackIndex: i, sceneIndex: j, color: { r: r, g: g, b: b } });
            });
            slot.name().addValueObserver(function (val) {
                sendEvent("clip_launcher.slot_update", { trackIndex: i, sceneIndex: j, name: val });
            });
        }

        for (var j = 0; j < 8; j++) {
            initSlot(j);
        }
    }

    for (var i = 0; i < 8; i++) {
        initTrack(i);
    }
}


TrackBankModule.prototype.handleRequest = function (method, params) {
    var result;
    switch (method) {
        // --- Track Bank Control ---
        case "track.bank.get_status":
            var tracks = [];
            for (var i = 0; i < 8; i++) {
                var t = this.trackBank.getItemAt(i);
                tracks.push({
                    index: i,
                    name: t.name().get(),
                    volume: t.volume().get(),
                    pan: t.pan().get(),
                    mute: t.mute().get(),
                    solo: t.solo().get(),
                    arm: t.arm().get(),
                    color: {
                        red: t.color().red(),
                        green: t.color().green(),
                        blue: t.color().blue()
                    }
                });
            }
            return tracks;

        case "track.bank.volume":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.trackBank.getItemAt(params[0]).volume().set(params[1]);
                return "OK";
            } else throw "Missing parameters";

        case "track.bank.pan":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.trackBank.getItemAt(params[0]).pan().set(params[1]);
                return "OK";
            } else throw "Missing parameters";

        case "track.bank.mute":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.trackBank.getItemAt(params[0]).mute().set(params[1]);
                return "OK";
            } else throw "Missing parameters";

        case "track.bank.solo":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.trackBank.getItemAt(params[0]).solo().set(params[1]);
                return "OK";
            } else throw "Missing parameters";

        case "track.bank.select":
            if (params && params[0] !== undefined) {
                this.trackBank.getItemAt(params[0]).selectInMixer();
                return "OK";
            } else throw "Missing parameters";

        case "track.delete":
            if (params && params[0] !== undefined) {
                this.trackBank.getItemAt(params[0]).deleteObject();
                return "OK";
            } else throw "Missing parameter";

        case "track.rename":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.trackBank.getItemAt(params[0]).name().set(params[1]);
                return "OK";
            } else throw "Missing parameters";

        case "track.duplicate":
            if (params && params[0] !== undefined) {
                this.trackBank.getItemAt(params[0]).duplicate();
                return "OK";
            } else throw "Missing parameter";

        case "track.set_color":
            if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined && params[3] !== undefined) {
                this.trackBank.getItemAt(params[0]).color().set(params[1], params[2], params[3]);
                return "OK";
            } else throw "Missing parameters";

        // --- Clip Launcher ---
        case "clip.launch":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().getItemAt(params[1]).launch();
                return "OK";
            } else throw "Missing parameters";

        case "clip.record":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().getItemAt(params[1]).record();
                return "OK";
            } else throw "Missing parameters";

        case "clip.stop":
            if (params && params[0] !== undefined) {
                this.trackBank.getItemAt(params[0]).stop();
                return "OK";
            } else throw "Missing parameters";

        case "clip.duplicate":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().duplicateClip(params[1]);
                return "OK";
            } else throw "Missing parameters (trackIndex, slotIndex)";

        case "clip.select_slot":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().select(params[1]);
                return "OK";
            } else throw "Missing parameters (trackIndex, slotIndex)";

        case "clip.create":
            if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined) {
                // track index, slot index, length in beats
                this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().getItemAt(params[1]).createEmptyClip(params[2]);
                return "OK";
            } else throw "Missing parameters (trackIndex, slotIndex, length)";

        case "clip.delete":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().deleteClip(params[1]);
                return "OK";
            } else throw "Missing parameters (trackIndex, slotIndex)";

        case "clip.browse_insert":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().getItemAt(params[1]).browseToInsertClip();
                return "OK";
            } else throw "Missing parameters (trackIndex, slotIndex)";

        case "clip.get_status":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                var trackIdx = params[0];
                var sceneIdx = params[1];
                var clipSlot = this.trackBank.getItemAt(trackIdx).clipLauncherSlotBank().getItemAt(sceneIdx);
                return {
                    hasContent: clipSlot.hasContent().get(),
                    isPlaying: clipSlot.isPlaying().get(),
                    isRecording: clipSlot.isRecording().get(),
                    isPlaybackQueued: clipSlot.isPlaybackQueued().get()
                };
            } else throw "Missing parameters (trackIndex, sceneIndex)";

        case "clip.get_grid":
            var grid = [];
            for (var t = 0; t < 8; t++) {
                var trackSlots = [];
                var clipLauncher = this.trackBank.getItemAt(t).clipLauncherSlotBank();
                for (var s = 0; s < 8; s++) {
                    var slot = clipLauncher.getItemAt(s);
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

        case "clip.set_color":
            if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined && params[3] !== undefined && params[4] !== undefined) {
                var trackIdx = params[0];
                var sceneIdx = params[1];
                var r = params[2];
                var g = params[3];
                var b = params[4];
                this.trackBank.getItemAt(trackIdx).clipLauncherSlotBank().getItemAt(sceneIdx).color().set(r, g, b);
                return "OK";
            } else throw "Missing parameters (trackIndex, sceneIndex, r, g, b)";

        case "clip.get_color":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                var trackIdx = params[0];
                var sceneIdx = params[1];
                var clipColor = this.trackBank.getItemAt(trackIdx).clipLauncherSlotBank().getItemAt(sceneIdx).color();
                return {
                    r: clipColor.red(),
                    g: clipColor.green(),
                    b: clipColor.blue()
                };
            } else throw "Missing parameters (trackIndex, sceneIndex)";

        // --- Mixer Tools (Per Track) ---
        case "mixer.track.get_send":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                return this.trackBank.getItemAt(params[0]).sendBank().getItemAt(params[1]).get();
            } else throw "Missing parameters";

        case "mixer.track.set_send":
            if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined) {
                this.trackBank.getItemAt(params[0]).sendBank().getItemAt(params[1]).set(params[2]);
                return "OK";
            } else throw "Missing parameters";

        case "track.list":
            var allTracks = [];
            for (var i = 0; i < 8; i++) {
                var t = this.trackBank.getItemAt(i);
                if (t.exists().get()) {
                    allTracks.push({
                        index: i,
                        name: t.name().get(),
                        type: t.trackType().get(),
                        position: t.position().get(),
                        isGroup: t.isGroup().get(),
                        color: {
                            red: t.color().red(),
                            green: t.color().green(),
                            blue: t.color().blue()
                        }
                    });
                }
            }
            return allTracks;

        case "track.get_info":
            if (params && params[0] !== undefined) {
                var track = this.trackBank.getItemAt(params[0]);
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
            } else throw "Missing track index parameter";

        case "track.scroll_into_view":
            if (params && params[0] !== undefined) {
                this.trackBank.getItemAt(params[0]).makeVisibleInArranger();
                this.trackBank.getItemAt(params[0]).makeVisibleInMixer();
                return "OK";
            } else throw "Missing track index parameter";

        case "track.bank.scroll_forward":
            this.trackBank.scrollForwards();
            return "OK";

        case "track.bank.scroll_backward":
            this.trackBank.scrollBackwards();
            return "OK";

        case "track.bank.scroll_to_position":
            if (params && params[0] !== undefined) {
                this.trackBank.scrollPosition().set(params[0]);
                return "OK";
            } else throw "Missing position parameter";
    }
    return undefined;
};
