
function ClipModule(host) {
    // CursorClip follows the selected clip in Bitwig
    this.cursorClip = host.createCursorClip(16, 128); // 16 steps, 128 pitches

    // Mark interested
    this.cursorClip.getLoopLength().markInterested();
    this.cursorClip.getLoopStart().markInterested();
    this.cursorClip.getPlayStart().markInterested();
    this.cursorClip.getPlayStop().markInterested();
    this.cursorClip.playingStep().markInterested();

    // Add Observers for event-driven updates
    this.cursorClip.addStepDataObserver(function (x, y, state) {
        // x: step, y: pitch (0-127), state: 0=empty, 1=continues, 2=starts
        sendEvent("clip.step_update", { x: x, y: y, state: state });
    });

    this.cursorClip.addPlayingStepObserver(function (step) {
        sendEvent("clip.play_step", { step: step });
    });
}


ClipModule.prototype.handleRequest = function (method, params) {
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
            if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined && params[3] !== undefined) {
                var step = params[0];
                var pitch = params[1];
                var velocity = params[2];
                var duration = params[3];

                // setStep(channel, step, pitch, velocity, duration)
                // For MIDI clips, channel is usually 0
                this.cursorClip.setStep(0, step, pitch, velocity, duration);
                return "OK";
            } else throw "Missing parameters (step, pitch, velocity, duration)";

        case "clip.clear_note":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                var step = params[0];
                var pitch = params[1];

                // clearStep(channel, step, pitch)
                this.cursorClip.clearStep(0, step, pitch);
                return "OK";
            } else throw "Missing parameters (step, pitch)";

        case "clip.toggle_note":
            if (params && params[0] !== undefined && params[1] !== undefined) {
                var step = params[0];
                var pitch = params[1];
                var velocity = params[2] || 1.0; // Default velocity

                // toggleStep(channel, step, pitch, velocity)
                this.cursorClip.toggleStep(step, pitch, velocity);
                return "OK";
            } else throw "Missing parameters (step, pitch)";

        case "clip.get_notes":
            // This is more complex - we need to use NoteStep API
            // For now, return a placeholder indicating this needs observer pattern
            // The proper implementation would use addNoteStepObserver
            if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined) {
                // This is a simplified version - real implementation needs observers
                return {
                    message: "Note reading requires observer pattern - use clip.get_info for now",
                    startStep: params[0],
                    stepCount: params[1],
                    pitch: params[2]
                };
            } else throw "Missing parameters (startStep, stepCount, pitch)";
    }
    return undefined;
};
