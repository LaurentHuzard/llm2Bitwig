import sounddevice as sd
import numpy as np
import threading
import time
import queue
import base64
import wave
import io
import os
import uuid
from fastapi import FastAPI, File, HTTPException, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from collections import deque
from analysis_core import analyze_recording
from file_analysis import analyze_uploaded_file, analyze_local_file

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
SAMPLE_RATE = 44100
BLOCK_SIZE = 4096
CHANNELS = 2  # Stereo
DEFAULT_BUFFER_SECONDS = 10

# State
current_levels = {"peak_left": 0.0, "peak_right": 0.0, "rms_left": 0.0, "rms_right": 0.0}
is_running = True
audio_buffer = deque(maxlen=int(DEFAULT_BUFFER_SECONDS * SAMPLE_RATE / BLOCK_SIZE))
buffer_lock = threading.Lock()
active_device_index = None
audio_stream = None

# Scan State
scans = {} # scan_id -> {status, progress, total, results, path, error, timestamp}
scan_history = [] # list of scan summaries

def run_folder_scan(scan_id: str, path: str):
    """Background task to scan a folder."""
    scan = scans[scan_id]
    extensions = {".wav", ".aif", ".aiff", ".mp3", ".flac", ".ogg"}
    
    try:
        files = [f for f in os.listdir(path) if any(f.lower().endswith(ext) for ext in extensions)]
        scan["total"] = len(files)
        
        if not files:
            scan["status"] = "completed"
            scan_history.insert(0, {
                "id": scan_id,
                "path": path,
                "count": 0,
                "timestamp": scan["timestamp"],
                "status": "completed"
            })
            return

        for idx, filename in enumerate(files):
            file_path = os.path.join(path, filename)
            res = analyze_local_file(file_path, SAMPLE_RATE)
            scan["results"].append(res)
            scan["progress"] = idx + 1
            
        scan["status"] = "completed"
        # Add to history
        scan_history.insert(0, {
            "id": scan_id,
            "path": path,
            "count": len(scan["results"]),
            "timestamp": scan["timestamp"],
            "status": "completed"
        })
    except Exception as e:
        scan["status"] = "failed"
        scan["error"] = str(e)
        scan_history.insert(0, {
            "id": scan_id,
            "path": path,
            "count": len(scan["results"]),
            "timestamp": scan["timestamp"],
            "status": "failed",
            "error": str(e)
        })

class AudioCapture(threading.Thread):
    def __init__(self, device_index=None):
        super().__init__()
        self.daemon = True
        self.running = True
        self.device_index = device_index

    def run(self):
        global audio_stream
        print(f"Starting Audio Stream on device {self.device_index}...")
        
        def callback(indata, frames, time_info, status):
            if status:
                print(f"Stream status: {status}")
            
            # Copy data
            data = indata.copy()
            
            # Metering (Stereo)
            if data.shape[1] >= 2:
                peak_l = np.max(np.abs(data[:, 0]))
                peak_r = np.max(np.abs(data[:, 1]))
                rms_l = np.sqrt(np.mean(data[:, 0]**2))
                rms_r = np.sqrt(np.mean(data[:, 1]**2))
            else:
                peak_l = peak_r = np.max(np.abs(data))
                rms_l = rms_r = np.sqrt(np.mean(data**2))

            current_levels["peak_left"] = float(peak_l)
            current_levels["peak_right"] = float(peak_r)
            current_levels["rms_left"] = float(rms_l)
            current_levels["rms_right"] = float(rms_r)
            
            with buffer_lock:
                audio_buffer.append(data)

        try:
            with sd.InputStream(samplerate=SAMPLE_RATE, blocksize=BLOCK_SIZE, 
                                channels=CHANNELS, callback=callback, device=self.device_index) as stream:
                audio_stream = stream
                while self.running:
                    time.sleep(0.1)
        except Exception as e:
            print(f"Audio Stream Error: {e}")
            self.running = False
        finally:
            audio_stream = None

    def stop(self):
        self.running = False

capture_thread = None

def start_capture_thread(device_index=None):
    global capture_thread
    if capture_thread and capture_thread.is_alive():
        capture_thread.stop()
        capture_thread.join(timeout=2)
    
    capture_thread = AudioCapture(device_index)
    capture_thread.start()

@app.on_event("startup")
def startup_event():
    print("Service Started")
    start_capture_thread()

@app.on_event("shutdown")
def shutdown_event():
    if capture_thread:
        capture_thread.stop()
        capture_thread.join()

