import type { ControllerModule, RequestParams } from "../types/controller";

export class HardwareSurfaceModule implements ControllerModule {
    private readonly surface: HardwareSurface;
    private readonly controls = new Map<string, HardwareControl>();

    constructor(host: ControllerHost) {
        this.surface = host.createHardwareSurface();
    }

    handleRequest(method: string, params?: RequestParams): unknown {
        switch (method) {
            case "hardware.create_slider":
                if (params && params[0] !== undefined && params[1] !== undefined) {
                    const id = params[0] as string;
                    const label = params[1] as string;
                    const isHorizontal = params[2] as boolean;
                    this.createSlider(id, label, isHorizontal);
                    return "OK";
                }
                throw "Missing parameters (id, label)";

            case "hardware.create_knob":
                if (params && params[0] !== undefined && params[1] !== undefined) {
                    const id = params[0] as string;
                    const label = params[1] as string;
                    const isAbsolute = params[2] as boolean;
                    this.createKnob(id, label, isAbsolute);
                    return "OK";
                }
                throw "Missing parameters (id, label)";

            case "hardware.create_button":
                if (params && params[0] !== undefined && params[1] !== undefined) {
                    const id = params[0] as string;
                    const label = params[1] as string;
                    this.createButton(id, label);
                    return "OK";
                }
                throw "Missing parameters (id, label)";

            case "hardware.create_light":
                if (params && params[0] !== undefined && params[1] !== undefined) {
                    const id = params[0] as string;
                    const label = params[1] as string;
                    // Optional linked button ID
                    const linkedButtonId = params[2] as string | undefined;
                    this.createLight(id, label, linkedButtonId);
                    return "OK";
                }
                throw "Missing parameters (id, label)";

            case "hardware.bind_cc":
                if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined) {
                    const id = params[0] as string;
                    const channel = params[1] as number;
                    const cc = params[2] as number;
                    const isAbsolute = params[3] as boolean ?? true;
                    this.bindCC(id, channel, cc, isAbsolute);
                    return "OK";
                }
                throw "Missing parameters (id, channel, cc)";

            case "hardware.bind_note":
                if (params && params[0] !== undefined && params[1] !== undefined && params[2] !== undefined) {
                    const id = params[0] as string;
                    const channel = params[1] as number;
                    const note = params[2] as number;
                    this.bindNote(id, channel, note);
                    return "OK";
                }
                throw "Missing parameters (id, channel, note)";

            case "hardware.update":
                this.surface.updateHardware();
                return "OK";

            case "hardware.invalidate":
                this.surface.invalidateHardwareOutputState();
                return "OK";

            case "hardware.get_controls":
                return this.getControls();

            // Inspection of controls
            case "hardware.control.get_value":
                if (params && params[0] !== undefined) {
                    return this.getControlValue(params[0] as string);
                }
                throw "Missing parameter (id)";
        }
        return undefined;
    }

    private createSlider(id: string, label: string, isHorizontal: boolean) {
        const slider = this.surface.createHardwareSlider(id);
        slider.setLabel(label);
        if (isHorizontal) {
            slider.setOrientation(Orientation.HORIZONTAL);
        } else {
            slider.setOrientation(Orientation.VERTICAL);
        }
        slider.value().markInterested();
        this.controls.set(id, slider);
    }

    private createKnob(id: string, label: string, isAbsolute: boolean) {
        if (isAbsolute) {
            const knob = this.surface.createAbsoluteHardwareKnob(id);
            knob.setLabel(label);
            knob.value().markInterested();
            this.controls.set(id, knob);
        } else {
            const knob = this.surface.createRelativeHardwareKnob(id);
            knob.setLabel(label);
            this.controls.set(id, knob);
        }
    }

    private createButton(id: string, label: string) {
        const button = this.surface.createHardwareButton(id);
        button.setLabel(label);
        button.isPressed().markInterested();
        this.controls.set(id, button);
    }

    private createLight(id: string, label: string, linkedButtonId?: string) {
        const light = this.surface.createMultiStateHardwareLight(id);
        light.setLabel(label);
        light.isOn().markInterested();
        light.color().markInterested();

        if (linkedButtonId) {
            const button = this.controls.get(linkedButtonId);
            if (button && 'setBackgroundLight' in button) {
                (button as HardwareButton).setBackgroundLight(light);
            }
        }
        this.controls.set(id, light);
    }

    private bindCC(id: string, channel: number, cc: number, isAbsolute: boolean) {
        const control = this.controls.get(id);
        if (!control) throw `Control not found: ${id}`;

        const port = host.getMidiInPort(0);

        if (isAbsolute) {
            const matcher = port.createAbsoluteCCValueMatcher(channel, cc);
            if ('setAdjustValueMatcher' in control) {
                (control as AbsoluteHardwareKnob).setAdjustValueMatcher(matcher);
            }
        } else {
            // Defaulting to relative signed bit for now, typical for encoders
            const matcher = port.createRelativeSignedBitCCValueMatcher(channel, cc, 128);
            if ('setAdjustValueMatcher' in control) {
                (control as RelativeHardwareKnob).setAdjustValueMatcher(matcher);
            }
        }

        if ('pressedAction' in control) {
            // Buttons usually don't bind to CC for value, but for action. 
            // We might need a separate bind_action for buttons if not using CC value > 64 logic
            const actionMatcher = port.createCCActionMatcher(channel, cc, 127);
            (control as HardwareButton).pressedAction().setActionMatcher(actionMatcher);
        }
    }

    private bindNote(id: string, channel: number, note: number) {
        const control = this.controls.get(id);
        if (!control) throw `Control not found: ${id}`;

        const port = host.getMidiInPort(0);

        if ('pressedAction' in control) {
            const matcher = port.createNoteOnActionMatcher(channel, note);
            (control as HardwareButton).pressedAction().setActionMatcher(matcher);
        } else {
            throw "Binding notes to non-buttons not fully supported yet";
        }
    }

    private getControls() {
        const list: any[] = [];
        this.controls.forEach((control, id) => {
            let type = "unknown";
            // Simple type inference based on interface presence
            if ('value' in control) {
                type = 'knob/slider';
            } else if ('isPressed' in control) {
                type = 'button';
            }

            list.push({
                id: id,
                label: control.getName(),
                type: type
            });
        });
        return list;
    }

    private getControlValue(id: string): number | boolean | null {
        const control = this.controls.get(id);
        if (!control) throw `Control not found: ${id}`;

        const c = control as any;
        if (typeof c.value === 'function') {
            return c.value().get();
        }
        if (typeof c.isPressed === 'function') {
            return c.isPressed().get();
        }
        return null;
    }
}
