import sounddevice as sd
import numpy as np
import threading
import time
import queue
import base64
import wave
import io
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from collections import deque

app = FastAPI()

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
            # data is (frames, channels)
            if data.shape[1] >= 2:
                peak_l = np.max(np.abs(data[:, 0]))
                peak_r = np.max(np.abs(data[:, 1]))
                rms_l = np.sqrt(np.mean(data[:, 0]**2))
                rms_r = np.sqrt(np.mean(data[:, 1]**2))
            else:
                # Mono fallback
                peak_l = peak_r = np.max(np.abs(data))
                rms_l = rms_r = np.sqrt(np.mean(data**2))

            current_levels["peak_left"] = float(peak_l)
            current_levels["peak_right"] = float(peak_r)
            current_levels["rms_left"] = float(rms_l)
            current_levels["rms_right"] = float(rms_r)
            
            # Buffering
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

# Global thread reference
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
    # Start with default device
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
    """List available input devices."""
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
    """Set the active input device."""
    global active_device_index
    try:
        # Verify index exists
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
    """
    Returns the *last* N seconds of audio from the buffer.
    """
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
    
    # Concatenate
    recording = np.concatenate(data_chunks, axis=0)
    
    # Convert to WAV
    # scale to int16
    recording_int16 = (recording * 32767).astype(np.int16)
    
    wav_io = io.BytesIO()
    with wave.open(wav_io, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(2) # 16 bit
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

@app.get("/analyze")
def analyze_audio(seconds: float = 1.0):
    """
    Analyze the last N seconds of audio for spectral features.
    Returns:
        - spectral_features: {
            bass: 0.0-1.0,
            low_mid: 0.0-1.0,
            mid: 0.0-1.0,
            high_mid: 0.0-1.0,
            high: 0.0-1.0,
            centroid: Hz,
            flatness: 0.0-1.0
        }
    """
    if seconds > 5.0:
        seconds = 5.0
    
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
    
    # Concatenate
    recording = np.concatenate(data_chunks, axis=0)
    
    # -- Analysis --
    # Mix to mono for simple analysis
    if recording.shape[1] >= 2:
        mono = np.mean(recording, axis=1)
    else:
        mono = recording.flatten()
        
    # Windowing
    window = np.hanning(len(mono))
    mono_windowed = mono * window
    
    # FFT
    fft_spectrum = np.fft.rfft(mono_windowed)
    freqs = np.fft.rfftfreq(len(mono_windowed), 1/SAMPLE_RATE)
    magnitude = np.abs(fft_spectrum)
    
    # Normalize magnitude
    # magnitude = magnitude / (len(mono) / 2)
    
    # Energy in bands
    bands = {
        "sub": (20, 60),
        "bass": (60, 250),
        "low_mid": (250, 500),
        "mid": (500, 2000),
        "high_mid": (2000, 4000),
        "high": (4000, 20000)
    }
    
    energy = {}
    total_energy = np.sum(magnitude) + 1e-9
    
    for name, (low, high) in bands.items():
        idx = np.where((freqs >= low) & (freqs < high))[0]
        if len(idx) > 0:
            band_energy = np.sum(magnitude[idx])
            # Normalize by band width to get density? Or just ratio of total?
            # Let's return relative energy (ratio of total)
            energy[name] = float(band_energy / total_energy)
        else:
            energy[name] = 0.0

    # Spectral Centroid
    # sum(f * mag) / sum(mag)
    centroid = np.sum(freqs * magnitude) / total_energy
    
    # RMS
    rms = np.sqrt(np.mean(mono**2))
    peak = np.max(np.abs(mono))
    
    return {
        "features": energy,
        "centroid": float(centroid),
        "rms": float(rms),
        "peak": float(peak),
        "duration": float(len(mono) / SAMPLE_RATE)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
