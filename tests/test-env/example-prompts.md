# Example Prompts & Workflows

Use these examples to test different capabilities of the Bitwig MCP server.

## Transport Control

**Scenario:** Basic playback control.

1. "Start playback."
   - Tool: `transport_play`
2. "Set tempo to 128 BPM."
   - Tool: `transport_set_tempo`, Args: `{"bpm": 128}`
3. "Stop playback."
   - Tool: `transport_stop`
4. "Restart from the beginning."
   - Tool: `transport_restart`

## Track Management

**Scenario:** Mixing a session.

1. "Check the status of the first 8 tracks."
   - Tool: `track_bank_get_status`
2. "Set the volume of track 1 (index 0) to 80%."
   - Tool: `track_bank_set_volume`, Args: `{"index": 0, "value": 0.8}`
3. "Solo track 2 (index 1)."
   - Tool: `track_bank_set_solo`, Args: `{"index": 1, "state": true}`
4. "Unmute track 3 (index 2)."
   - Tool: `track_bank_set_mute`, Args: `{"index": 2, "state": false}`

## Clip Launching

**Scenario:** Live performance.

1. "Launch the clip in track 1, slot 1."
   - Tool: `clip_launch`, Args: `{"trackIndex": 0, "slotIndex": 0}`
2. "Launch scene 2."
   - Tool: `scene_launch`, Args: `{"sceneIndex": 1}`
3. "Stop all clips on track 1."
   - Tool: `clip_stop`, Args: `{"trackIndex": 0}`

## Creative Workflow

**Scenario:** Starting a new idea.

1. "Create a new instrument track."
   - Tool: `application_create_instrument_track`
2. "Create a 4-bar clip in the first slot of the new track (ensure you find the index first)."
   - Tool: `clip_create`, Args: `{"trackIndex": <new_index>, "slotIndex": 0, "lengthBeats": 16}`
3. "Arm the selected track for recording."
   - Tool: `track_selected_set_arm`, Args: `{"state": true}`
