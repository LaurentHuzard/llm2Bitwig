#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"

create_guild () {
  local NAME="$1"
  local SLUG="$2"

  mkdir -p "$ROOT/$SLUG"/{agents,orchestration,reports}

  cat > "$ROOT/$SLUG/AGENTS.md" <<EOF
# $NAME

Part of the Guerilla Ninja Tribe.

This guild has a sacred role.
No overlap. No confusion. No mercy.
EOF

  cat > "$ROOT/$SLUG/orchestration/ORCHESTRATION.md" <<'EOF'
# Orchestration

Plan → Execute → Verify → Seal

Every action must leave artifacts.
EOF

  cat > "$ROOT/$SLUG/orchestration/PLAN.md" <<'EOF'
# PLAN

## Context
## Objectives
## Constraints
## Risks
## Execution Order
EOF

  cat > "$ROOT/$SLUG/orchestration/TICKETS.md" <<'EOF'
# TICKETS

Rules:
- Small
- Verifiable
- Done is binary
EOF

  touch "$ROOT/$SLUG/reports/.gitkeep"
}

echo "🛠️ Generating core guilds..."

# 1. Main Guerilla Ninja Squad
create_guild "Guerilla Ninja Squad — Builders" "guerilla-ninja"

# 2. Black Hammer Guild
create_guild "Black Hammer Guild — Debug & Legacy Exorcism" "black-hammer"

cat > "$ROOT/black-hammer/QUALITY_GATES.md" <<'EOF'
# Black Hammer Quality Gates

- Bug reproduced by test BEFORE fix
- Tests deterministic
- CI mandatory and blocking
- No regression possible
EOF

# 3. Long Shadow Guild
create_guild "Long Shadow Guild — Strategy & Definition of Done" "long-shadow"

cat > "$ROOT/long-shadow/DEFINITION_OF_DONE.md" <<'EOF'
# Definition of Done (Sacred)

A task is DONE only if:
- Acceptance is binary
- Scope respected
- No follow-up hidden
EOF

# 4. Alien Squad 🛸
create_guild "Alien Agronomists — Agent Farming & Productization" "alien-agronomists"

cat > "$ROOT/alien-agronomists/AGENTS.md" <<'EOF'
# Alien Agronomists 🛸

They do not build.
They do not debug.
They do not plan.

They TRANSFORM.

Demos → Products
Plans → Done
Agents → Armies
EOF

echo "✅ All guilds generated:"
echo " - guerilla-ninja/"
echo " - black-hammer/"
echo " - long-shadow/"
echo " - alien-agronomists/"
