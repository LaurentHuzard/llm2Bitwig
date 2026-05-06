# Beat Twin Ear Service

The ear service is the local FastAPI backend for live audio metering, short-buffer analysis, uploaded-file analysis, and folder scans. The Java MCP server calls it for `ear_*` tools at `http://127.0.0.1:8001`.

## Quick Start

From the repository root:

```bash
cd ear-service
uv sync
uv run --no-sync python main.py
```

The service starts on `0.0.0.0:8001`, which is reachable locally as `http://127.0.0.1:8001`.

Alternative reload workflow:

```bash
cd ear-service
uv run --no-sync uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

## Health Checks

```bash
curl http://127.0.0.1:8001/
curl http://127.0.0.1:8001/devices
curl "http://127.0.0.1:8001/analyze?seconds=1"
```

If no input device is available, the service may still answer HTTP requests, but live-buffer endpoints such as `/levels`, `/listen`, and `/analyze` will not have useful audio until a working input is selected.

## Main Endpoints

- `GET /` - service health and identity.
- `GET /levels` - current peak/RMS input levels.
- `GET /devices` - available input devices and the active device index.
- `POST /device/{index}` - switch the live capture input device.
- `GET /listen?seconds=5` - return the recent live buffer as base64 WAV.
- `GET /analyze?seconds=1` - analyse the recent live buffer.
- `POST /analyze-file` - analyse an uploaded audio file.
- `POST /scan-folder?path=/absolute/audio/folder` - start an asynchronous folder scan.
- `GET /scan/{scan_id}` - inspect scan progress and results.
- `GET /scan-history` - list completed or failed scans.

## Notes

- The live capture starts automatically on FastAPI startup through `sounddevice`.
- Uploaded-file analysis is routed through `file_analysis.py`.
- Deterministic semantic analysis lives in `analysis_core.py`.
- The Java MCP server currently assumes the default base URL `http://127.0.0.1:8001`.
- `requirements.txt` remains for compatibility, but `uv` is now the preferred install path.
