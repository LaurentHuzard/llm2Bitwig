import pulsectl
import time
import struct
import math
import sys

def main():
    print("Attempting to connect to PulseAudio...")
    try:
        pulse = pulsectl.Pulse('bitwig-ear-probe')
    except Exception as e:
        print(f"Error connecting to PulseAudio: {e}")
        return

    print(f"Connected to: {pulse.server_info().server_name}")
    
    print("\n--- Sources ---")
    sources = pulse.source_list()
    monitor_source = None
    
    # Try to find the default sink's monitor
    server_info = pulse.server_info()
    default_sink_name = server_info.default_sink_name
    print(f"Default Sink: {default_sink_name}")
    
    for s in sources:
        print(f" - {s.name} (monitor_of_sink={s.monitor_of_sink})")
        if s.name == f"{default_sink_name}.monitor":
            monitor_source = s
        elif s.monitor_of_sink == default_sink_name: # Some implementations use IDs or names
             monitor_source = s
        # If we can't find exact match, look for any monitor of the default sink if names differ
    
    if not monitor_source:
        # Fallback: look for any monitor source
        for s in sources:
            if "monitor" in s.name or s.monitor_of_sink is not None:
                monitor_source = s
                break
    
    if not monitor_source:
        print("Could not find a monitor source to record from.")
        return

    print(f"\nTargeting Monitor Source: {monitor_source.name}")
    
    print("\n--- Audio Probe (Recording 3 seconds) ---")
    print("Please play audio in Bitwig now...")
    
    # Simple peak meter
    peak = 0.0
    
    try:
        with pulse.recorder(monitor_source) as recorder:
            start_time = time.time()
            count = 0
            while time.time() - start_time < 3.0:
                 # Read data (returns bytes)
                 data = recorder.read()
                 if not data:
                     continue
                 
                 # Convert to samples (assume 16-bit usually, but pulsectl usually handles format?)
                 # pulsectl recorder defaults to S16LE, 2ch, 44100
                 # We can just check if bytes are non-zero to detect "sound"
                 
                 # Calculate simple RMS
                 # S16LE = 2 bytes per sample. 
                 # We can use struct to unpack a few samples for a quick check
                 # or just check max byte value.
                 
                 # Quick hack for "is there sound?"
                 # If all bytes are 0, silence.
                 if any(b != 0 for b in data):
                     print("!", end='', flush=True)
                 else:
                     print(".", end='', flush=True)
                 
                 time.sleep(0.1)
    except Exception as e:
        print(f"Error recording: {e}")

    print("\n\nProbe finished. If you saw '!', we detected audio signal.")

if __name__ == "__main__":
    main()
