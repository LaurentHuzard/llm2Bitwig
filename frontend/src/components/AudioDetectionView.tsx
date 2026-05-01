import React, { useEffect, useMemo, useState } from 'react';
import {
    Activity,
    AlertTriangle,
    AudioLines,
    BrainCircuit,
    Drum,
    FileAudio,
    FolderOpen,
    Files,
    Loader2,
    Music2,
    Radar,
    SlidersHorizontal,
    Upload,
    Zap,
} from 'lucide-react';

type LevelResponse = {
    peak_left: number;
    peak_right: number;
    rms_left: number;
    rms_right: number;
};

type Device = {
    index: number;
    name: string;
    channels: number;
    samplerate: number;
};

type DeviceResponse = {
    devices: Device[];
    active_index: number | null;
};

type Candidate = {
    label: string;
    score: number;
};

type InstrumentDetection = {
    primary: string;
    confidence: number;
    candidates: Candidate[];
    transients: {
        count: number;
        density_per_second: number;
        mean_strength: number;
        peak_strength: number;
    };
    notes: string[];
};

type SemanticCandidate = {
    label: string;
    score: number;
    evidence: string;
};

type SemanticMeasure = {
    score: number;
    source: string;
    label?: string;
};

type SemanticRead = {
    mood: SemanticCandidate[];
    vibe: SemanticCandidate[];
    weirdness: SemanticMeasure;
    genericness: SemanticMeasure;
    coherence: SemanticMeasure;
    potential: SemanticMeasure;
    interpretation: {
        summary: string;
        reason_to_keep: string;
        suggested_mutation: string;
        caveats: string[];
    };
};

type AudioEvidence = {
    tempo: { value: number; confidence: number };
    key: { value: string; confidence: number };
    loudness: {
        rms: number;
        peak: number;
        dynamic_range: number;
        silence_ratio: number;
    };
    spectral: {
        centroid: number;
        rolloff: number;
        bandwidth: number;
        flatness: number;
        zero_crossing_rate: number;
        spectral_balance: number;
        bands: AnalysisResponse['features'];
        mfcc_mean: number[];
    };
    rhythm: {
        onset_count: number;
        onset_density_per_second: number;
        onset_mean_strength: number;
        onset_peak_strength: number;
        beat_stability: number;
    };
};

type ProvenanceModel = {
    name: string;
    status: string;
    version?: string;
};

type AnalysisResponse = {
    schema_version?: string;
    analyser_version?: string;
    source: string;
    filename?: string;
    features: Record<'sub' | 'bass' | 'low_mid' | 'mid' | 'high_mid' | 'high', number>;
    centroid: number;
    rms: number;
    peak: number;
    tempo: number;
    key: string;
    duration: number;
    instrument_detection: InstrumentDetection;
    audio_evidence?: AudioEvidence;
    semantic_read?: SemanticRead;
    provenance?: {
        models: ProvenanceModel[];
    };
};

type ScanSummary = {
    id: string;
    path: string;
    count: number;
    timestamp: number;
    status: 'scanning' | 'completed' | 'failed';
    error?: string | null;
};

type ScanStatusResponse = {
    id: string;
    status: 'scanning' | 'completed' | 'failed';
    progress: number;
    total: number;
    results: AnalysisResponse[];
    path: string;
    error: string | null;
};

const EAR_SERVICE_URL = import.meta.env.VITE_EAR_SERVICE_URL || 'http://127.0.0.1:8001';

const bandLabels: Array<keyof AnalysisResponse['features']> = ['sub', 'bass', 'low_mid', 'mid', 'high_mid', 'high'];

