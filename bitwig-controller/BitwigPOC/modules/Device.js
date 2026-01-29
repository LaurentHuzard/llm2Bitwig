function DeviceModule(trackBank) {
    this.trackBank = trackBank;
    this.deviceBanks = [];

    // Initialize DeviceBanks for each track (capacity: 8 devices per track)
    for (var i = 0; i < 8; i++) {
        var track = this.trackBank.getItemAt(i);
        var deviceBank = track.createDeviceBank(8);

        // Mark interested
        for (var j = 0; j < 8; j++) {
            var device = deviceBank.getItemAt(j);
            device.name().markInterested();
            device.isEnabled().markInterested();
            device.exists().markInterested();
        }

        this.deviceBanks.push(deviceBank);
    }
}

DeviceModule.prototype.handleRequest = function (method, params) {
    switch (method) {
        case "device.list":
            if (params && params[0] !== undefined) {
                var trackIndex = params[0];
                if (trackIndex < 0 || trackIndex >= 8) throw "Track index out of range (0-7)";

                var devices = [];
                var db = this.deviceBanks[trackIndex];

                for (var i = 0; i < 8; i++) {
                    var d = db.getItemAt(i);
                    if (d.exists().get()) {
                        devices.push({
                            index: i,
                            name: d.name().get(),
                            enabled: d.isEnabled().get()
                        });
                    }
                }
                return devices;
            } else throw "Missing trackIndex parameter";

        case "device.bypass":
            if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined) {
                var trackIndex = params[0];
                var deviceIndex = params[1];
                var state = params[2]; // true = disable (bypass), false = enable? 
                // Wait, terminology: "bypass" usually means "disabled".
                // But Bitwig has "isEnabled()". 
                // Let's assume params[2] is "target state for isEnabled".
                // Actually, tool definition says "state: boolean, description: True to bypass".
                // So if bypass=true, isEnabled should be false.

                var d = this.deviceBanks[trackIndex].getItemAt(deviceIndex);
                d.isEnabled().set(!state); // Invert because enabled != bypass
                return "OK";
            } else throw "Missing parameters (trackIndex, deviceIndex, bypassState)";

        case "device.delete":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                var trackIndex = params[0];
                var deviceIndex = params[1];
                this.deviceBanks[trackIndex].getItemAt(deviceIndex).deleteObject();
                return "OK";
            } else throw "Missing parameters (trackIndex, deviceIndex)";
    }
    return undefined;
};
