import type { ControllerModule, RequestParams, SendEvent } from "../types/controller";

export class ArrangerModule implements ControllerModule {
    private readonly arranger: Arranger;
    private readonly cueMarkerBank: CueMarkerBank;
    private readonly sendEvent: SendEvent;
    // @ts-ignore
    private readonly application: Application;

    constructor(host: ControllerHost, sendEvent: SendEvent, application: Application) {
        this.arranger = host.createArranger();
        this.cueMarkerBank = this.arranger.createCueMarkerBank(32);
        this.sendEvent = sendEvent;
        this.application = application;

        // Mark interested in visibility
        this.arranger.isTimelineVisible().markInterested();
        this.arranger.isIoSectionVisible().markInterested();
        this.arranger.isClipLauncherVisible().markInterested();
        this.arranger.areEffectTracksVisible().markInterested();
        this.arranger.hasDoubleRowTrackHeight().markInterested();
        this.arranger.areCueMarkersVisible().markInterested();
        this.arranger.isPlaybackFollowEnabled().markInterested();

        // Mark interested in cue markers
        this.cueMarkerBank.cursorIndex().markInterested();
        this.cueMarkerBank.itemCount().markInterested();
        for (let i = 0; i < 32; i++) {
            const marker = this.cueMarkerBank.getItemAt(i);
            marker.name().markInterested();
            marker.position().markInterested();
            marker.color().markInterested();
            marker.exists().markInterested();
        }
    }

    handleRequest(method: string, params?: RequestParams): unknown {
        // params is likely an array in the current controller infrastructure
        const args = params as unknown[];

        switch (method) {
            case "arranger.get_status":
                return {
                    isTimelineVisible: this.arranger.isTimelineVisible().get(),
                    isIoSectionVisible: this.arranger.isIoSectionVisible().get(),
                    isClipLauncherVisible: this.arranger.isClipLauncherVisible().get(),
                    areEffectTracksVisible: this.arranger.areEffectTracksVisible().get(),
                    hasDoubleRowTrackHeight: this.arranger.hasDoubleRowTrackHeight().get(),
                    areCueMarkersVisible: this.arranger.areCueMarkersVisible().get(),
                    isPlaybackFollowEnabled: this.arranger.isPlaybackFollowEnabled().get()
                };

            case "arranger.set_panel_visibility":
                if (!args || args.length < 2) throw "Missing params. Expecting [panel_name, state]";
                const panel = args[0] as string;
                const state = args[1] as boolean;

                switch (panel) {
                    case "timeline": this.arranger.isTimelineVisible().set(state); break;
                    case "io": this.arranger.isIoSectionVisible().set(state); break;
                    case "clip_launcher": this.arranger.isClipLauncherVisible().set(state); break;
                    case "effect_tracks": this.arranger.areEffectTracksVisible().set(state); break;
                    case "double_row_height": this.arranger.hasDoubleRowTrackHeight().set(state); break;
                    case "cue_markers": this.arranger.areCueMarkersVisible().set(state); break;
                    case "playback_follow": this.arranger.isPlaybackFollowEnabled().set(state); break;
                    default: throw `Unknown panel: ${panel}`;
                }
                return "OK";

            case "arranger.zoom":
                if (!args || args.length < 1) throw "Missing zoom action";
                const action = args[0] as string;
                switch (action) {
                    case "in_all": this.arranger.zoomInLaneHeightsAll(); break;
                    case "out_all": this.arranger.zoomOutLaneHeightsAll(); break;
                    case "in_selected": this.arranger.zoomInLaneHeightsSelected(); break;
                    case "out_selected": this.arranger.zoomOutLaneHeightsSelected(); break;
                    default: throw `Unknown zoom action: ${action}`;
                }
                return "OK";

            case "arranger.cues.list":
                const markers = [];
                // We rely on the fixed bank size. In a real app we might scroll.
                for (let i = 0; i < 32; i++) {
                    const marker = this.cueMarkerBank.getItemAt(i);
                    if (marker.exists().get()) {
                        markers.push({
                            index: i,
                            name: marker.name().get(),
                            position: marker.position().get(),
                            color: {
                                r: marker.color().red(),
                                g: marker.color().green(),
                                b: marker.color().blue()
                            }
                        });
                    }
                }
                return markers;

            case "arranger.cues.jump":
                if (args && args[0] !== undefined) {
                    const index = args[0] as number;
                    const marker = this.cueMarkerBank.getItemAt(index);
                    if (marker.exists().get()) {
                        marker.launch(true);
                        return "OK";
                    } else {
                        throw `Marker at index ${index} does not exist`;
                    }
                }
                throw "Missing marker index";

            case "arranger.cues.create":
                // Use Transport for creation at playback position as per API
                // This requires TransportModule access or just use the separate tool.
                // For now, we assume user uses transport.add_cue_marker or we need to inject Transport.
                // The plan said "via Transport". So we instruct user to use that or we alias it if we had access.
                // But we don't have Transport instance here. 
                throw "Use transport.add_cue_marker to create cues at playback position.";

            case "arranger.cues.rename":
                if (args && args[0] !== undefined && args[1] !== undefined) {
                    const index = args[0] as number;
                    const name = args[1] as string;
                    const marker = this.cueMarkerBank.getItemAt(index);
                    if (marker.exists().get()) {
                        marker.name().set(name); // Assuming SettableStringValue
                        return "OK";
                    }
                    throw `Marker at index ${index} does not exist`;
                }
                throw "Missing parameters (index, name)";

            case "arranger.cues.color":
                if (args && args.length >= 4) {
                    const index = args[0] as number;
                    const r = args[1] as number;
                    const g = args[2] as number;
                    const b = args[3] as number;
                    const marker = this.cueMarkerBank.getItemAt(index);
                    if (marker.exists().get()) {
                        marker.color().set(r, g, b); // Assuming SettableColorValue
                        return "OK";
                    }
                    throw `Marker at index ${index} does not exist`;
                }
                throw "Missing parameters (index, r, g, b)";

            case "arranger.cues.launch":
                if (args && args[0] !== undefined) {
                    const index = args[0] as number;
                    const marker = this.cueMarkerBank.getItemAt(index);
                    if (marker.exists().get()) {
                        marker.launch(true);
                        return "OK";
                    }
                    throw `Marker at index ${index} does not exist`;
                }
                throw "Missing parameters (index)";
        }
        return undefined;
    }
}
