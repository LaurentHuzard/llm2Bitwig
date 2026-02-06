import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export class TestClient {
    private client: Client | null;
    private transport: StdioClientTransport | null;

    constructor() {
        this.client = null;
        this.transport = null;
    }

    async connect(): Promise<void> {
        console.log("TestClient env BITWIG_MCP_WS_PORT:", process.env.BITWIG_MCP_WS_PORT);
        const env = Object.fromEntries(
            Object.entries(process.env).filter(([, value]) => value !== undefined)
        ) as Record<string, string>;
        this.transport = new StdioClientTransport({
            command: "node",
            args: ["dist/index.js"],
            env,
        });

        this.client = new Client(
            {
                name: "bitwig-mcp-test-suite",
                version: "0.1.0",
            },
            {
                capabilities: {},
            }
        );

        await this.client.connect(this.transport);
    }

    async disconnect(): Promise<void> {
        if (this.transport) {
            await this.transport.close();
        }
    }

    async callTool<T = unknown>(name: string, args: Record<string, unknown> = {}): Promise<T> {
        if (!this.client) throw new Error("Client not connected");

        try {
            const result = await this.client.callTool({
                name: name,
                arguments: args,
            }) as { content?: Array<{ text?: string }> };

            // Helper: parse content if it looks like JSON
            if (result.content && result.content[0] && result.content[0].text) {
                try {
                    return JSON.parse(result.content[0].text) as T;
                } catch {
                    return result.content[0].text as T;
                }
            }
            return result as T;
        } catch (error) {
            console.error(`Error calling ${name}:`, error);
            throw error;
        }
    }

    async wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
