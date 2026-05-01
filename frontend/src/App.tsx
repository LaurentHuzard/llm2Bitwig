import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ControllerView } from './components/ControllerView';
import { ChatView } from './components/ChatView';
import { AudioWaveform, LayoutGrid, MessageSquare } from 'lucide-react';
import { AudioDetectionView } from './components/AudioDetectionView';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur border border-gray-700 rounded-full px-6 py-3 flex items-center space-x-6 shadow-2xl z-50">
      <Link
        to="/"
        className={`flex flex-col items-center space-y-1 transition-colors ${location.pathname === '/' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <LayoutGrid size={24} />
        <span className="text-[10px] uppercase font-bold tracking-wider">Control</span>
      </Link>
      <div className="w-px h-8 bg-gray-700"></div>
      <Link
        to="/audio"
        className={`flex flex-col items-center space-y-1 transition-colors ${location.pathname === '/audio' ? 'text-cyan-300' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <AudioWaveform size={24} />
        <span className="text-[10px] uppercase font-bold tracking-wider">Audio</span>
      </Link>
      <div className="w-px h-8 bg-gray-700"></div>
      <Link
        to="/chat"
        className={`flex flex-col items-center space-y-1 transition-colors ${location.pathname === '/chat' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <MessageSquare size={24} />
        <span className="text-[10px] uppercase font-bold tracking-wider">Chat</span>
      </Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white p-8 flex flex-col items-center pb-24">
        <Routes>
          <Route path="/" element={<ControllerView />} />
          <Route path="/audio" element={<AudioDetectionView />} />
          <Route path="/chat" element={<ChatView />} />
        </Routes>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;
