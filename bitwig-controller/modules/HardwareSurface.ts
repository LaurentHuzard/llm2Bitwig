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
