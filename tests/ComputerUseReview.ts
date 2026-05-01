import { spawn } from "child_process";

export type ComputerUseReviewOptions = {
    expectedTracks: string[];
    prompt: string;
};

type ComputerAction = {
    type: string;
    [key: string]: unknown;
};

type ComputerCall = {
    type: "computer_call";
    id: string;
    call_id: string;
    action?: ComputerAction;
    actions?: ComputerAction[];
    pending_safety_checks?: Array<{
        id: string;
        code: string;
        message: string;
    }>;
};

type ResponseOutputItem =
    | ComputerCall
    | {
        type?: string;
        text?: string;
        content?: Array<{ text?: string; type?: string }>;
        summary?: Array<{ text?: string; type?: string }>;
    };

type ResponsesApiResult = {
    id: string;
    output?: ResponseOutputItem[];
    output_text?: string;
};

export class ComputerUseUnavailableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ComputerUseUnavailableError";
    }
}

export class ComputerUseNetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ComputerUseNetworkError";
    }
}

function useLegacyPreview(): boolean {
    return process.env.BITWIG_CUA_LEGACY_PREVIEW === "1";
}

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is required for Computer Use review`);
    }
    return value;
}

function runCommand(command: string, input?: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const child = spawn(command, {
            shell: true,
            stdio: ["pipe", "pipe", "pipe"],
            env: process.env,
        });

        const stdout: Buffer[] = [];
        const stderr: Buffer[] = [];

        child.stdout.on("data", (chunk: Buffer) => stdout.push(chunk));
        child.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));
        child.on("error", reject);
        child.on("close", (code) => {
            if (code === 0) {
                resolve(Buffer.concat(stdout));
                return;
            }

            reject(new Error(`${command} failed with code ${code ?? "unknown"}: ${Buffer.concat(stderr).toString("utf8")}`));
        });

        if (input) {
            child.stdin.write(input);
        }
        child.stdin.end();
    });
}

async function captureScreenshotDataUrl(): Promise<string> {
    const command = requireEnv("BITWIG_CUA_SCREENSHOT_CMD");
    console.log(`Computer Use: capturing screenshot with ${command}`);
    const output = await runCommand(command);
    const trimmed = output.toString("utf8").trim();

    if (trimmed.startsWith("data:image/")) {
        return trimmed;
    }

    const mimeType = process.env.BITWIG_CUA_SCREENSHOT_MIME ?? "image/png";
    return `data:${mimeType};base64,${output.toString("base64")}`;
}

async function executeComputerAction(action: ComputerAction): Promise<void> {
    console.log(`Computer Use: executing action ${JSON.stringify(action)}`);
    if (action.type === "wait" || action.type === "screenshot") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return;
    }

    const command = process.env.BITWIG_CUA_ACTION_CMD;
    if (!command) {
        throw new Error(`Computer Use requested ${action.type}, but BITWIG_CUA_ACTION_CMD is not configured`);
    }

    await runCommand(command, JSON.stringify(action));
}

async function createResponse(body: Record<string, unknown>): Promise<ResponsesApiResult> {
    let response: Response;
    try {
        const model = typeof body.model === "string" ? body.model : "unknown";
        console.log(`Computer Use: sending Responses API request with model ${model}`);
        response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${requireEnv("OPENAI_API_KEY")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    } catch (error) {
        throw new ComputerUseNetworkError(`Could not reach OpenAI Responses API: ${String(error)}`);
    }

    if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404 && (errorText.includes("model_not_found") || errorText.includes("does not exist"))) {
            throw new ComputerUseUnavailableError(`Computer Use model is unavailable for this API key/project: ${errorText}`);
        }
        throw new Error(`OpenAI Responses API returned ${response.status}: ${errorText}`);
    }

    return await response.json() as ResponsesApiResult;
}

function findComputerCall(response: ResponsesApiResult): ComputerCall | undefined {
    return response.output?.find((item): item is ComputerCall => item.type === "computer_call");
}

function computerTool(displayWidth: number, displayHeight: number, environment: string): Record<string, unknown> {
    if (useLegacyPreview()) {
        return {
            type: "computer_use_preview",
            display_width: displayWidth,
            display_height: displayHeight,
            environment,
        };
    }

    return {
        type: "computer",
    };
}

function computerCallOutput(callId: string, screenshot: string): Record<string, unknown> {
    if (useLegacyPreview()) {
        return {
            type: "computer_call_output",
            call_id: callId,
            output: {
                type: "computer_screenshot",
                image_url: screenshot,
            },
        };
    }

    return {
        type: "computer_call_output",
        call_id: callId,
        output: {
            type: "input_image",
            image_url: screenshot,
            detail: "original",
        },
    };
}

function actionsForCall(computerCall: ComputerCall): ComputerAction[] {
    if (computerCall.actions) return computerCall.actions;
    if (computerCall.action) return [computerCall.action];
    return [];
}

function collectText(response: ResponsesApiResult): string {
    if (response.output_text) return response.output_text;

    const chunks: string[] = [];
    for (const item of response.output ?? []) {
        if ("text" in item && item.text) chunks.push(item.text);
        if ("content" in item && item.content) {
            for (const content of item.content) {
                if (content.text) chunks.push(content.text);
            }
        }
        if ("summary" in item && item.summary) {
            for (const summary of item.summary) {
                if (summary.text) chunks.push(summary.text);
            }
        }
    }

    return chunks.join("\n").trim();
}

export async function runComputerUseReview(options: ComputerUseReviewOptions): Promise<string> {
    const displayWidth = Number(process.env.BITWIG_CUA_DISPLAY_WIDTH ?? 1280);
    const displayHeight = Number(process.env.BITWIG_CUA_DISPLAY_HEIGHT ?? 800);
    const maxSteps = Number(process.env.BITWIG_CUA_MAX_STEPS ?? 6);
    const model = process.env.BITWIG_CUA_MODEL ?? (useLegacyPreview() ? "computer-use-preview" : "gpt-5.5");
    const environment = process.env.BITWIG_CUA_ENVIRONMENT ?? "linux";

    let screenshot = await captureScreenshotDataUrl();
    let response = await createResponse({
        model,
        tools: [computerTool(displayWidth, displayHeight, environment)],
        input: [{
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: [
                        options.prompt,
                        "",
                        "Expected Beat Twin tracks:",
                        ...options.expectedTracks.map((track) => `- ${track}`),
                        "",
                        "Do not save, export, delete, browse the filesystem, install devices, or modify non-test tracks.",
                        "Return PASS, SOFT_FAIL, or HARD_FAIL with concise notes.",
                    ].join("\n"),
                },
                {
                    type: "input_image",
                    image_url: screenshot,
                    detail: "original",
                },
            ],
        }],
        reasoning: { summary: "concise" },
        ...(useLegacyPreview() ? { truncation: "auto" } : {}),
    });

    for (let step = 0; step < maxSteps; step += 1) {
        console.log(`Computer Use: processing step ${step + 1}/${maxSteps}`);
        const computerCall = findComputerCall(response);
        if (!computerCall) {
            return collectText(response);
        }

        if (computerCall.pending_safety_checks && computerCall.pending_safety_checks.length > 0) {
            throw new Error(`Computer Use safety check requires human acknowledgement: ${JSON.stringify(computerCall.pending_safety_checks)}`);
        }

        for (const action of actionsForCall(computerCall)) {
            await executeComputerAction(action);
        }
        screenshot = await captureScreenshotDataUrl();

        response = await createResponse({
            model,
            previous_response_id: response.id,
            tools: [computerTool(displayWidth, displayHeight, environment)],
            input: [computerCallOutput(computerCall.call_id, screenshot)],
            ...(useLegacyPreview() ? { truncation: "auto" } : {}),
        });
    }

    throw new Error(`Computer Use review did not finish within ${maxSteps} steps`);
}

export function isComputerUseConfigured(): boolean {
    return Boolean(process.env.OPENAI_API_KEY && process.env.BITWIG_CUA_SCREENSHOT_CMD);
}
