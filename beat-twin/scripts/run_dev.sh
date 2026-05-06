#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

echo "Starting event bus..."
uv run --no-sync python -m services.event_bus.server &
sleep 1

echo "Starting feature core..."
uv run --no-sync python -m services.feature_core.feature_core &
sleep 1

echo "Starting audio tap..."
uv run --no-sync python -m services.audio_tap.audio_tap
