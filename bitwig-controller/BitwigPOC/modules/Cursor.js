function CursorModule(host) {
    this.cursorTrack = host.createCursorTrack("MCP_CURSOR", "Cursor Track", 0, 0, true);

    // Mark interested for Cursor Track
    this.cursorTrack.volume().markInterested();
    this.cursorTrack.pan().markInterested();
    this.cursorTrack.mute().markInterested();
    this.cursorTrack.solo().markInterested();
    this.cursorTrack.arm().markInterested();
    this.cursorTrack.name().markInterested();

    // Cursor Device Setup
    this.cursorDevice = this.cursorTrack.createCursorDevice("MCP_DEVICE", "Cursor Device", 0, CursorDeviceFollowMode.FOLLOW_SELECTION);
    this.cursorDevice.name().markInterested();
    this.cursorDevice.isWindowOpen().markInterested();
    this.cursorDevice.isExpanded().markInterested();

    // Remote Controls
    this.remoteControlsBank = this.cursorDevice.createCursorRemoteControlsPage(8);
    for (var i = 0; i < 8; i++) {
        var param = this.remoteControlsBank.getParameter(i);
        param.name().markInterested();
        param.value().markInterested();
        param.setIndication(true);
    }
}

CursorModule.prototype.handleRequest = function (method, params) {
    switch (method) {
        // --- Selected Track Control ---
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
                this.cursorTrack.volume().set(params[0]);
                return "OK";
            } else throw "Missing parameter";

        case "track.selected.pan":
            if (params && params[0] !== undefined) {
                this.cursorTrack.pan().set(params[0]);
                return "OK";
            } else throw "Missing parameter";

        case "track.selected.mute":
            if (params && params[0] !== undefined) {
                this.cursorTrack.mute().set(params[0]);
                return "OK";
            } else throw "Missing parameter";

        case "track.selected.solo":
            if (params && params[0] !== undefined) {
                this.cursorTrack.solo().set(params[0]);
                return "OK";
            } else throw "Missing parameter";

        case "track.selected.arm":
            if (params && params[0] !== undefined) {
                this.cursorTrack.arm().set(params[0]);
                return "OK";
            } else throw "Missing parameter";

        // --- Device Control ---
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

        case "device.get_remote_controls":
            var controls = [];
            for (var i = 0; i < 8; i++) {
                var param = this.remoteControlsBank.getParameter(i);
                controls.push({
                    index: i,
                    name: param.name().get(),
                    value: param.value().get()
                });
            }
            return controls;

        case "device.set_remote_control":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                this.remoteControlsBank.getParameter(params[0]).value().set(params[1]);
                return "OK";
            } else throw "Missing parameters (index, value)";

        case "device.page_next":
            this.remoteControlsBank.selectNextPage(true);
            return "OK";

        case "device.page_previous":
            this.remoteControlsBank.selectPreviousPage(true);
            return "OK";
    }
    return undefined;
};
