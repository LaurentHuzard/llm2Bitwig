function ApplicationModule(host) {
    this.application = host.createApplication();
}

ApplicationModule.prototype.handleRequest = function (method, params) {
    switch (method) {
        case "application.createInstrumentTrack":
            this.application.createInstrumentTrack(-1); // -1 means add at end
            return "OK";

        case "application.createAudioTrack":
            this.application.createAudioTrack(-1);
            return "OK";
    }
    return undefined;
};