const labelNames: Record<string, string> = {
    kick: 'Kick',
    snare: 'Snare',
    closed_hat: 'Closed Hat',
    clap: 'Clap',
    tom: 'Tom',
    cymbal: 'Cymbal',
    bass: 'Bass',
    silence: 'Silence',
    unknown_percussion: 'Unknown Percussion',
};

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${EAR_SERVICE_URL}${path}`, init);
    const payload = await response.json();
    if (!response.ok) {
        const message = typeof payload.error === 'string' ? payload.error : `Request failed: ${response.status}`;
        throw new Error(message);
    }
    return payload as T;
}

function formatLabel(label: string): string {
    return labelNames[label] ?? label.replace(/_/g, ' ');
}

function asPercent(value: number): string {
    return `${Math.round(value * 100)}%`;
}

function Meter({ label, value, tone }: { label: string; value: number; tone: string }) {
    const width = `${Math.min(100, Math.max(0, value * 100))}%`;
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase tracking-[0.18em] text-slate-400">{label}</span>
                <span className="font-mono text-slate-300">{asPercent(value)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-950/80 ring-1 ring-white/5">
                <div className={`h-full rounded-full ${tone}`} style={{ width }} />
            </div>
        </div>
    );
}

function BandColumn({ label, value }: { label: string; value: number }) {
    const height = `${Math.max(5, Math.min(100, value * 180))}%`;
    return (
        <div className="flex h-40 min-w-0 flex-1 flex-col items-center justify-end gap-3 rounded-lg border border-white/5 bg-slate-950/45 p-3">
            <div className="flex h-24 w-full items-end justify-center">
                <div
                    className="w-full max-w-8 rounded-t-md bg-gradient-to-t from-cyan-500 to-amber-300 shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                    style={{ height }}
                />
            </div>
            <div className="min-h-8 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label.replace('_', ' ')}</p>
                <p className="font-mono text-xs text-slate-200">{asPercent(value)}</p>
            </div>
        </div>
    );
}

function SemanticPill({ item }: { item: SemanticCandidate }) {
    return (
        <div className="rounded-lg border border-white/5 bg-black/20 px-3 py-2">
            <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold capitalize text-slate-100">{formatLabel(item.label)}</span>
                <span className="font-mono text-xs text-cyan-200">{asPercent(item.score)}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">{item.evidence}</p>
        </div>
    );
}

function SemanticGauge({ label, measure, tone }: { label: string; measure?: SemanticMeasure; tone: string }) {
    const score = measure?.score ?? 0;
    return (
        <div className="rounded-lg border border-white/5 bg-black/20 p-3">
            <Meter label={label} value={score} tone={tone} />
            <p className="mt-3 text-xs leading-relaxed text-slate-400">{measure?.source ?? 'Waiting for semantic evidence.'}</p>
        </div>
    );
}

export const AudioDetectionView: React.FC = () => {
    const [levels, setLevels] = useState<LevelResponse | null>(null);
    const [devices, setDevices] = useState<Device[]>([]);
    const [activeDevice, setActiveDevice] = useState<number | null>(null);
    const [seconds, setSeconds] = useState(3);
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
    const [folderPath, setFolderPath] = useState('');
    const [folderResults, setFolderResults] = useState<AnalysisResponse[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAnalyzingFolder, setIsAnalyzingFolder] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Scan Monitoring & History
    const [scanHistory, setScanHistory] = useState<ScanSummary[]>([]);
    const [currentScanId, setCurrentScanId] = useState<string | null>(null);
    const [scanProgress, setScanProgress] = useState<{ current: number; total: number } | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

    const primary = analysis?.instrument_detection.primary ?? 'silence';
    const confidence = analysis?.instrument_detection.confidence ?? 0;
    const candidates = analysis?.instrument_detection.candidates.slice(0, 5) ?? [];
    const semanticRead = analysis?.semantic_read;
    const moodCandidates = semanticRead?.mood.slice(0, 3) ?? [];
    const vibeCandidates = semanticRead?.vibe.slice(0, 3) ?? [];
    const modelStatuses = analysis?.provenance?.models ?? [];

    const levelPeak = useMemo(() => {
        if (!levels) return 0;
        return Math.max(levels.peak_left, levels.peak_right);
    }, [levels]);

    useEffect(() => {
        let alive = true;

        const loadDevices = async () => {
            try {
                const payload = await requestJson<DeviceResponse>('/devices');
                if (!alive) return;
                setDevices(payload.devices);
                setActiveDevice(payload.active_index);
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Unknown error';
                if (alive) setError(`Could not load audio devices: ${msg} (from ${EAR_SERVICE_URL})`);
            }
        };

        void loadDevices();

        const interval = window.setInterval(async () => {
            try {
                const payload = await requestJson<LevelResponse>('/levels');
                if (alive) setLevels(payload);
            } catch {
                if (alive) setLevels(null);
            }
        }, 500);

        return () => {
            alive = false;
            window.clearInterval(interval);
        };
    }, []);

    // Load History on Mount
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const history = await requestJson<ScanSummary[]>('/scan-history');
                setScanHistory(history);
            } catch (err) {
                console.error('Failed to load scan history', err);
            }
        };
        void loadHistory();
    }, []);

    // Poll current scan
    useEffect(() => {
        if (!currentScanId) return;

        let alive = true;
        const poll = async () => {
            try {
                const status = await requestJson<ScanStatusResponse>(`/scan/${currentScanId}`);
                if (!alive) return;

                setScanProgress({ current: status.progress, total: status.total });

                if (status.status === 'completed') {
                    setNotification({ message: `Scan completed: ${status.total} files analyzed.`, type: 'success' });
                    setFolderResults(status.results);
                    if (status.results.length > 0) setAnalysis(status.results[0]);
                    setCurrentScanId(null);
                    setIsAnalyzingFolder(false);
                    // Refresh history
                    const history = await requestJson<ScanSummary[]>('/scan-history');
                    setScanHistory(history);
                } else if (status.status === 'failed') {
                    setNotification({ message: `Scan failed: ${status.error}`, type: 'error' });
                    setCurrentScanId(null);
                    setIsAnalyzingFolder(false);
                }
            } catch (err) {
                if (alive) {
                    setNotification({ message: `Monitoring failed: ${err instanceof Error ? err.message : 'Unknown error'}`, type: 'error' });
                    setCurrentScanId(null);
                    setIsAnalyzingFolder(false);
                }
            }
        };

        const interval = window.setInterval(poll, 1000);
        return () => {
            alive = false;
            window.clearInterval(interval);
        };
    }, [currentScanId]);

    const analyzeLive = async () => {
        setIsAnalyzing(true);
        setError(null);
        try {
            const payload = await requestJson<AnalysisResponse>(`/analyze?seconds=${seconds}`);
            setAnalysis(payload);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Live analysis failed');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const analyzeFolder = async () => {
        if (!folderPath) return;
        setIsAnalyzingFolder(true);
        setError(null);
        setScanProgress(null);
        setNotification({ message: 'Starting folder scan...', type: 'info' });
        try {
            const payload = await requestJson<{ scan_id: string; status: string }>(`/scan-folder?path=${encodeURIComponent(folderPath)}`, { method: 'POST' });
            setCurrentScanId(payload.scan_id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Folder scan initiation failed');
            setIsAnalyzingFolder(false);
            setNotification(null);
        }
    };

    const loadHistoricalScan = async (scanId: string) => {
        setIsAnalyzingFolder(true);
        setError(null);
        try {
            const status = await requestJson<ScanStatusResponse>(`/scan/${scanId}`);
            setFolderResults(status.results);
            setFolderPath(status.path);
            if (status.results.length > 0) setAnalysis(status.results[0]);
            setNotification({ message: `Loaded history: ${status.path}`, type: 'info' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load historical scan');
        } finally {
            setIsAnalyzingFolder(false);
        }
    };

    const setDevice = async (index: number) => {
        setError(null);
        try {
            await requestJson(`/device/${index}`, { method: 'POST' });
            setActiveDevice(index);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not switch audio device');
        }
    };

    const analyzeFile = async (file: File) => {
        const form = new FormData();
        form.append('file', file);
        setIsUploading(true);
        setError(null);
        try {
            const payload = await requestJson<AnalysisResponse>('/analyze-file', { method: 'POST', body: form });
            setAnalysis(payload);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sample analysis failed');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-7xl">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <div className="mb-3 flex items-center gap-2 text-cyan-300">
                        <Radar size={18} />
                        <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em]">Ear Service</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Audio Detection Tools</h1>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
                    <Activity size={18} className={levelPeak > 0.01 ? 'text-emerald-300' : 'text-slate-500'} />
                    <div className="min-w-36">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Input Peak</p>
                        <p className="font-mono text-sm text-slate-200">{levels ? asPercent(levelPeak) : 'offline'}</p>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-400/25 bg-red-500/10 p-4 text-sm text-red-200">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            ) : null}

            {notification ? (
                <div className={`mb-5 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm transition-all ${
                    notification.type === 'success' ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200' :
                    notification.type === 'error' ? 'border-red-500/25 bg-red-500/10 text-red-200' :
                    'border-cyan-500/25 bg-cyan-500/10 text-cyan-200'
                }`}>
                    <div className="flex items-center gap-3">
                        {notification.type === 'success' ? <BrainCircuit size={18} /> : <Activity size={18} />}
                        <span>{notification.message}</span>
                        {isAnalyzingFolder && scanProgress && (
                            <span className="font-mono text-xs opacity-60">({scanProgress.current}/{scanProgress.total})</span>
                        )}
                    </div>
                    <button onClick={() => setNotification(null)} className="text-[10px] uppercase font-bold opacity-50 hover:opacity-100">Dismiss</button>
                </div>
            ) : null}

            <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="space-y-5">
                    <section className="rounded-lg border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20">
                        <div className="mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal size={18} className="text-cyan-300" />
                                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-200">Capture</h2>
                            </div>
                            <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-[10px] text-slate-400">{seconds}s</span>
                        </div>

                        <div className="space-y-4">
                            <label className="block space-y-2">
                                <span className="text-xs font-semibold text-slate-400">Window</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="1"
                                    value={seconds}
                                    onChange={(event) => setSeconds(Number(event.target.value))}
                                    className="w-full accent-cyan-400"
                                />
                            </label>

                            <button
                                type="button"
                                onClick={analyzeLive}
                                disabled={isAnalyzing}
                                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isAnalyzing ? <Loader2 size={17} className="animate-spin" /> : <AudioLines size={17} />}
                                Analyze Live
                            </button>

                            <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-black/20 text-center transition hover:border-amber-300/60 hover:bg-amber-300/10">
                                {isUploading ? <Loader2 size={22} className="animate-spin text-amber-200" /> : <Upload size={22} className="text-amber-200" />}
                                <span className="text-sm font-semibold text-slate-200">Drop Sample</span>
                                <input
                                    type="file"
                                    accept="audio/*,.wav,.aif,.aiff,.mp3,.flac,.ogg"
                                    className="hidden"
                                    disabled={isUploading}
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (file) void analyzeFile(file);
                                        event.currentTarget.value = '';
                                    }}
                                />
                            </label>
                        </div>
                    </section>

                    <section className="rounded-lg border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BrainCircuit size={18} className="text-purple-300" />
                                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-200">Analysis</h2>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <span className="text-xs font-semibold text-slate-400">Model</span>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        className="rounded-md border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-medium text-purple-200"
                                    >
                                        Heuristic v1
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded-md border border-white/5 bg-white/5 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/10"
                                    >
                                        CLAP (soon)
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded-md border border-white/5 bg-white/5 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/10"
                                    >
                                        YAMNet (soon)
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded-md border border-white/5 bg-white/5 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/10"
                                    >
                                        Essentia (soon)
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded-md border border-white/5 bg-white/5 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/10"
                                    >
                                        LLM Curator (soon)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-lg border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FolderOpen size={18} className="text-emerald-300" />
                                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-200">Library</h2>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-400">Path</span>
                                    <button
                                        type="button"
                                        onClick={() => (document.getElementById('folder-picker') as HTMLInputElement)?.click()}
                                        className="flex items-center gap-1 rounded bg-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 transition hover:bg-white/10 hover:text-emerald-300"
                                    >
                                        <FolderOpen size={10} />
                                        Browse
                                    </button>
                                    <input
                                        id="folder-picker"
                                        type="file"
                                        className="hidden"
                                        webkitdirectory=""
                                        directory=""
                                        onChange={(e) => {
                                            const files = e.target.files;
                                            if (files && files.length > 0) {
                                                const firstFile = files[0];
                                                const folderName = firstFile.webkitRelativePath.split('/')[0];
                                                // Informative error message that helps user get the path
                                                setError(`Selected "${folderName}". Now, please PASTE the absolute path to this folder in the box below to scan it.`);
                                            }
                                        }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="PASTE full path here (e.g. /home/taenia/Samples)"
                                    value={folderPath}
                                    onChange={(e) => setFolderPath(e.target.value)}
                                    className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
                                />
                                <p className="text-[9px] leading-relaxed text-slate-500">
                                    Hint: Browsers hide full paths. Open your file manager, copy the path, and paste it here.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    if (!folderPath) {
                                        setError('Please enter a folder path first.');
                                        return;
                                    }
                                    void analyzeFolder();
                                }}
                                disabled={isAnalyzingFolder}
                                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isAnalyzingFolder ? <Loader2 size={17} className="animate-spin" /> : <Files size={17} />}
                                Scan Folder
                            </button>

                            {folderResults.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        Results ({folderResults.length})
                                    </p>
                                    <div className="max-h-60 space-y-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                                        {folderResults.map((res, idx) => (
                                            <button
                                                key={`${res.filename}-${idx}`}
                                                type="button"
                                                onClick={() => setAnalysis(res)}
                                                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition ${
                                                    analysis?.filename === res.filename
                                                        ? 'bg-emerald-400/20 text-emerald-200'
                                                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                                }`}
                                            >
                                                <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${analysis?.filename === res.filename ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                                                <span className="truncate">{res.filename}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {scanHistory.length > 0 && (
                        <section className="rounded-lg border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20">
                            <div className="mb-4 flex items-center gap-2 text-slate-400">
                                <Activity size={18} className="text-amber-400" />
                                <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Scan History</h2>
                            </div>
                            <div className="max-h-48 space-y-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                                {scanHistory.map((history) => (
                                    <button
                                        key={history.id}
                                        type="button"
                                        onClick={() => void loadHistoricalScan(history.id)}
                                        className="w-full rounded-md border border-white/5 bg-white/[0.02] p-2 text-left transition hover:border-white/10 hover:bg-white/[0.05]"
                                    >
                                        <p className="truncate text-[10px] font-bold text-slate-300">{history.path.split('/').pop() || history.path}</p>
                                        <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500">
                                            <span>{history.count} files</span>
                                            <span className={history.status === 'completed' ? 'text-emerald-400' : 'text-red-400'}>
                                                {history.status}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="rounded-lg border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20">
                        <div className="mb-4 flex items-center gap-2">
                            <Music2 size={18} className="text-amber-200" />
                            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-200">Devices</h2>
                        </div>
                        <div className="space-y-2">
                            {devices.length === 0 ? (
                                <p className="text-sm text-slate-500">No input devices found.</p>
                            ) : devices.map((device) => (
                                <button
                                    key={device.index}
                                    type="button"
                                    onClick={() => void setDevice(device.index)}
                                    className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-3 text-left transition ${
                                        activeDevice === device.index
                                            ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-100'
                                            : 'border-white/5 bg-white/[0.03] text-slate-300 hover:border-white/15 hover:bg-white/[0.06]'
                                    }`}
                                >
                                    <span className="min-w-0 truncate text-sm font-medium">{device.name}</span>
                                    <span className="shrink-0 font-mono text-[10px] text-slate-500">{device.channels}ch</span>
                                </button>
                            ))}
                        </div>
                    </section>
                </aside>

                <main className="space-y-5">
                    <section className="rounded-lg border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20">
                        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-start">
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <BrainCircuit size={18} className="text-violet-300" />
                                    <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-200">Semantic Read</h2>
                                </div>
                                <p className="max-w-3xl text-sm leading-relaxed text-slate-300">
                                    {semanticRead?.interpretation.summary ?? 'Run an analysis to get mood, vibe, weirdness, and identity-risk evidence.'}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(modelStatuses.length ? modelStatuses : [{ name: 'semantic_heuristics', status: 'waiting' }]).map((model) => (
                                    <span
                                        key={model.name}
                                        className={`rounded-full border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
                                            model.status === 'used'
                                                ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200'
                                                : 'border-white/10 bg-white/[0.03] text-slate-500'
                                        }`}
                                    >
                                        {model.name}: {model.status}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <div>
                                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Mood</h3>
                                <div className="grid gap-3">
                                    {moodCandidates.length ? moodCandidates.map((item) => <SemanticPill key={item.label} item={item} />) : (
                                        <p className="rounded-lg border border-white/5 bg-black/20 p-3 text-sm text-slate-500">No mood candidates yet.</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Vibe</h3>
                                <div className="grid gap-3">
                                    {vibeCandidates.length ? vibeCandidates.map((item) => <SemanticPill key={item.label} item={item} />) : (
                                        <p className="rounded-lg border border-white/5 bg-black/20 p-3 text-sm text-slate-500">No vibe candidates yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <SemanticGauge label="Weirdness" measure={semanticRead?.weirdness} tone="bg-violet-300" />
                            <SemanticGauge label="Identity Risk" measure={semanticRead?.genericness} tone="bg-amber-300" />
                            <SemanticGauge label="Coherence" measure={semanticRead?.coherence} tone="bg-cyan-300" />
                            <SemanticGauge label="Potential" measure={semanticRead?.potential} tone="bg-emerald-300" />
                        </div>

                        {semanticRead ? (
                            <div className="mt-5 grid gap-4 lg:grid-cols-2">
                                <div className="rounded-lg border border-white/5 bg-black/20 p-4">
                                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Reason to Keep</p>
                                    <p className="text-sm leading-relaxed text-slate-300">{semanticRead.interpretation.reason_to_keep}</p>
                                </div>
                                <div className="rounded-lg border border-white/5 bg-black/20 p-4">
                                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Suggested Mutation</p>
                                    <p className="text-sm leading-relaxed text-slate-300">{semanticRead.interpretation.suggested_mutation}</p>
                                </div>
                            </div>
                        ) : null}
                    </section>

                    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="rounded-lg border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20">
                            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                <div>
                                    <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                        {analysis?.filename ?? analysis?.source ?? 'No sample yet'}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
                                            {primary === 'kick' || primary === 'snare' ? <Drum size={28} /> : <FileAudio size={28} />}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-white">{formatLabel(primary)}</h2>
                                            <p className="text-sm text-slate-400">confidence {asPercent(confidence)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                                        <p className="font-mono text-lg text-white">{analysis ? Math.round(analysis.tempo) : 0}</p>
                                        <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">BPM</p>
                                    </div>
                                    <div className="rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                                        <p className="font-mono text-lg text-white">{analysis?.key ?? '-'}</p>
                                        <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Key</p>
                                    </div>
                                    <div className="rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                                        <p className="font-mono text-lg text-white">{analysis ? analysis.duration.toFixed(1) : '0.0'}</p>
                                        <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Sec</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-6 gap-3">
                                {bandLabels.map((band) => (
                                    <BandColumn key={band} label={band} value={analysis?.features[band] ?? 0} />
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20">
                            <div className="mb-5 flex items-center gap-2">
                                <BrainCircuit size={18} className="text-violet-300" />
                                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-200">Candidates</h2>
                            </div>
                            <div className="space-y-3">
                                {candidates.length === 0 ? (
                                    <p className="text-sm text-slate-500">Run an analysis to populate candidates.</p>
                                ) : candidates.map((candidate) => (
                                    <Meter
                                        key={candidate.label}
                                        label={formatLabel(candidate.label)}
                                        value={candidate.score}
                                        tone={candidate.label === primary ? 'bg-cyan-300' : 'bg-slate-500'}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="rounded-lg border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20">
                            <div className="mb-5 flex items-center gap-2">
                                <Zap size={18} className="text-amber-200" />
                                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-200">Transient Shape</h2>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Meter label="Peak" value={analysis?.peak ?? 0} tone="bg-emerald-300" />
                                <Meter label="RMS" value={(analysis?.rms ?? 0) * 3} tone="bg-lime-300" />
                                <Meter label="Onset Peak" value={(analysis?.instrument_detection.transients.peak_strength ?? 0) / 10} tone="bg-amber-300" />
                                <Meter label="Centroid" value={(analysis?.centroid ?? 0) / 12000} tone="bg-violet-300" />
                            </div>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20">
                            <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-200">Readout</h2>
                            <div className="space-y-3">
                                {[
                                    ...(analysis?.instrument_detection.notes ?? ['Waiting for audio.']),
                                    ...(semanticRead?.interpretation.caveats ?? []),
                                ].map((note) => (
                                    <p key={note} className="rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-sm text-slate-300">
                                        {note}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};
