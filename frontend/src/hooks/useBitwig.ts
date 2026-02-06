import { useState, useEffect, useRef } from 'react';

type Track = {
    index?: number;
    name?: string;
    volume?: number;
    pan?: number;
    mute?: boolean;
    solo?: boolean;
    [key: string]: unknown;
};

type Device = {
    name?: string;
    bypass?: boolean;
    [key: string]: unknown;
};

type ClipInfo = {
    playingStep?: number;
    [key: string]: unknown;
} | null;

type ClipSlot = {
    hasClip?: boolean;
    isPlaying?: boolean;
    isRecording?: boolean;
    color?: unknown;
    name?: string;
    [key: string]: unknown;
};

type ClipGrid = ClipSlot[][];

type NotesMap = Record<string, number>;

type WsMessage = {
    method?: string;
    params?: Record<string, unknown>;
    id?: string | number;
    result?: unknown;
};

export function useBitwig() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [connected, setConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);

    const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
    const [devices, setDevices] = useState<Device[]>([]);
    const [clipInfo, setClipInfo] = useState<ClipInfo>(null);
    const [clipGrid, setClipGrid] = useState<ClipGrid>([]);
    const [notes, setNotes] = useState<NotesMap>({});

    const send = (payload: unknown) => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
        ws.current.send(JSON.stringify(payload));
    };

    // Connect to WebSocket
    useEffect(() => {
        const port = import.meta.env.VITE_BITWIG_WS_PORT || '2624';
        ws.current = new WebSocket(`ws://localhost:${port}`);

        ws.current.onopen = () => {
            console.log('Connected to Bitwig Server');
            setConnected(true);
        };

        ws.current.onclose = () => {
            console.log('Disconnected from Bitwig Server');
            setConnected(false);
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data as string) as WsMessage;
                const params = data.params ?? {};

                // --- Handle Pushed Events ---
                if (data.method === 'transport.state') {
                    if (params.isPlaying !== undefined) setIsPlaying(Boolean(params.isPlaying));
                } else if (data.method === 'track.update') {
                    setTracks(prev => {
                        const newTracks = [...prev];
                        const idx = Number(params.index ?? 0);
                        if (!newTracks[idx]) newTracks[idx] = { index: idx };
                        newTracks[idx] = { ...newTracks[idx], ...params };
                        return newTracks;
                    });
                } else if (data.method === 'clip_launcher.slot_update') {
                    setClipGrid(prev => {
                        const newGrid = [...prev];
                        const trackIndex = Number(params.trackIndex ?? 0);
                        const sceneIndex = Number(params.sceneIndex ?? 0);
                        if (!newGrid[trackIndex]) newGrid[trackIndex] = [];
                        newGrid[trackIndex][sceneIndex] = {
                            ...newGrid[trackIndex][sceneIndex],
                            ...params
                        };
                        return newGrid;
                    });
                } else if (data.method === 'clip.step_update') {
                    const { x, y, state } = params;
                    setNotes(prev => ({
                        ...prev,
                        [`${Number(x)},${Number(y)}`]: Number(state)
                    }));
                } else if (data.method === 'clip.play_step') {
                    setClipInfo(prev => ({
                        ...(prev ?? {}),
                        playingStep: Number(params.step ?? 0)
                    }));
                }

                // --- Handle Response to Explicit Calls (Polling Fallback/Initialization) ---
                if (data.id === 'poll_tracks') {
                    setTracks((data.result ?? []) as Track[]);
                } else if (data.id === 'poll_devices') {
                    setDevices((data.result ?? []) as Device[]);
                } else if (data.id === 'poll_clip') {
                    setClipInfo((data.result ?? null) as ClipInfo);
                } else if (data.id === 'poll_clip_grid') {
                    setClipGrid((data.result ?? []) as ClipGrid);
                }
            } catch (e) {
                console.error("Error parsing WS message", e);
            }
        };

        return () => {
            if (ws.current) ws.current.close();
        };
    }, []);

    // Polling Loop (Reduced)
    useEffect(() => {
        if (!connected) return;

        // Perform initial fetch
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            send({ action: "call", method: "track_bank_get_status", id: "poll_tracks" });
            send({ action: "call", method: "clip_get_grid", id: "poll_clip_grid" });
        }

        const interval = setInterval(() => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                // Poll things that don't have push events yet (like detailed device info if needed)
                if (selectedTrackIndex >= 0) {
                    send({
                        action: "call",
                        method: "device_list",
                        params: { trackIndex: selectedTrackIndex },
                        id: "poll_devices"
                    });
                }

                // We still poll for clip info like loop length which doesn't change often but lacks push
                send({
                    action: "call",
                    method: "clip_get_info",
                    id: "poll_clip"
                });
            }
        }, 500); // Slower polling for remaining bits

        return () => clearInterval(interval);
    }, [connected, selectedTrackIndex]);

    // Actions
    const transport = {
        play: () => send({ action: "call", method: "transport_play" }),
        stop: () => send({ action: "call", method: "transport_stop" }),
        restart: () => send({ action: "call", method: "transport_restart" }),
    };

    const mixer = {
        setVolume: (index: number, value: number) => {
            send({
                action: "call",
                method: "track_bank_set_volume",
                params: { index, value }
            });
        },
        setPan: (index: number, value: number) => {
            send({
                action: "call",
                method: "track_bank_set_pan",
                params: { index, value }
            });
        },
        selectTrack: (index: number) => {
            setSelectedTrackIndex(index);
            // Optionally tell Bitwig to select it too
            send({
                action: "call",
                method: "track_bank_select",
                params: { index }
            });
        }
    };

    const deviceActions = {
        bypass: (deviceIndex: number, currentBypassState: boolean) => {
            send({
                action: "call",
                method: "device_bypass",
                params: { trackIndex: selectedTrackIndex, deviceIndex, bypass: !currentBypassState }
            });
        },
        delete: (deviceIndex: number) => {
            send({
                action: "call",
                method: "device_delete",
                params: { trackIndex: selectedTrackIndex, deviceIndex }
            });
        }
    };

    const clipActions = {
        toggleNote: (step: number, pitch: number, velocity = 1.0) => {
            send({
                action: "call",
                method: "clip_toggle_note",
                params: { step, pitch, velocity }
            });
        },
        setNote: (step: number, pitch: number, velocity: number, duration: number) => {
            send({
                action: "call",
                method: "clip_set_note",
                params: { step, pitch, velocity, duration }
            });
        },
        clearNote: (step: number, pitch: number) => {
            send({
                action: "call",
                method: "clip_clear_note",
                params: { step, pitch }
            });
        }
    };

    const clipLauncherActions = {
        launch: (trackIndex: number, sceneIndex: number) => {
            send({
                action: "call",
                method: "clip_launch",
                params: { trackIndex, slotIndex: sceneIndex }
            });
        },
        stop: (trackIndex: number) => {
            send({
                action: "call",
                method: "clip_stop",
                params: { trackIndex }
            });
        },
        record: (trackIndex: number, sceneIndex: number) => {
            send({
                action: "call",
                method: "clip_record",
                params: { trackIndex, slotIndex: sceneIndex }
            });
        }
    };

    return {
        isConnected: connected,
        isPlaying,
        tracks,
        selectedTrackIndex,
        devices,
        clipInfo,
        clipGrid,
        notes,
        transport,
        mixer,
        deviceActions,
        clipActions,
        clipLauncherActions
    };
}
