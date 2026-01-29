import { useBitwig } from './hooks/useBitwig';
import { Transport } from './components/Transport';
import { Mixer } from './components/Mixer';
import { DeviceRack } from './components/DeviceRack';
import { StepSequencer } from './components/StepSequencer';
import { ClipLauncher } from './components/ClipLauncher';
import { Wifi, WifiOff } from 'lucide-react';

function App() {
  const { isConnected, isPlaying, tracks, selectedTrackIndex, devices, clipInfo, clipGrid, notes, transport, mixer, deviceActions, clipActions, clipLauncherActions } = useBitwig();

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      {/* Header / Connection Status */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Bitwig Virtual Controller
        </h1>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${isConnected ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="w-full max-w-6xl space-y-8">
        {/* Transport Section */}
        <section className="flex justify-center">
          <Transport
            isPlaying={isPlaying}
            onPlay={transport.play}
            onStop={transport.stop}
            onRestart={transport.restart}
          />
        </section>

        {/* Clip Launcher Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-300">Clip Launcher</h2>
            <span className="text-xs text-gray-500 uppercase tracking-widest">
              8 × 8 Grid
            </span>
          </div>
          <ClipLauncher
            clipGrid={clipGrid}
            tracks={tracks}
            onLaunchClip={clipLauncherActions.launch}
            onStopTrack={clipLauncherActions.stop}
            onRecordClip={clipLauncherActions.record}
          />
        </section>

        {/* Mixer Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-300">Mixer Console</h2>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Bank 1 (1-8)</span>
          </div>
          <Mixer
            tracks={tracks}
            selectedIndex={selectedTrackIndex}
            onSelectTrack={mixer.selectTrack}
            onSetVolume={mixer.setVolume}
            onSetPan={mixer.setPan}
          />
        </section>

        {/* Devices Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-300">Device Chain</h2>
            <span className="text-xs text-gray-500 uppercase tracking-widest">
              {tracks[selectedTrackIndex]?.name || `Track ${selectedTrackIndex + 1}`}
            </span>
          </div>
          <DeviceRack
            devices={devices}
            onBypass={deviceActions.bypass}
            onDelete={deviceActions.delete}
          />
        </section>

        {/* Step Sequencer Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-300">Step Sequencer</h2>
            <span className="text-xs text-gray-500 uppercase tracking-widest">
              Cursor Clip
            </span>
          </div>
          <StepSequencer
            clipInfo={clipInfo}
            notes={notes}
            onToggleNote={clipActions.toggleNote}
          />
        </section>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-600">
        Powered by Bitwig MCP • Node.js • React • Tailwind
      </div>
    </div>
  );
}

export default App;
