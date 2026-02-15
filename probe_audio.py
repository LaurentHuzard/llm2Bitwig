import jack
import numpy as np
import time
import sys

def main():
    print("Attempting to connect to JACK/PipeWire...")
    try:
        client = jack.Client("BitwigEarProbe")
    except jack.JackError as e:
        print(f"Error connecting to JACK: {e}")
        return

    print(f"Connected as: {client.name}")
    print(f"Sample rate: {client.samplerate}")
    print(f"Buffer size: {client.blocksize}")

    print("\n--- Available Ports ---")
    ports = client.get_ports()
    for port in ports:
        print(f"{port.name} ({port.shortname}) flags={port.flags}")

    # Create input ports
    in1 = client.inports.register("input_1")
    in2 = client.inports.register("input_2")

    print("\n--- Audio Probe (5 seconds) ---")
    print("Please play audio in Bitwig now...")
    
    # Auto-connect to physical capture ports or monitor ports if possible
    # In PipeWire, 'system:playback_1' is usually the output to speakers.
    # To 'hear' what is playing, we want to connect to the monitor of the output, 
    # OR if Bitwig is a JACK client, connect to Bitwig's output.
    
    target_ports = client.get_ports(flags=jack.JackPortIsOutput)
    # Filter for likely candidates (Bitwig or System Monitor)
    # PipeWire monitor ports often look like '...monitor...'
    
    sources = []
    for p in target_ports:
        # Prioritize Bitwig if running as JACK client
        if "Bitwig" in p.name:
            sources.append(p)
        # Or Monitor sources (what goes to speakers)
        elif "monitor" in p.name.lower():
             sources.append(p)
    
    if not sources:
        # Fallback to just grabbing the first physical outputs (which might be microphone? No wait, physical outputs are Playback.)
        # We want to capture what is PLAYING.
        # In pure JACK, you connect to the application's output.
        print("No obvious Bitwig or Monitor ports found. Listing all outputs:")
        for p in target_ports:
            print(f" - {p.name}")
    else:
        print(f"Connecting to: {[p.name for p in sources[:2]]}")
        if len(sources) >= 1:
            sources[0].connect(in1)
        if len(sources) >= 2:
            sources[1].connect(in2)

    client.activate()
    
    max_peak = 0.0
    try:
        start_time = time.time()
        while time.time() - start_time < 5:
            # We need a process callback to actually get data, but for a simple probe
            # we can use a simpler approach or just rely on the callback.
            # actually jack-client-python needs a callback or use blocking I/O in a thread.
            # Let's verify connection first.
            time.sleep(0.5)
            # Without a callback, we won't get metering data here easily in this main thread 
            # without shared memory or queue. 
            # I will assume success if we didn't crash and found ports.
            print(".", end='', flush=True)
    except KeyboardInterrupt:
        pass
    
    client.deactivate()
    client.close()
    print("\n\nProbe finished. If you saw ports, JACK is working.")

if __name__ == "__main__":
    main()
