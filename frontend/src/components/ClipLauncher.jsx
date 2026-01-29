import React from 'react';
import { Play, Circle, Square, Disc } from 'lucide-react';

export function ClipLauncher({ clipGrid, tracks, onLaunchClip, onStopTrack, onRecordClip }) {
    if (!clipGrid || clipGrid.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-gray-900/30 rounded-xl border border-dashed border-gray-700 text-gray-500">
                Loading Clip Grid...
            </div>
        );
    }

    return (
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm p-4">
            <div className="flex">
                {/* Track Headers (Vertical) */}
                <div className="flex flex-col space-y-1 mr-2">
                    <div className="h-8"></div> {/* Spacer for scene numbers */}
                    {tracks.slice(0, 8).map((track, i) => (
                        <div
                            key={i}
                            className="h-16 w-20 flex flex-col items-center justify-center bg-gray-800/50 rounded border border-gray-700 group relative"
                        >
                            <div className="text-[10px] text-gray-500 font-mono">{i + 1}</div>
                            <div className="text-xs font-bold text-gray-300 truncate w-full px-1 text-center" title={track?.name || `Track ${i + 1}`}>
                                {track?.name || `Trk ${i + 1}`}
                            </div>
                            <button
                                onClick={() => onStopTrack(i)}
                                className="absolute bottom-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-500/20 hover:bg-red-500/40 rounded text-red-400"
                                title="Stop Track"
                            >
                                <Square size={10} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Clip Grid */}
                <div className="flex-1 overflow-x-auto">
                    <div className="inline-flex flex-col space-y-1">
                        {/* Scene Numbers */}
                        <div className="flex space-x-1 mb-1">
                            {Array.from({ length: 8 }).map((_, sceneIdx) => (
                                <div
                                    key={sceneIdx}
                                    className="w-16 h-6 flex items-center justify-center text-[10px] text-gray-600 font-mono"
                                >
                                    {sceneIdx + 1}
                                </div>
                            ))}
                        </div>

                        {/* Clip Slots (8 tracks × 8 scenes) */}
                        {clipGrid.map((trackSlots, trackIdx) => (
                            <div key={trackIdx} className="flex space-x-1">
                                {trackSlots.map((slot) => (
                                    <ClipSlot
                                        key={`${slot.trackIndex}-${slot.sceneIndex}`}
                                        slot={slot}
                                        onLaunch={() => onLaunchClip(slot.trackIndex, slot.sceneIndex)}
                                        onRecord={() => onRecordClip(slot.trackIndex, slot.sceneIndex)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ClipSlot({ slot, onLaunch, onRecord }) {
    const { hasContent, isPlaying, isRecording, isPlaybackQueued } = slot;

    let bgClass = "bg-gray-800";
    let borderClass = "border-gray-700";
    let icon = <Circle size={16} className="text-gray-600" />;

    if (isRecording) {
        bgClass = "bg-red-500/30 animate-pulse";
        borderClass = "border-red-500";
        icon = <Disc size={16} className="text-red-400" />;
    } else if (isPlaying) {
        bgClass = "bg-green-500/30";
        borderClass = "border-green-500";
        icon = <Play size={16} className="text-green-400 fill-green-400" />;
    } else if (isPlaybackQueued) {
        bgClass = "bg-yellow-500/30";
        borderClass = "border-yellow-500";
        icon = <Play size={16} className="text-yellow-400" />;
    } else if (hasContent) {
        bgClass = "bg-blue-500/20";
        borderClass = "border-blue-500/50";
        icon = <Square size={16} className="text-blue-400 fill-blue-400/50" />;
    }

    return (
        <button
            onClick={onLaunch}
            onContextMenu={(e) => {
                e.preventDefault();
                onRecord();
            }}
            className={`w-16 h-16 rounded border ${bgClass} ${borderClass} hover:scale-105 transition-all cursor-pointer flex items-center justify-center group relative`}
            title={`Track ${slot.trackIndex + 1}, Scene ${slot.sceneIndex + 1}`}
        >
            {icon}
            {!hasContent && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Disc size={12} className="text-gray-500" />
                </div>
            )}
        </button>
    );
}
