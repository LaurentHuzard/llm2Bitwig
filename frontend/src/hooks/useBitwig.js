import { useState, useEffect, useRef, useCallback } from 'react';

export function useBitwig() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [tracks, setTracks] = useState([]);
    const [connected, setConnected] = useState(false);
    const ws = useRef(null);

    const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
    const [devices, setDevices] = useState([]);
    const [clipInfo, setClipInfo] = useState(null);
    const [clipGrid, setClipGrid] = useState([]);
    const [notes, setNotes] = useState({}); // Map of "step,pitch" -> state (0, 1, 2)

    // Connect to WebSocket
    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080');

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
                const data = JSON.parse(event.data);

                // --- Handle Pushed Events ---
                if (data.method === 'transport.state') {
                    if (data.params.isPlaying !== undefined) setIsPlaying(data.params.isPlaying);
                } else if (data.method === 'track.update') {
                    setTracks(prev => {
                        const newTracks = [...prev];
                        const idx = data.params.index;
                        if (!newTracks[idx]) newTracks[idx] = { index: idx };
                        newTracks[idx] = { ...newTracks[idx], ...data.params };
                        return newTracks;
                    });
                } else if (data.method === 'clip_launcher.slot_update') {
                    setClipGrid(prev => {
                        const newGrid = [...prev];
                        const { trackIndex, sceneIndex } = data.params;
                        if (!newGrid[trackIndex]) newGrid[trackIndex] = [];
                        newGrid[trackIndex][sceneIndex] = { ...newGrid[trackIndex][sceneIndex], ...data.params };
                        return newGrid;
                    });
                } else if (data.method === 'clip.step_update') {
                    const { x, y, state } = data.params;
                    setNotes(prev => ({
                        ...prev,
                        [`${x},${y}`]: state
                    }));
                } else if (data.method === 'clip.play_step') {
                    setClipInfo(prev => ({
                        ...prev,
                        playingStep: data.params.step
                    }));
                }

                // --- Handle Response to Explicit Calls (Polling Fallback/Initialization) ---
                if (data.id === 'poll_tracks') {
                    setTracks(data.result || []);
                } else if (data.id === 'poll_devices') {
                    setDevices(data.result || []);
                } else if (data.id === 'poll_clip') {
                    setClipInfo(data.result || null);
                } else if (data.id === 'poll_clip_grid') {
                    setClipGrid(data.result || []);
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
            ws.current.send(JSON.stringify({ action: "call", method: "track_bank_get_status", id: "poll_tracks" }));
            ws.current.send(JSON.stringify({ action: "call", method: "clip_get_grid", id: "poll_clip_grid" }));
        }

        const interval = setInterval(() => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                // Poll things that don't have push events yet (like detailed device info if needed)
                if (selectedTrackIndex >= 0) {
                    ws.current.send(JSON.stringify({
                        action: "call",
                        method: "device_list",
                        params: { trackIndex: selectedTrackIndex },
                        id: "poll_devices"
                    }));
                }

                // We still poll for clip info like loop length which doesn't change often but lacks push
                ws.current.send(JSON.stringify({
                    action: "call",
                    method: "clip_get_info",
                    id: "poll_clip"
                }));
            }
        }, 500); // Slower polling for remaining bits

        return () => clearInterval(interval);
    }, [connected, selectedTrackIndex]);


    // Actions
    const transport = {
        play: () => ws.current.send(JSON.stringify({ action: "call", method: "transport_play" })),
        stop: () => ws.current.send(JSON.stringify({ action: "call", method: "transport_stop" })),
        restart: () => ws.current.send(JSON.stringify({ action: "call", method: "transport_restart" })),
    };

    const mixer = {
        setVolume: (index, value) => {
            ws.current.send(JSON.stringify({
                action: "call",
                method: "track_bank_set_volume",
                params: { index, value }
            }));
        },
        setPan: (index, value) => {
            ws.current.send(JSON.stringify({
                action: "call",
                method: "track_bank_set_pan",
                params: { index, value }
            }));
        },
        selectTrack: (index) => {
            setSelectedTrackIndex(index);
            // Optionally tell Bitwig to select it too?
            ws.current.send(JSON.stringify({
                action: "call",
                method: "track_bank_select",
                params: { index }
            }));
        }
    };

    const deviceActions = {
        bypass: (deviceIndex, currentBypassState) => {
            ws.current.send(JSON.stringify({
                action: "call",
                method: "device_bypass",
                params: { trackIndex: selectedTrackIndex, deviceIndex, bypass: !currentBypassState }
            }));
        },
        delete: (deviceIndex) => {
            ws.current.send(JSON.stringify({
                action: "call",
                method: "device_delete",
                params: { trackIndex: selectedTrackIndex, deviceIndex }
            }));
        }
    };

    const clipActions = {
        toggleNote: (step, pitch, velocity = 1.0) => {
            ws.current.send(JSON.stringify({
                action: "call",
                method: "clip_toggle_note",
                params: { step, pitch, velocity }
            }));
        },
        setNote: (step, pitch, velocity, duration) => {
            ws.current.send(JSON.stringify({
                action: "call",
                method: "clip_set_note",
                params: { step, pitch, velocity, duration }
            }));
        },
        clearNote: (step, pitch) => {
            ws.current.send(JSON.stringify({
                action: "call",
                method: "clip_clear_note",
                params: { step, pitch }
            }));
        }
    };

    const clipLauncherActions = {
        launch: (trackIndex, sceneIndex) => {
            ws.current.send(JSON.stringify({
                action: "call",
                method: "clip_launch",
                params: { trackIndex, slotIndex: sceneIndex }
            }));
        },
        stop: (trackIndex) => {
            ws.current.send(JSON.stringify({
                action: "call",
                method: "clip_stop",
                params: { trackIndex }
            }));
        },
        record: (trackIndex, sceneIndex) => {
            ws.current.send(JSON.stringify({
                action: "call",
                method: "clip_record",
                params: { trackIndex, slotIndex: sceneIndex }
            }));
        }
    };

    return { isConnected: connected, isPlaying, tracks, selectedTrackIndex, devices, clipInfo, clipGrid, notes, transport, mixer, deviceActions, clipActions, clipLauncherActions };

}
