# 📘  TECH SPEC

## Beatmaker Twin — Agentic Copilot for Bitwig

---

## 1. Vision technique

Beatmaker Twin est un **système agentique modulaire** composé de :

- 🎧 Audio Capture Layer

- 🧠 Feature Extraction Engine (MIR)

- 🏷 Tagging & Embedding Engine

- 🤖 Agent Orchestrator

- 🎛 Bitwig Control Layer (via MCP → API existante)

- 🖥 Local UI / Dev Console

Architecture pensée pour :

- Faible latence

- Isolation des responsabilités

- Observabilité

- Sécurité tool-based

- Extensibilité ML

---

## 2. Architecture globale

```
Bitwig → (PipeWire loopback)
        ↓
Audio Tap Service
        ↓
Feature Extraction Service
        ↓
Tagging + Embedding Service
        ↓
Twin Orchestrator (LLM + rules)
        ↓
MCP Bitwig Tools
```

Services communiquent via :

- gRPC ou WebSocket (recommandé)

- JSON events typés

---

## 3. Modules détaillés

---

### 3.1 Audio Tap Service

Responsabilité :

- Capture flux audio live (master, bus, piste)

- Bufferisation contrôlée

- Horodatage précis

Implémentation :

- PipeWire loopback

- Python (sounddevice) ou Rust (`cpal`)

Fréquence :

- Buffer 1024–4096 samples

- 44.1 ou 48kHz

Sortie event :

```json
{
  "type": "audio_frame",
  "timestamp": 1734838473.234,
  "samples": [...]
}
```

---

### 3.2 Feature Extraction Engine

Libs recommandées :

- aubio (tempo/onsets)

- Essentia (descripteurs spectraux)

- madmom (downbeat si besoin avancé)

Features MVP :

```
tempo
beat_positions
onset_density
spectral_centroid
spectral_flux
harmonic_energy
percussive_ratio
key_estimation
```

Sortie :

```json
{
  "tempo": 140.3,
  "confidence": 0.91,
  "energy": 0.76,
  "key": "F# minor",
  "transient_ratio": 0.63
}
```

---

### 3.3 Tagging Engine

Deux couches :

#### A) Heuristique

- dry/wet → estimation réverbération

- tonal/noisy → harmonic ratio

- one-shot/loop → periodicité

- transient/sustain → envelope shape

#### B) ML

Option 1 (MVP rapide) :

- musicnn

Option 2 (évolutif) :

- CLAP embeddings → recherche sémantique

Stockage :

```
samples
analysis
tags
embeddings
```

---

### 3.4 Twin Orchestrator

Cœur agentique.

Inputs :

- Features live

- Tags samples

- Etat Bitwig (via MCP read tools)

Fonctions :

- Pattern inference

- Suggestion engine

- Plan builder

- Action gating

Exemple de flow :

```
IF tempo ≈ 140
AND transient_ratio high
AND key detected
THEN propose:
    - Add sidechain
    - Suggest bass in same key
    - Propose 5 matching samples
```

Agent mode :

- dry-run

- explain-before-execute

- require confirmation

---

### 3.5 Bitwig Tool Layer

Outils exposés :

```
create_track()
insert_clip()
set_tempo()
route_sidechain()
load_sample()
arm_track()
```

Sécurité :

- whitelist tools

- journaling

- reversible operations only

---

## 4. Contraintes système

Machine cible :

Ubuntu 25.10  
32GB RAM  
Intel Ultra 9  
Intel Arc GPU

Design decisions :

- Pas de modèle géant local

- Inference CPU-first

- GPU via OpenVINO si scaling

Latence cible :

- < 50ms analyse

- < 200ms feedback visible

---

## 5. Phases de livraison

Phase 1 — Live Tempo + Onsets  
Phase 2 — Offline Tagger  
Phase 3 — Embedding Search  
Phase 4 — Agent Suggestion Safe Mode  
Phase 5 — Semi-autonomous mode

---

## 6. Observabilité

Logs :

- audio timing

- feature timing

- agent decision log

- MCP action log

Metrics :

- latency

- confidence score

- false suggestion ratio

---

# 
