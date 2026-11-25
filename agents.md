---
name: celestrionx-ecosystem
description: Inspect CelestrionX architecture, endpoints, and MCP-enabled developer tools (Auralis and Vessel).
---

# CelestrionX — Agent Onboarding

CelestrionX (`https://www.celestrionx.com`) is a systems engineering, agent infrastructure, and digital culture umbrella. Every public repository includes a root `AGENTS.md` and `DESIGN.md` defining invariants, exact verification commands, and contribution boundaries.

## Quick Context Fetch

- Concise index: `https://www.celestrionx.com/llms.txt`
- Full technical reference: `https://www.celestrionx.com/llms-full.txt`
- Page markdown mirror: `https://www.celestrionx.com/index.md`

## MCP-Ready Tools

### 1. Auralis (`v0.2.0`) — Headless Audio Graph Compiler
- Repository: `https://github.com/Celestrionx/auralis`
- Runtime: Pure Rust CLI + stdio MCP server (`cargo run -- serve`)
- Synthesis backends: `Synth` (oscillators, unison spread, 2-op FM, dynamic filters), `SoundFont` (`rustysynth` SF2), `Sample` (pitched WAV one-shots/glides)
- Game/DAW export: 16/32-bit WAV with RIFF `smpl` loop chunks, OGG Vorbis with `LOOPSTART`/`LOOPLENGTH` tags, equal-length `--stems`
- Closed-loop telemetry: Peak/RMS dBFS, crest factor, stereo correlation, side-to-mid ratio, 32-window Hann FFT spectral energy, mix diagnostics
- MCP tools: `auralis_init_manifest`, `auralis_compile_audio`, `auralis_inspect_soundfont`, `auralis_eval_wav`

### 2. Vessel (`v0.6.0`) — Time-Traveling Sandbox for Coding Agents
- Repository: `https://github.com/WinPhay/vessel`
- Runtime: Go binary + isolated container runtime + stdio MCP server
- Safety primitives: `/workspace` host shield, cgroup CPU/RAM quotas, `--network none` airgap, `--read-only` / `--deny-path`, automatic DLP secret redaction
- Agent workflows: `vessel_exec`, `vessel_checkpoint`, `vessel_checkpoint_diff`, `vessel_rollback`, `vessel_worktree_status`, `vessel_worktree_diff`, `vessel_worktree_commit`, `vessel_browse_url`, `vessel_screenshot`, `vessel_spawn_service`
- Quick install:
  ```bash
  curl -fsSL https://raw.githubusercontent.com/WinPhay/vessel/main/scripts/install.sh | bash
  ```

## Network Routing Map

| Node | Domain | Role |
| :--- | :--- | :--- |
| Primary Hub | `https://www.celestrionx.com` | Dual Human/Agent umbrella directory |
| Engineering Core | `https://winphay.celestrionx.com` | Personal systems architecture & engineering notes |
| Stellar Publishing | `https://stellarpub.celestrionx.com` | Burmese digital literature & OTA story catalog |

## Agent Interaction Guidelines

1. Always read the target repository's `AGENTS.md` and `DESIGN.md` before proposing or running edits.
2. Never edit protected branches (`main`, `master`) directly; isolate changes on `feat/*` or `fix/*`.
3. Verify builds and tests verbatim before returning completion receipts.
4. Contact: `hello@celestrionx.com`
