declare module "ws" {
  export type RawData = unknown;

  export class WebSocket {
    readyState: number;
    send(data: string): void;
    on(event: string, listener: (...args: unknown[]) => void): void;
  }

  export class WebSocketServer {
    constructor(options: { port: number });
    clients: Set<WebSocket>;
    on(event: string, listener: (...args: unknown[]) => void): void;
  }
}