@app.get("/")
def read_root():
    return {"status": "running", "service": "bitwig-ear"}

@app.get("/levels")
def get_levels():
    return current_levels

@app.get("/devices")
def list_devices():
    devices = sd.query_devices()
    input_devices = []
    for i, dev in enumerate(devices):
        if dev['max_input_channels'] > 0:
            input_devices.append({
                "index": i,
                "name": dev['name'],
                "channels": dev['max_input_channels'],
                "samplerate": dev['default_samplerate']
            })
    return {"devices": input_devices, "active_index": active_device_index}

@app.post("/device/{index}")
def set_device(index: int):
    global active_device_index
    try:
        devs = sd.query_devices()
        if index < 0 or index >= len(devs):
            raise HTTPException(status_code=400, detail="Invalid device index")
        
        if devs[index]['max_input_channels'] < 1:
            raise HTTPException(status_code=400, detail="Device has no input channels")

        active_device_index = index
        start_capture_thread(index)
        return {"status": "ok", "message": f"Switched to device {index}: {devs[index]['name']}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/listen")
def listen(seconds: int = 5):
    if seconds > DEFAULT_BUFFER_SECONDS:
        seconds = DEFAULT_BUFFER_SECONDS
    
    chunks_needed = int(seconds * SAMPLE_RATE / BLOCK_SIZE)
    
    with buffer_lock:
        if len(audio_buffer) == 0:
             return JSONResponse({"error": "No audio data buffered"}, status_code=500)
             
        if len(audio_buffer) < chunks_needed:
             data_chunks = list(audio_buffer)
        else:
             data_chunks = list(audio_buffer)[-chunks_needed:]
             
    if not data_chunks:
        return JSONResponse({"error": "No audio data"}, status_code=500)
    
    recording = np.concatenate(data_chunks, axis=0)
    recording_int16 = (recording * 32767).astype(np.int16)
    
    wav_io = io.BytesIO()
    with wave.open(wav_io, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(recording_int16.tobytes())
        
    wav_bytes = wav_io.getvalue()
    encoded = base64.b64encode(wav_bytes).decode('utf-8')
    
    return {
        "format": "wav",
        "encoding": "base64",
        "data": encoded,
        "seconds": len(recording) / SAMPLE_RATE,
        "channels": CHANNELS
    }

def get_buffer_recording(seconds: float) -> np.ndarray | None:
    bounded_seconds = min(max(seconds, 0.1), float(DEFAULT_BUFFER_SECONDS))
    chunks_needed = max(1, int(bounded_seconds * SAMPLE_RATE / BLOCK_SIZE))

    with buffer_lock:
        if len(audio_buffer) == 0:
            return None
        if len(audio_buffer) < chunks_needed:
            data_chunks = list(audio_buffer)
        else:
            data_chunks = list(audio_buffer)[-chunks_needed:]

    if not data_chunks:
        return None

    return np.concatenate(data_chunks, axis=0)

@app.get("/analyze")
def analyze_audio(seconds: float = 1.0):
    recording = get_buffer_recording(seconds)
    if recording is None:
        return JSONResponse({"error": "No audio data"}, status_code=500)
    return analyze_recording(recording, SAMPLE_RATE, "live_buffer")

@app.post("/analyze-file")
async def analyze_file(file: UploadFile = File(...)):
    return await analyze_uploaded_file(file, SAMPLE_RATE)

@app.post("/scan-folder")
async def start_scan(path: str, background_tasks: BackgroundTasks):
    """Start an asynchronous folder scan."""
    if not os.path.exists(path) or not os.path.isdir(path):
        raise HTTPException(status_code=400, detail="Invalid directory path")
    
    scan_id = str(uuid.uuid4())
    scans[scan_id] = {
        "id": scan_id,
        "status": "scanning",
        "progress": 0,
        "total": 0,
        "results": [],
        "path": path,
        "timestamp": time.time(),
        "error": None
    }
    
    background_tasks.add_task(run_folder_scan, scan_id, path)
    return {"scan_id": scan_id, "status": "started"}

@app.get("/scan/{scan_id}")
def get_scan_status(scan_id: str):
    """Get the current status and results of a specific scan."""
    if scan_id not in scans:
        raise HTTPException(status_code=404, detail="Scan not found")
    return scans[scan_id]

@app.get("/scan-history")
def get_scan_history():
    """Get the history of all scans."""
    return scan_history

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
