import assert from "assert";
import { TestClient } from "./TestClient.js";
import {
    ComputerUseNetworkError,
    ComputerUseUnavailableError,
    isComputerUseConfigured,
    runComputerUseReview,
} from "./ComputerUseReview.js";

type TrackInfo = {
    index: number;
    name: string;
    type?: string;
    position?: number;
    color?: {
        red?: number;
        green?: number;
        blue?: number;
    };
};

type LanePlan = {
    role: string;
    createTool: "application_create_instrument_track" | "application_create_audio_track";
    color: { red: number; green: number; blue: number };
};

type ClipStatus = {
    hasContent: boolean;
    isPlaying: boolean;
    isRecording: boolean;
    isPlaybackQueued: boolean;
};

const RUN_TOKEN = process.env.BITWIG_E2E_TOKEN ?? new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 12);
const TRACK_NAMESPACE = `BT_E2E_${RUN_TOKEN}`;

const LANES: LanePlan[] = [
    { role: "DRUMS", createTool: "application_create_instrument_track", color: { red: 0.95, green: 0.29, blue: 0.18 } },
    { role: "BASS", createTool: "application_create_instrument_track", color: { red: 0.27, green: 0.68, blue: 0.35 } },
    { role: "HARMONY", createTool: "application_create_instrument_track", color: { red: 0.25, green: 0.45, blue: 0.95 } },
    { role: "LEAD", createTool: "application_create_instrument_track", color: { red: 0.88, green: 0.42, blue: 0.86 } },
    { role: "TEXTURE", createTool: "application_create_audio_track", color: { red: 0.93, green: 0.72, blue: 0.24 } },
];

function requireRealE2E(): void {
    assert.strictEqual(
        process.env.BITWIG_REAL_E2E,
        "1",
        "Refusing to modify Bitwig. Re-run with BITWIG_REAL_E2E=1 against a dedicated test project."
    );
}

