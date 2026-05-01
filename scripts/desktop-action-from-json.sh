#!/usr/bin/env bash
set -euo pipefail

# Map OpenAI Computer Use actions to local Wayland input tooling.
#
# Kubuntu Wayland does not generally allow arbitrary synthetic input unless an
# input backend is installed and trusted. This script supports ydotool for
# pointer/keyboard actions and wtype as a typing fallback.

action_json="$(cat)"

ACTION_JSON="$action_json" \
node --input-type=module <<'NODE'
import { spawnSync } from "node:child_process";

const input = process.env.ACTION_JSON?.trim() ?? "";
const action = input ? JSON.parse(input) : {};

function hasCommand(command) {
  return spawnSync("bash", ["-lc", `command -v ${command} >/dev/null 2>&1`]).status === 0;
}

function run(command, args) {
  const result = spawnSync(command, args.map(String), { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status ?? "unknown"}`);
  }
}

function requireCommand(command, hint) {
  if (!hasCommand(command)) {
    throw new Error(`${command} is required for Computer Use action '${action.type}'. ${hint}`);
  }
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function buttonCode(button) {
  switch (button ?? "left") {
    case "left":
      return 0xc0;
    case "right":
      return 0xc1;
    case "middle":
      return 0xc2;
    default:
      throw new Error(`Unsupported mouse button: ${button}`);
  }
}

function keyCode(key) {
  const lower = key.toLowerCase();
  const map = {
    return: "enter",
    esc: "escape",
    pageup: "pageup",
    pagedown: "pagedown",
    ctrl: "ctrl",
    control: "ctrl",
    meta: "meta",
    super: "meta",
  };
  if (map[lower]) return map[lower];
  if (/^[a-z0-9]$/.test(lower)) return lower;
  if (["enter", "escape", "tab", "space", "backspace", "delete", "up", "down", "left", "right", "home", "end", "alt", "shift"].includes(lower)) return lower;
  throw new Error(`Unsupported key: ${key}`);
}

function ydotoolHint() {
  return "On Kubuntu Wayland, install/configure ydotool and ensure ydotoold is running with permission to inject input.";
}

switch (action.type) {
  case "wait":
  case "screenshot":
    sleep(Number(action.ms ?? 1000));
    break;

  case "move":
    requireCommand("ydotool", ydotoolHint());
    run("ydotool", ["mousemove", Number(action.x), Number(action.y)]);
    break;

  case "click":
    requireCommand("ydotool", ydotoolHint());
    run("ydotool", ["mousemove", Number(action.x), Number(action.y)]);
    run("ydotool", ["click", buttonCode(action.button)]);
    break;

  case "double_click":
    requireCommand("ydotool", ydotoolHint());
    run("ydotool", ["mousemove", Number(action.x), Number(action.y)]);
    run("ydotool", ["click", buttonCode(action.button)]);
    sleep(80);
    run("ydotool", ["click", buttonCode(action.button)]);
    break;

  case "scroll":
    requireCommand("ydotool", ydotoolHint());
    run("ydotool", ["mousemove", Number(action.x ?? 0), Number(action.y ?? 0)]);
    {
      const dy = Number(action.scroll_y ?? action.dy ?? 0);
      const dx = Number(action.scroll_x ?? action.dx ?? 0);
      const wheelUp = 0xc4;
      const wheelDown = 0xc5;
      const wheelLeft = 0xc6;
      const wheelRight = 0xc7;
      const verticalButton = dy < 0 ? wheelUp : wheelDown;
      const horizontalButton = dx < 0 ? wheelLeft : wheelRight;
      for (let i = 0; i < Math.min(20, Math.ceil(Math.abs(dy) / 120)); i += 1) run("ydotool", ["click", verticalButton]);
      for (let i = 0; i < Math.min(20, Math.ceil(Math.abs(dx) / 120)); i += 1) run("ydotool", ["click", horizontalButton]);
    }
    break;

  case "type":
    if (hasCommand("wtype")) {
      run("wtype", [String(action.text ?? "")]);
    } else {
      requireCommand("ydotool", "Install wtype for text input or configure ydotool for keyboard injection.");
      run("ydotool", ["type", String(action.text ?? "")]);
    }
    break;

  case "keypress":
    requireCommand("ydotool", ydotoolHint());
    {
      const keys = Array.isArray(action.keys) ? action.keys : [action.key];
      const codes = keys.filter(Boolean).map((key) => keyCode(String(key)));
      run("ydotool", ["key", codes.join("+")]);
    }
    break;

  case "drag":
    throw new Error("drag actions are intentionally disabled for this Bitwig review harness");

  default:
    throw new Error(`Unsupported Computer Use action: ${action.type}`);
}
NODE
