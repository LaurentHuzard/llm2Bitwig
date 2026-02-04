function TransportModule(host) {
    this.transport = host.createTransport();
    // Mark values we need to read as interested
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

    // Add Observers for event-driven updates
    this.transport.isPlaying().addValueObserver(function (isPlaying) {
        sendEvent("transport.state", { isPlaying: isPlaying });
    });

    this.transport.tempo().value().addRawValueObserver(function (tempo) {
        sendEvent("transport.state", { tempo: tempo });
    });
}


TransportModule.prototype.handleRequest = function (method, params) {
    switch (method) {
        case "transport.get_status":
            return {
                isPlaying: this.transport.isPlaying().get(),
                isRecording: this.transport.isArrangerRecordEnabled().get(),
                tempo: this.transport.tempo().value().getRaw(),
                position: this.transport.getPosition().get(),
                timeSignature: this.transport.timeSignature().numerator().get() + "/" + this.transport.timeSignature().denominator().get(),
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
            } else {
                throw "Missing tempo parameter";
            }
        case "transport.getPosition":
            return this.transport.getPosition().get();
        case "transport.setPosition":
            if (params && params[0]) {
                this.transport.getPosition().set(params[0]);
                return "OK";
            } else {
                throw "Missing position parameter";
            }
        case "transport.getIsPlaying":
            return this.transport.isPlaying().get();
        case "transport.getIsRecording":
            return this.transport.isArrangerRecordEnabled().get();
        case "transport.toggleLoop":
            this.transport.isArrangerLoopEnabled().toggle();
            return "OK";
        case "transport.setLoopStart":
            if (params && params[0] !== undefined) {
                this.transport.getInPosition().set(params[0]);
                return "OK";
            } else {
                throw "Missing loop start parameter";
            }
        case "transport.setLoopEnd":
            if (params && params[0] !== undefined) {
                this.transport.getOutPosition().set(params[0]);
                return "OK";
            } else {
                throw "Missing loop end parameter";
            }
        case "transport.getLoopStatus":
            return {
                enabled: this.transport.isArrangerLoopEnabled().get(),
                start: this.transport.getInPosition().get(),
                end: this.transport.getOutPosition().get()
            };
        case "transport.toggle_metronome":
            this.transport.isMetronomeEnabled().toggle();
            return "OK";
        case "transport.time_signature": // get/set
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.transport.timeSignature().set(params[0], params[1]);
                return "OK";
            } else {
                // return formatted string
                return this.transport.timeSignature().numerator().get() + "/" + this.transport.timeSignature().denominator().get();
            }
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
            if (params && params[0] !== undefined) {
                this.transport.isPunchInEnabled().set(params[0]);
                return "OK";
            }
            throw "Missing punch in state parameter";
        case "transport.set_punch_out":
            if (params && params[0] !== undefined) {
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
            this.transport.incPosition(1, false); // 1 beat, not snap
            return "OK";
        case "transport.nudge_backward":
            this.transport.incPosition(-1, false); // -1 beat, not snap
            return "OK";
    }
    return undefined; // Method not handled
};

