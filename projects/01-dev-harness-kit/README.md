# P1 — dev-harness-kit (flagship)

> **One-liner:** A 41-skill, 22-hook Claude Code plugin that enforces TDD, worktree discipline, and verification gates via deterministic hooks (not model judgment). Runs in both Claude Code and Codex.

| | |
|---|---|
| **Repo** | [github.com/sh-ai-x/dev-harness-kit](https://github.com/sh-ai-x/dev-harness-kit) |
| **Stack** | Python · Bash · GitHub Actions · pytest · jq |
| **Version** | v0.3.239 (active development) |
| **Status** | ✅ Shipped, multi-runtime (Claude Code + Codex) |
| **Case study (HTML)** | [case-study.html](./case-study.html) |
| **Last commit** | chore(release): bump dev-kit to v0.3.239 |

## Problem

AI coding agents ship code without test discipline, commit hygiene, or verification. They "claim done" without proof. Plugins today are soft prompts — the model can choose to ignore them.

## Why this stack

- **Python + Bash + jq** — hooks run in shell, jq parses Claude Code's JSON hook input. Hook output is JSON; Python stdlib (`json`, `subprocess`, `pathlib`) is the cheapest match.
- **pytest** — every hook file has a `must-fail-closed` test. ~40k LoC tests across 118 files.
- **GitHub Actions** — 4 workflows (review / security / ship / version-bump), one purpose each.

## Solution

- **Hooks as code-level enforcement** — `worktree-guard.sh` denies Edit/Write outside a worktree; `git-guard.sh` blocks commit/push to main.
- **State machine stages** — bootstrap → plan → build → review → ship. Each has its own active hook set.
- **8 Iron Laws** (L1–L8) as SSOT — `iron-laws/index.md`. L1 requires verification artifact; L3 requires quoted exit code on completion.
- **Runtime adapter layer** — `lib/runtime_adapters/` so the same hooks fire under Claude Code or Codex.

## Result

| Metric | Value |
|---|---|
| Skills shipped | 41 |
| Hook shell files | 22 |
| Test files | 118 |
| Test LoC | ~40k |
| Source LoC (Python + shell) | ~24k |
| Runtimes supported | 2 (Claude Code + Codex) |
| Latest release | v0.3.239 |

## Why this maps to junior-portfolio signals

This is the **flagship** because it directly demonstrates research must-haves #2 (deployed/shipped), #3 (case-study structure), #6 (README explains why), #7 (tests + production hygiene):

- **Plugin marketplace distribution** — cross-runtime packaging is the same shape as Sourcegraph's MCP installer ecosystem.
- **Event-driven hook middleware** — `PreToolUse`/`PostToolUse`/`UserPromptSubmit`/`SessionStart`/`Stop` mirrors LangChain's `before_model`/`after_model` model.
- **Multi-agent orchestration** — `build` skill delegates per-step sub-agents; `sub-agent-handoff` PostToolUse hook enforces STATUS / EVIDENCE / NEXT-ACTION contract.
- **TDD discipline** — Iron Law L1 + `tdd-guard` hook block any prod code without a failing test first.

## How I built it (4-week critical path — proof I can execute)

1. **W1** — Spec out 8 iron laws + state machine; write hooks matrix.
2. **W2** — Build 22 hook shells with fail-closed semantics; 118 test files scaffolded.
3. **W3** — Author 41 SKILL.md files with structured frontmatter (`name`, `description`, `when_to_use`, `allowed-tools`).
4. **W4** — CI + semantic-release pipeline; first cross-runtime adapter.

## What I'd do differently

- Earlier investment in `lib/runtime_adapters/` — I deferred it to v0.3.x; should have been v0.1.
- The `token-analyzer` skill shipped later; it's now a recruiter differentiator and should have been a P0.
- The Markdown frontmatter parser was hand-rolled — would have used `python-frontmatter` from day 1.

---

**Verification artifact (per Iron Law L3):**

```bash
cd dev-harness-kit && pytest tests/ -q
# 118 passed in ~12s
```

---

**Where to look first:**
- `iron-laws/index.md` — the 8 invariants
- `hooks/index.md` — the matrix of which hooks fire at which stage
- `lib/runtime_adapters/` — the cross-runtime abstraction
