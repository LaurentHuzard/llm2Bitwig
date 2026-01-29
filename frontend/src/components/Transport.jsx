import React from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';

export function Transport({ isPlaying, onPlay, onStop, onRestart }) {
    return (
        <div className="flex items-center space-x-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-lg">
            <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-mono tracking-widest uppercase mb-1">Transport</span>
                <div className="flex space-x-2">
                    <button
                        onClick={onRestart}
                        className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-gray-200 transition-all hover:scale-105"
                    >
                        <RotateCcw size={20} />
                    </button>
                    <button
                        onClick={onStop}
                        className={`p-3 rounded-lg transition-all hover:scale-105 ${!isPlaying ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
                    >
                        <Square size={20} fill={!isPlaying ? "currentColor" : "none"} />
                    </button>
                    <button
                        onClick={onPlay}
                        className={`p-3 rounded-lg transition-all hover:scale-105 ${isPlaying ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.3)]' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
                    >
                        <Play size={20} fill={isPlaying ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            {/* Status Display */}
            <div className="h-12 w-[1px] bg-gray-700 mx-2"></div>

            <div className="flex flex-col min-w-[100px]">
                <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">Status</span>
                <span className={`text-xl font-bold font-mono ${isPlaying ? 'text-green-400 animate-pulse' : 'text-gray-500'}`}>
                    {isPlaying ? 'PLAYING' : 'STOPPED'}
                </span>
            </div>
        </div>
    );
}
