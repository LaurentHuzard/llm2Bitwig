import React, { useState } from 'react';

export function StepSequencer({ clipInfo, notes = {}, onToggleNote }) {
    const [selectedPitch, setSelectedPitch] = useState(60); // Middle C
    const [velocity, setVelocity] = useState(0.8);

    const steps = 16;
    const pitches = [
        { note: 'C4', midi: 60 },
        { note: 'B3', midi: 59 },
        { note: 'A3', midi: 57 },
        { note: 'G3', midi: 55 },
        { note: 'F3', midi: 53 },
        { note: 'E3', midi: 52 },
        { note: 'D3', midi: 50 },
        { note: 'C3', midi: 48 },
    ];

    const handleStepClick = (step, pitch) => {
        onToggleNote(step, pitch, velocity);
    };

    const playingStep = clipInfo?.playingStep ?? -1;

    return (
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm p-6">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <label className="text-sm text-gray-400">Velocity:</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={velocity}
                        onChange={(e) => setVelocity(parseFloat(e.target.value))}
                        className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 font-mono w-12">{Math.round(velocity * 127)}</span>
                </div>

                {clipInfo && (
                    <div className="text-xs text-gray-500">
                        Loop: {clipInfo.loopLength?.toFixed(2)} beats
                    </div>
                )}
            </div>

            {/* Step Grid */}
            <div className="flex">
                {/* Pitch Labels */}
                <div className="flex flex-col space-y-1 mr-2">
                    {pitches.map((p) => (
                        <div
                            key={p.midi}
                            className="h-8 w-10 flex items-center justify-center text-xs font-mono text-gray-400 bg-gray-800/50 rounded border border-gray-700"
                        >
                            {p.note}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-x-auto">
                    <div className="inline-flex flex-col space-y-1">
                        {pitches.map((p) => (
                            <div key={p.midi} className="flex space-x-1">
                                {Array.from({ length: steps }).map((_, stepIdx) => (
                                    <StepButton
                                        key={stepIdx}
                                        step={stepIdx}
                                        pitch={p.midi}
                                        isPlaying={stepIdx === playingStep}
                                        isActive={notes[`${stepIdx},${p.midi}`] > 0}
                                        onClick={() => handleStepClick(stepIdx, p.midi)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Step Numbers */}
            <div className="flex mt-2 ml-12">
                {Array.from({ length: steps }).map((_, i) => (
                    <div
                        key={i}
                        className="w-8 text-center text-[10px] text-gray-600 font-mono"
                    >
                        {i + 1}
                    </div>
                ))}
            </div>
        </div>
    );
}

function StepButton({ step, pitch, isPlaying, isActive, onClick }) {
    const baseClasses = "w-8 h-8 rounded border transition-all cursor-pointer";

    let classes = baseClasses;
    if (isPlaying) {
        classes += " ring-2 ring-blue-400 ring-offset-1 ring-offset-gray-900";
    }

    if (isActive) {
        classes += " bg-gradient-to-br from-purple-500 to-pink-500 border-purple-400 shadow-lg shadow-purple-500/50";
    } else {
        classes += " bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600";
    }

    // Highlight every 4th step
    if (step % 4 === 0 && !isActive) {
        classes += " border-gray-600";
    }

    return (
        <button
            onClick={onClick}
            className={classes}
            title={`Step ${step + 1}, Pitch ${pitch}`}
        />
    );
}
