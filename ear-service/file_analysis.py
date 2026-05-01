import os
import tempfile
from typing import Callable

import librosa
import numpy as np
from fastapi import UploadFile
from fastapi.responses import JSONResponse

from analysis_core import analyze_recording


AnalyzeRecording = Callable[[np.ndarray, int, str], dict]
LoadAudio = Callable[..., tuple[np.ndarray, int]]


def analyze_local_file(
    file_path: str,
    sample_rate: int = 44100,
    analyze_recording_fn: AnalyzeRecording = analyze_recording,
    load_audio_fn: LoadAudio = librosa.load,
):
    """Analyze a local audio file on disk."""
    try:
        y, _ = load_audio_fn(file_path, sr=sample_rate, mono=False)
        if y.ndim == 1:
            recording = y.reshape(-1, 1)
        else:
            recording = y.T

        result = analyze_recording_fn(recording, sample_rate, "local_file")
        result["filename"] = os.path.basename(file_path)
        result["path"] = file_path
        return result
    except Exception as e:
        return {"filename": os.path.basename(file_path), "path": file_path, "error": str(e)}


async def analyze_uploaded_file(
    file: UploadFile,
    sample_rate: int = 44100,
    analyze_recording_fn: AnalyzeRecording = analyze_recording,
    load_audio_fn: LoadAudio = librosa.load,
):
    """Analyze one uploaded sample without importing the live capture service."""
    suffix = ""
    if file.filename and "." in file.filename:
        suffix = "." + file.filename.rsplit(".", 1)[-1]

    raw = await file.read()
    if not raw:
        return JSONResponse({"error": "Empty audio file"}, status_code=400)

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(raw)
            tmp_path = tmp.name

        y, _ = load_audio_fn(tmp_path, sr=sample_rate, mono=False)
        if y.ndim == 1:
            recording = y.reshape(-1, 1)
        else:
            recording = y.T

        result = analyze_recording_fn(recording, sample_rate, "uploaded_sample")
        result["filename"] = file.filename
        return result
    except Exception as e:
        return JSONResponse({"error": f"Could not analyze audio file: {e}"}, status_code=400)
    finally:
        if tmp_path:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