async function waitFor<T>(label: string, fn: () => Promise<T | undefined>, timeoutMs = 10000): Promise<T> {
    const startedAt = Date.now();
    let lastError: unknown;

    while (Date.now() - startedAt < timeoutMs) {
        try {
            const value = await fn();
            if (value !== undefined) return value;
        } catch (error) {
            lastError = error;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    throw new Error(`Timed out waiting for ${label}${lastError ? `: ${String(lastError)}` : ""}`);
}

function trackName(role: string): string {
    return `${TRACK_NAMESPACE}_${role}`;
}

function findNewTrackIndex(before: TrackInfo[], after: TrackInfo[]): number {
    const beforeIndexes = new Set(before.map((track) => track.index));
    const newTrack = after.find((track) => !beforeIndexes.has(track.index));
    if (newTrack) return newTrack.index;

    const sorted = [...after].sort((a, b) => a.index - b.index);
    const fallback = sorted[sorted.length - 1];
    assert.ok(fallback, "Expected at least one visible track after creation");
    return fallback.index;
}

async function getTracks(client: TestClient): Promise<TrackInfo[]> {
    return await client.callTool<TrackInfo[]>("track_list");
}

async function createAndNameLane(client: TestClient, lane: LanePlan): Promise<TrackInfo> {
    const before = await getTracks(client);

    await client.callTool<string>(lane.createTool);
    const after = await waitFor(`new ${lane.role} track`, async () => {
        const tracks = await getTracks(client);
        return tracks.length > before.length ? tracks : undefined;
    });

    const index = findNewTrackIndex(before, after);
    const name = trackName(lane.role);

    await client.callTool<string>("track_rename", { index, name });
    await client.callTool<string>("track_set_color", { index, ...lane.color });

    return await waitFor(`renamed ${name}`, async () => {
        const tracks = await getTracks(client);
        return tracks.find((track) => track.name === name);
    });
}

async function createClipPlaceholders(client: TestClient, tracks: TrackInfo[]): Promise<void> {
    for (const track of tracks) {
        await client.callTool<string>("clip_create", {
            trackIndex: track.index,
            slotIndex: 0,
            lengthBeats: 4,
        });
    }
}

async function verifyCompositionState(client: TestClient, expectedNames: string[]): Promise<void> {
    const tracks = await getTracks(client);

    for (const name of expectedNames) {
        const track = tracks.find((candidate) => candidate.name === name);
        assert.ok(track, `Expected Bitwig track ${name} to exist`);
        assert.ok(track.index >= 0, `Expected ${name} to have a valid track index`);
    }

    await client.callTool<unknown>("transport_get_tempo");
}

function shouldClickPlayClip(): boolean {
    return process.env.BITWIG_CUA_CLICK_PLAY_CLIP === "1" && !shouldClickKeyboard();
}

function shouldClickKeyboard(): boolean {
    return process.env.BITWIG_CUA_CLICK_KEYBOARD === "1";
}

async function verifyClipWasLaunched(client: TestClient, trackIndex: number): Promise<void> {
    let lastStatus: ClipStatus | undefined;

    await waitFor("Computer Use clip launch", async () => {
        const status = await client.callTool<ClipStatus>("clip_get_status", {
            trackIndex,
            sceneIndex: 0,
        });
        lastStatus = status;

        return status.isPlaying || status.isPlaybackQueued ? status : undefined;
    }, 8000).catch((error: unknown) => {
        throw new Error(`${String(error)}. Last clip status: ${JSON.stringify(lastStatus)}`);
    });
}

async function run(): Promise<void> {
    requireRealE2E();

    console.log("=== Beat Twin Real Bitwig Composition E2E ===");
    console.log(`Namespace: ${TRACK_NAMESPACE}`);

    const client = new TestClient();
    const createdTracks: TrackInfo[] = [];

    try {
        await client.connect();

        for (const lane of LANES) {
            const created = await createAndNameLane(client, lane);
            createdTracks.push(created);
            console.log(`Created ${created.name} at visible index ${created.index}`);
        }

        await createClipPlaceholders(client, createdTracks);

        const expectedNames = LANES.map((lane) => trackName(lane.role));
        await verifyCompositionState(client, expectedNames);
        console.log("MCP assertions passed.");

        if (isComputerUseConfigured()) {
            try {
                const clickInstructions: string[] = [];
                if (shouldClickPlayClip()) {
                    clickInstructions.push(
                        "",
                        "After confirming the expected tracks are visible, click the actual first clip cell in Scene 1 on the DRUMS test track only.",
                        "The click must target the clip slot/cell itself, not the track header, not the track activator, not a global play button, and not a control near the right edge of the track row.",
                        "If the clip launcher grid is not visible or you cannot identify the DRUMS Scene 1 clip cell, return SOFT_FAIL instead of clicking.",
                        "Do not click clips or controls outside the BT_E2E namespace.",
                    );
                }
                if (shouldClickKeyboard()) {
                    clickInstructions.push(
                        "",
                        "After confirming the expected tracks are visible, click one large visible key on the on-screen piano keyboard at the bottom of Bitwig.",
                        "Target the body of a clearly visible white key near the center of the keyboard, not a tiny label, not the device header, and not any browser/sidebar item.",
                        "This is a desktop input smoke test only: return PASS if the click lands on the visible keyboard area, or SOFT_FAIL if the keyboard is not visible.",
                    );
                }

                const review = await runComputerUseReview({
                    expectedTracks: expectedNames,
                    prompt: `Review the visible Bitwig project created by Beat Twin after a real MCP E2E composition test.${clickInstructions.join("\n")}`,
                });
                console.log("Computer Use review:");
                console.log(review);
                assert.match(review, /\b(PASS|SOFT_FAIL)\b/i, "Computer Use review did not return PASS or SOFT_FAIL");

                if (shouldClickPlayClip()) {
                    await verifyClipWasLaunched(client, createdTracks[0].index);
                    console.log("Computer Use clip launch verified through MCP.");
                }
                if (shouldClickKeyboard()) {
                    console.log("Computer Use keyboard click completed as a visual desktop-input smoke test.");
                }
            } catch (error) {
                if (
                    (error instanceof ComputerUseUnavailableError || error instanceof ComputerUseNetworkError) &&
                    process.env.BITWIG_CUA_REQUIRED !== "1"
                ) {
                    console.warn(`Computer Use review skipped: ${error.message}`);
                } else {
                    throw error;
                }
            }
        } else {
            console.log("Computer Use review skipped. Set OPENAI_API_KEY and BITWIG_CUA_SCREENSHOT_CMD to enable it.");
        }

        console.log("=== Beat Twin Real Bitwig Composition E2E passed ===");
    } finally {
        await client.disconnect();
    }
}

run().catch((error: unknown) => {
    console.error("Beat Twin real Bitwig E2E failed:", error);
    process.exit(1);
});
