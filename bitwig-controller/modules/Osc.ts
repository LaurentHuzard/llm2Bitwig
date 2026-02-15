import type { ControllerModule, RequestParams, SendEvent } from "../types/controller";

export class OscModule implements ControllerModule {
    private readonly oscModule: SystemOscModule;
    private oscConnection: OscConnection | null = null;
    private oscAddressSpace: OscAddressSpace;

    constructor(host: ControllerHost, private sendEvent: SendEvent) {
        this.oscModule = host.getOscModule();
        this.oscAddressSpace = this.oscModule.createAddressSpace();

        this.oscAddressSpace.registerDefaultMethod((connection, message) => {
            this.sendEvent("osc.message", {
                addressPattern: message.getAddressPattern(),
                typeTagPattern: message.getTypeTagPattern(),
                arguments: message.getArguments()
            });
        });
    }

    handleRequest(method: string, params?: RequestParams): unknown {
        switch (method) {
            case "osc.start_server":
                if (params && params[0] !== undefined) {
                    const port = params[0] as number;
                    // API says createUdpServer(port, addressSpace) returns void (or OscConnection in some versions?)
                    // The docs I read said: 
                    // createUdpServer(int port, OscAddressSpace addressSpace) -> void (API 5)
                    // createUdpServer(OscAddressSpace addressSpace) -> OscServer (API 10)
                    // I'll assume API 10+ and use the void one to just start it? 
                    // Wait, if I want to receive, I need to bind.
                    // Let's try the void one for now as it seems simpler for "start server on port".
                    this.oscModule.createUdpServer(port, this.oscAddressSpace);
                    return "OK";
                }
                throw "Missing parameter (port)";

            case "osc.connect":
                if (params && params[0] !== undefined && params[1] !== undefined) {
                    const host = params[0] as string;
                    const port = params[1] as number;
                    this.oscConnection = this.oscModule.connectToUdpServer(host, port, this.oscAddressSpace);
                    return "OK";
                }
                throw "Missing parameters (host, port)";

            case "osc.send":
                if (this.oscConnection) {
                    if (params && params[0] !== undefined) {
                        const address = params[0] as string;
                        const args = params.slice(1);
                        this.oscConnection.sendMessage(address, ...args);
                        return "OK";
                    }
                    throw "Missing parameter (address)";
                }
                throw "OSC Connection not established. Call osc.connect first.";
        }
        return undefined;
    }
}
