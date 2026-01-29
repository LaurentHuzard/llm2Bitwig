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
}

TransportModule.prototype.handleRequest = function (method, params) {
    switch (method) {
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
    }
    return undefined; // Method not handled
};
