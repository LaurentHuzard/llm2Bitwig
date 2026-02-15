#!/usr/bin/env bash
source venv/bin/activate
export PYTHONPATH=$(pwd)

echo "Starting event bus..."
python services/event_bus/server.py &
sleep 1

echo "Starting feature core..."
python services/feature_core/feature_core.py &
sleep 1

echo "Starting audio tap..."
python services/audio_tap/audio_tap.py
