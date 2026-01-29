import React from 'react';
import { Power, Trash2, Sliders } from 'lucide-react';

export function DeviceRack({ devices, onBypass, onDelete }) {
    if (!devices || devices.length === 0) {
        return (
            <div className="w-full h-32 flex items-center justify-center bg-gray-900/30 rounded-xl border border-dashed border-gray-700 text-gray-500">
                No Devices on Selected Track
            </div>
        );
    }

    return (
        <div className="flex space-x-2 overflow-x-auto p-4 bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm min-h-[160px]">
            {devices.map((device) => (
                <DeviceCard
                    key={device.index}
                    device={device}
                    onBypass={() => onBypass(device.index, !device.enabled)} // device.enabled is true if NOT bypassed
                    onDelete={() => onDelete(device.index)}
                />
            ))}
        </div>
    );
}

function DeviceCard({ device, onBypass, onDelete }) {
    const isEnabled = device.enabled;

    return (
        <div className={`flex flex-col w-40 h-32 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg border shadow-lg transition-all relative group ${isEnabled ? 'border-gray-600' : 'border-gray-800 opacity-60'}`}>
            {/* Header / Title */}
            <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-t-lg border-b border-gray-700">
                <button
                    onClick={onBypass}
                    className={`p-1 rounded-full transition-colors ${isEnabled ? 'bg-orange-500 text-white shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-gray-600 text-gray-400'}`}
                    title={isEnabled ? "Disable Device" : "Enable Device"}
                >
                    <Power size={12} />
                </button>
                <span className="text-xs font-bold text-gray-200 truncate flex-1 mx-2 text-center" title={device.name}>
                    {device.name}
                </span>
                <button
                    onClick={onDelete}
                    className="p-1 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Device"
                >
                    <Trash2 size={12} />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 flex items-center justify-center p-2">
                <div className="text-gray-500">
                    <Sliders size={24} opacity={0.2} />
                </div>
            </div>

            {/* Footer / Index */}
            <div className="absolute bottom-1 right-2 text-[9px] text-gray-600 font-mono">
                #{device.index + 1}
            </div>
        </div>
    );
}
