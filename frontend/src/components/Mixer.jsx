import React from 'react';

export function Mixer({ tracks, onSetVolume, onSetPan, selectedIndex, onSelectTrack }) {
    // Ensure we have 8 slots even if tracks is empty
    const slots = Array(8).fill(null).map((_, i) => tracks[i] || { name: `Track ${i + 1}`, volume: 0, pan: 0.5, color: '#444' });

    return (
        <div className="flex space-x-2 overflow-x-auto p-4 bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm">
            {slots.map((track, i) => (
                <MixerChannel
                    key={i}
                    index={i}
                    track={track}
                    isSelected={selectedIndex === i}
                    onSelect={() => onSelectTrack(i)}
                    onVolumeChange={(val) => onSetVolume(i, val)}
                    onPanChange={(val) => onSetPan(i, val)}
                />
            ))}
        </div>
    );
}

function MixerChannel({ index, track, onVolumeChange, onPanChange, isSelected, onSelect }) {
    // Generate a color style if track has one
    const colorStyle = track.color ? { backgroundColor: `rgb(${track.color.r * 255}, ${track.color.g * 255}, ${track.color.b * 255})` } : { backgroundColor: '#374151' };

    return (
        <div
            onClick={onSelect}
            className={`flex flex-col items-center w-20 bg-gray-800/80 rounded-lg p-2 border shadow-lg group hover:border-gray-600 transition-all cursor-pointer ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/30 ring-offset-1 ring-offset-gray-900 scale-105 z-10' : 'border-gray-700'}`}
        >
            {/* Pan Knob (Simulated) */}
            <div className="mb-4 w-full flex justify-center" onClick={(e) => e.stopPropagation()}>
                <input
                    type="range"
                    min="0" max="1" step="0.01"
                    value={track.pan || 0.5}
                    onChange={(e) => onPanChange(parseFloat(e.target.value))}
                    className="w-12 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* Volume Fader */}
            <div className="relative h-48 w-8 bg-gray-900 rounded-full border border-gray-800 flex justify-center py-2 shadow-inner" onClick={(e) => e.stopPropagation()}>
                <input
                    type="range"
                    min="0" max="1" step="0.01"
                    value={track.volume || 0}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="absolute bg-transparent appearance-none h-48 w-8 -rotate-90 origin-center cursor-pointer opacity-0 z-10"
                    style={{ transform: 'rotate(-90deg) translateX(-80px)', width: '192px' }} // Hacky vertical slider
                />
                {/* Visual Fader Cap */}
                <div
                    className="absolute bottom-1 w-6 h-10 bg-gray-300 rounded shadow-md border-t border-white/50 pointer-events-none transition-all duration-75"
                    style={{ bottom: `${(track.volume || 0) * 80}%` }}
                >
                    <div className="w-full h-[2px] bg-gray-800 mt-[50%]"></div>
                </div>
            </div>

            {/* Track Info */}
            <div className="mt-3 w-full text-center">
                <div className="text-[10px] text-gray-400 font-mono truncate px-1">{index + 1}</div>
                <div className="text-xs font-bold text-gray-200 truncate px-1" title={track.name}>{track.name}</div>
            </div>

            {/* Color Strip */}
            <div className="mt-2 w-full h-1 rounded-full" style={colorStyle}></div>
        </div>
    )
}
