function MixerModule(host) {
    // Master Track
    this.masterTrack = host.createMasterTrack(0);
    this.masterTrack.volume().markInterested();
    this.masterTrack.pan().markInterested();

    // Effect Tracks (Return Tracks) - Bank of 8
    // API requires numTracks, numSends, numScenes (or just 2 args)
    this.effectTrackBank = host.createEffectTrackBank(8, 2, 8);
    for (var i = 0; i < 8; i++) {
        var track = this.effectTrackBank.getItemAt(i);
        track.volume().markInterested();
        track.pan().markInterested();
        track.mute().markInterested();
        track.solo().markInterested();
        track.name().markInterested();
    }
}

MixerModule.prototype.handleRequest = function (method, params) {
    switch (method) {
        // --- Mixer Tools ---
        case "mixer.master.get_volume":
            return this.masterTrack.volume().get();

        case "mixer.master.set_volume":
            if (params && params[0] !== undefined) {
                this.masterTrack.volume().set(params[0]);
                return "OK";
            } else throw "Missing volume parameter";

        // --- Return Tracks ---
        case "mixer.return.list":
            var tracks = [];
            for (var i = 0; i < 8; i++) {
                var t = this.effectTrackBank.getItemAt(i);
                // Only list tracks that exist (have a name usually implies existence in API for EffectTrackBank?)
                // Actually, createEffectTrackBank gives a fixed bank. We can check if they are effectively used?
                // For now, listing all 8 slots is standard Bitwig API behavior unless we check `exists()`.
                // Let's assume we list all for now or check exists().
                // exists() needs markInterested().
                tracks.push({
                    index: i,
                    name: t.name().get(),
                    volume: t.volume().get(),
                    pan: t.pan().get(),
                    mute: t.mute().get(),
                    solo: t.solo().get()
                });
            }
            return tracks;

        case "mixer.return.volume":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.effectTrackBank.getItemAt(params[0]).volume().set(params[1]);
                return "OK";
            } else throw "Missing parameters (index, value)";

        case "mixer.return.pan":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.effectTrackBank.getItemAt(params[0]).pan().set(params[1]);
                return "OK";
            } else throw "Missing parameters (index, value)";
    }
    return undefined;
};
