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

import librosa

@app.get("/analyze")
def analyze_audio(seconds: float = 1.0):
    """
    Analyze the last N seconds of audio.
    Returns:
        - spectral_features: energy in bands
        - centroid: brightness
        - rms/peak: loudness
        - tempo: estimated BPM (float)
        - key: estimated key (string)
    """
    if seconds > 10.0:
        seconds = 10.0
    
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
    # Mix to mono
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
            energy[name] = float(band_energy / total_energy)
        else:
            energy[name] = 0.0

    # Spectral Centroid
    centroid = np.sum(freqs * magnitude) / total_energy
    
    # RMS/Peak
    rms = np.sqrt(np.mean(mono**2))
    peak = np.max(np.abs(mono))
    
    # -- Librosa Features --
    # 1. Tempo
    tempo = 0.0
    try:
        # beat_track handles onsets. 
        # Standardize sample rate if needed, but librosa defaults to 22050.
        # We invoke with our rate.
        # Note: Short buffers (<3s) make tempo detection unreliable.
        if len(mono) > SAMPLE_RATE * 2: # Min 2 seconds
            onset_env = librosa.onset.onset_strength(y=mono, sr=SAMPLE_RATE)
            tempo_arr, _ = librosa.beat.beat_track(onset_envelope=onset_env, sr=SAMPLE_RATE)
            if np.ndim(tempo_arr) > 0:
                tempo = float(tempo_arr[0])
            else:
                tempo = float(tempo_arr)
    except Exception as e:
        print(f"Tempo detection error: {e}")
        
    # 2. Key Detection
    key = "Unknown"
    try:
        # Chroma CQT usually better for pitch classes
        chroma = librosa.feature.chroma_cqt(y=mono, sr=SAMPLE_RATE)
        # Sum chroma over time to get global chroma vector
        chroma_vals = np.sum(chroma, axis=1)
        
        # Simple template matching for Major/Minor keys
        # Pitch classes: C, C#, D, D#, E, F, F#, G, G#, A, A#, B
        pitch_classes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        
        # Templates (Krumhansl-Schmuckler) - simplified
        major_profile = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
        minor_profile = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
        
        # Normalize chroma
        chroma_vals = chroma_vals / (np.max(chroma_vals) + 1e-9)
        major_profile = major_profile / np.max(major_profile)
        minor_profile = minor_profile / np.max(minor_profile)
        
        best_corr = -1.0
        
        for i in range(12):
            # Rotate profile to check each key
            # Major
            p_major = np.roll(major_profile, i)
            corr = np.corrcoef(chroma_vals, p_major)[0, 1]
            if corr > best_corr:
                best_corr = corr
                key = f"{pitch_classes[i]} Major"
                
            # Minor
            p_minor = np.roll(minor_profile, i)
            corr = np.corrcoef(chroma_vals, p_minor)[0, 1]
            if corr > best_corr:
                best_corr = corr
                key = f"{pitch_classes[i]} Minor"
                
    except Exception as e:
        print(f"Key detection error: {e}")

    return {
        "features": energy,
        "centroid": float(centroid),
        "rms": float(rms),
        "peak": float(peak),
        "tempo": tempo,
        "key": key,
        "duration": float(len(mono) / SAMPLE_RATE)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
