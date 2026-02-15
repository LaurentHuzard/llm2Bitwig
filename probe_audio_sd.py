import sounddevice as sd
import numpy as np
import time

def main():
    print("Listing audio devices via sounddevice + PortAudio...")
    
    try:
        devices = sd.query_devices()
        print(devices)
        
        # Find likely monitor
        # Usually pulse or default is index 0 or 'default'
        default_in = sd.default.device[0]
        default_out = sd.default.device[1]
        
        print(f"\nDefault Input: {default_in}")
        print(f"Default Output: {default_out}")
        
        monitor_idx = None
        
        for i, d in enumerate(devices):
            # On Pulse, usually devices are virtual.
            # Look for one with input channels and 'monitor' in name?
            # Or just use the 'pulse' default input if it maps to monitor?
            # Actually, to record "what you hear", you usually need to select the monitor source explicitly.
            if "monitor" in d['name'].lower() and d['max_input_channels'] > 0:
                print(f"Candidate Monitor: {i} - {d['name']}")
                monitor_idx = i
                # Keep looking but prioritize this
            
        print("\n--- Audio Probe (3s) ---")
        duration = 3  # seconds
        fs = 44100
        
        # If no explicit monitor found, try default input? 
        # But default input is Mic usually.
        # We need the monitor of the output.
        # If running via Pulse, `pavucontrol` can change what an app records.
        # But programmatically we want to select it.
        # If sounddevice lists Pulse monitors, great.
        
        target_device = monitor_idx if monitor_idx is not None else default_in
        
        if target_device is None:
             # Try to just use default
             print("No specific device found, using default input.")
        else:
             print(f"Recording from device index: {target_device}")

        # Record
        try:
             myrecording = sd.rec(int(duration * fs), samplerate=fs, channels=1, device=target_device)
             print("Recording...")
             sd.wait()
             print("Finished recording.")
             
             peak = np.max(np.abs(myrecording))
             rms = np.sqrt(np.mean(myrecording**2))
             print(f"Peak: {peak:.4f}")
             print(f"RMS: {rms:.4f}")
             
             if peak > 0.0001:
                 print("Audio Detected!")
             else:
                 print("Silence.")
                 
        except Exception as e:
             print(f"Error recording: {e}")
             
    except Exception as e:
        print(f"Error querying devices: {e}")

if __name__ == "__main__":
    main()
