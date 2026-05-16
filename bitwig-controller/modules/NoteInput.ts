import type { ControllerModule, RequestParams, SendEvent } from "../types/controller";

export class NoteInputModule implements ControllerModule {
    private readonly noteInput: NoteInput;

    constructor(host: ControllerHost) {
        // Create a note input that consumes all channel events
        // 80???? = Note Off (any channel)
        // 90???? = Note On (any channel)
        // A0???? = Poly Aftertouch (any channel)
        // B0???? = CC (any channel)
        // D0???? = Channel Pressure (any channel)
        // E0???? = Pitch Bend (any channel)
        this.noteInput = host.getMidiInPort(0).createNoteInput("MCP Notes", "80????", "90????", "A0????", "B0????", "D0????", "E0????");
        this.noteInput.setShouldConsumeEvents(false); // Let scripts process if needed, though usually we want direct
    }

    handleRequest(method: string, params?: RequestParams): unknown {
        const args = params as unknown[];

        switch (method) {
            case "note_input.send_raw_midi":
                if (!args || args.length < 3) throw "Missing params. Expecting [status, data1, data2]";
                this.noteInput.sendRawMidiEvent(args[0] as number, args[1] as number, args[2] as number);
                return "OK";

            case "note_input.send_note_on":
                if (!args || args.length < 3) throw "Missing params. Expecting [channel, key, velocity]";
                this.noteInput.sendNoteOn(args[0] as number, args[1] as number, args[2] as number);
                return "OK";

            case "note_input.send_note_off":
                if (!args || args.length < 3) throw "Missing params. Expecting [channel, key, velocity]";
                this.noteInput.sendNoteOff(args[0] as number, args[1] as number, args[2] as number);
                return "OK";

            case "note_input.send_poly_aftertouch":
                if (!args || args.length < 3) throw "Missing params. Expecting [channel, key, pressure]";
                this.noteInput.sendPolyphonicAftertouch(args[0] as number, args[1] as number, args[2] as number);
                return "OK";
        }
        return undefined;
    }
}
