import type { ControllerModule, RequestParams, SendEvent } from "../types/controller";

export class MidiModule implements ControllerModule {
    private readonly midiIn: MidiIn;
    private readonly midiOut: MidiOut;
    private readonly sendEvent: SendEvent;

    constructor(host: ControllerHost, sendEvent: SendEvent) {
        this.sendEvent = sendEvent;
        this.midiIn = host.getMidiInPort(0);
        this.midiOut = host.getMidiOutPort(0);

        this.midiIn.setMidiCallback((status, data1, data2) => {
            this.sendEvent("midi.short_message", { status, data1, data2 });
        });

        this.midiIn.setSysexCallback((data) => {
            this.sendEvent("midi.sysex", { data });
        });
    }

    handleRequest(method: string, params?: RequestParams): unknown {
        switch (method) {
            case "midi.send_short":
                if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined) {
                    this.midiOut.sendMidi(params[0] as number, params[1] as number, params[2] as number);
                    return "OK";
                }
                throw "Missing parameters (status, data1, data2)";

            case "midi.send_sysex":
                if (params && params[0] !== undefined) {
                    this.midiOut.sendSysex(params[0] as string);
                    return "OK";
                }
                throw "Missing parameter (hexString)";
        }
        return undefined;
    }
}
