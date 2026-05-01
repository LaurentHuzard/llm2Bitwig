#!/usr/bin/env bash
set -euo pipefail

# Capture the current Wayland desktop for the Computer Use review harness.
# On Kubuntu/Plasma, Spectacle is the most likely tool to exist by default.

tmp_file="$(mktemp --suffix=.png)"
cleanup() {
  rm -f "$tmp_file"
}
trap cleanup EXIT

if command -v spectacle >/dev/null 2>&1; then
  if spectacle -b -n -o "$tmp_file" >/dev/null 2>&1 && [ -s "$tmp_file" ]; then
    cat "$tmp_file"
    exit 0
  fi
fi

if command -v grim >/dev/null 2>&1; then
  if grim "$tmp_file" >/dev/null 2>&1 && [ -s "$tmp_file" ]; then
    cat "$tmp_file"
    exit 0
  fi
fi

if command -v gnome-screenshot >/dev/null 2>&1; then
  if gnome-screenshot -f "$tmp_file" >/dev/null 2>&1 && [ -s "$tmp_file" ]; then
    cat "$tmp_file"
    exit 0
  fi
fi

echo "No Wayland screenshot command succeeded. Install/configure spectacle or grim in the active desktop session." >&2
exit 1
