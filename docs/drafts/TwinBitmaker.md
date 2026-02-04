# Twin Beatmaker

## Pré-conception — *Donner une oreille de zikos à un copilot*

> *Un beatmaker écoute avant de produire.
> Un bon copilot doit faire pareil.*

---

## 1. Intention (le “pourquoi”)

Twin Beatmaker est un **copilot musical agentique**, connecté à un DAW (Bitwig dans ton cas), capable de :

* écouter ce qui sort réellement des enceintes,
* comprendre **musicalement** (pas juste techniquement),
* réagir comme un **musicien**, pas comme un oscilloscope.

L’“oreille” est le **cœur cognitif** du système.
Sans elle, le LLM est aveugle au groove.

---

## 2. Principe fondamental : séparer l’oreille du cerveau

Règle d’or :

> **Le LLM ne doit jamais recevoir du son brut.**

On introduit une couche dédiée :
🦻 **The Ear Stack** — un cortex auditif artificiel.

```
[ System Audio ]
       ↓
[ Audio Capture ]
       ↓
[ Musical Ear ]
       ↓
[ Symbolic Musical State ]
       ↓
[ LLM Copilot ]
       ↓
[ Actions / Suggestions / Controls ]
```

---

## 3. L’oreille du zikos : ce qu’elle doit “entendre”

Un musicien n’écoute pas tout. Il filtre.

### 3.1 Ce que l’oreille DOIT capter

* 🥁 **Rythme**

  * BPM réel (pas théorique)
  * swing
  * stabilité / variation
* 🎵 **Structure**

  * intro / montée / drop / break
  * répétition vs évolution
* 🎚️ **Énergie**

  * densité sonore
  * tension / relâchement
* 🎼 **Texture**

  * percussif vs harmonique
  * sale / clean
  * sparse / saturated
* 😈 **Intention**

  * agressif, mélancolique, hypnotique, joyeux
  * “ça pousse” / “ça flotte” / “ça tourne en rond”

Pas besoin de vérité absolue.
Il faut une **opinion exploitable**.

---

## 4. Architecture de l’oreille (Ear Stack)

### 4.1 Capture audio (niveau système)

**Objectif** : écouter exactement ce que l’humain entend.

Sur Linux :

* PipeWire / PulseAudio monitor
* JACK loopback si DAW
* priorité : **faible latence, flux continu**

👉 Sortie : buffer audio temps réel

---

### 4.2 Décomposition de l’écoute (multi-oreilles)

On découpe l’écoute en **oreilles spécialisées**, comme chez un humain.

#### 🥁 Oreille rythmique

* BPM tracking
* onset detection
* régularité / dérive

Outils typiques :

* librosa
* Essentia

---

#### 🎼 Oreille musicale

* tonalité approximative
* répétitions
* changements de pattern

---

#### 🔥 Oreille énergétique

* RMS
* spectral flux
* contrastes forts / faibles

---

#### 🧠 Oreille émotionnelle (heuristique)

* mapping énergie + tempo + texture → mood
* pas scientifique, **musical**

---

### 4.3 Fusion → état musical symbolique

Toutes les oreilles alimentent un **Musical State** :

```json
{
  "bpm": 132,
  "groove": "stable",
  "energy": "rising",
  "structure": "build-up",
  "density": "high",
  "mood": ["hypnotic", "tense"],
  "loop_fatigue": 0.7,
  "confidence": 0.82
}
```

C’est **ce document vivant** que lit le LLM.

---

## 5. Le LLM : cerveau, pas oreille

Le LLM :

* ne traite **que du symbolique**
* raisonne comme un musicien :

  * “ça tourne en rond”
  * “le drop tarde”
  * “ça gagnerait à respirer”
* déclenche :

  * suggestions
  * commandes Bitwig via MCP
  * commentaires, journal, feedback créatif

Le LLM **n’écoute pas**, il **interprète**.

---

## 6. Interaction avec Bitwig (vision MCP)

Exemples de boucles perception → action :

* 🔁 boucle trop longue détectée
  → suggestion : variation rythmique
* 🔥 énergie monte sans drop
  → proposer automation / break
* 😴 densité faible prolongée
  → suggérer layer ou texture

Important :
👉 **le copilot ne commande pas sans consentement**
Il propose, il dialogue.

---

## 7. Philosophie : une oreille, pas un juge

Twin Beatmaker n’est pas :

* un professeur
* un critique arrogant
* un algo qui “sait mieux”

C’est :

* un **double attentif**
* une oreille extérieure
* un miroir musical intelligent

Il écoute comme un pote de studio silencieux…
qui parle seulement quand ça vaut le coup.

---

## 8. Ce document est volontairement incomplet

C’est une **pré-conception** :

* pas de stack figée
* pas de techno verrouillée
* pas de dogme ML

La suite logique :

* Ear API
* Musical State schema versionné
* scénarios d’écoute (live set, prod, écoute passive)
* tests perceptifs (humain vs agent)
