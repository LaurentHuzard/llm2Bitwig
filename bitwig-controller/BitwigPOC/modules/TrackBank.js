function TrackBankModule(host) {
    // Master Track
    this.masterTrack = host.createMasterTrack(0);
    this.masterTrack.volume().markInterested();
    this.masterTrack.pan().markInterested();

    // Create Main Track Bank (8 tracks, 2 sends, 8 scenes)
    this.trackBank = host.createMainTrackBank(8, 2, 8);

    // Mark interested for Track Bank
    for (var i = 0; i < 8; i++) {
        var track = this.trackBank.getItemAt(i);
        track.volume().markInterested();
        track.pan().markInterested();
        track.mute().markInterested();
        track.solo().markInterested();
        track.arm().markInterested();
        track.name().markInterested();
        track.color().markInterested();

        // Sends
        var sendBank = track.sendBank();
        for (var k = 0; k < 2; k++) {
            sendBank.getItemAt(k).markInterested();
        }

        // Clip Launcher Slots
        var clipLauncher = track.clipLauncherSlotBank();
        for (var j = 0; j < 8; j++) {
            var slot = clipLauncher.getItemAt(j);
            slot.hasContent().markInterested();
            slot.isPlaying().markInterested();
            slot.isRecording().markInterested();
            slot.isPlaybackQueued().markInterested();
        }
    }

    // Create Scene Bank (8 scenes)
    this.sceneBank = host.createSceneBank(8);
    for (var i = 0; i < 8; i++) {
        var scene = this.sceneBank.getScene(i);
        scene.name().markInterested();
        scene.sceneIndex().markInterested();
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

        case "clip.create":
            if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined) {
                // track index, slot index, length in beats
                this.trackBank.getItemAt(params[0]).clipLauncherSlotBank().getItemAt(params[1]).createEmptyClip(params[2]);
                return "OK";
            } else throw "Missing parameters (trackIndex, slotIndex, length)";

        // --- Scene Control ---
        case "scene.launch":
            if (params && params[0] !== undefined) {
                this.sceneBank.getScene(params[0]).launch();
                return "OK";
            } else throw "Missing parameters";

        case "scene.list":
            var scenes = [];
            for (var i = 0; i < 8; i++) {
                var s = this.sceneBank.getScene(i);
                scenes.push({
                    index: i,
                    name: s.name().get()
                });
            }
            return scenes;

        case "scene.create":
            this.sceneBank.createScene();
            return "OK";

        // --- Mixer Tools ---
        case "mixer.master.get_volume":
            return this.masterTrack.volume().get();

        case "mixer.master.set_volume":
            if (params && params[0] !== undefined) {
                this.masterTrack.volume().set(params[0]);
                return "OK";
            } else throw "Missing volume parameter";

        case "mixer.track.get_send":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                return this.trackBank.getItemAt(params[0]).sendBank().getItemAt(params[1]).get();
            } else throw "Missing parameters";

        case "mixer.track.set_send":
            if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined) {
                this.trackBank.getItemAt(params[0]).sendBank().getItemAt(params[1]).set(params[2]);
                return "OK";
            } else throw "Missing parameters";
    }
    return undefined;
};
