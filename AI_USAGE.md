# AI Usage Disclosure

> Per 2025-2026 hiring research (must-have #4): honest AI-usage disclosure is now a baseline expectation. Pretending not to use AI is a red flag; transparency is the win.

This document tracks how AI tools are used across all projects in this portfolio. Updated per project completion.

## Top-level policy

- **All AI-assisted code is reviewed line-by-line** before commit. I can explain every line in an interview.
- **AI is a power tool, not a crutch.** Boilerplate / first drafts / docs / research aggregation — yes. Architecture decisions, trade-off judgments, debugging logic — no.
- **No undisclosed AI commits.** If a commit is AI-generated, the commit message states it.

## Tool inventory (as of 2026-08-10)

| Tool | Used for | Not used for |
|---|---|---|
| **Claude Code** (this CLI) | Repo bootstrapping, dev-harness-kit skill authoring, research synthesis, refactoring | Production algorithms I can't explain |
| **GitHub Copilot** | Inline completions in Spring/Kotlin code | Architectural decisions |
| **OpenAI / Anthropic APIs** | Inside P3 (AI 메모 앱) — that's the project itself | Anything else |

## Per-project usage

### P1 — dev-harness-kit (flagship)

- **What AI did**: scaffolded the initial hooks/ directory shell files, drafted 30+ SKILL.md frontmatter blocks from spec.
- **What I did**: architecture (event-driven hook matrix, iron-laws hierarchy, runtime adapter pattern), all state-machine logic, all iron-laws text, every test in `tests/`.
- **Verification**: every hook file has a `must-fail-closed` test in `tests/` (118 test files, ~40k LoC).
- **Lines I can whiteboard**: the entire hook matrix, every iron-law, the runtime-adapter abstraction.

### P2 — Spring 주문 서비스 (in progress)

- **What AI will do**: CRUD controller boilerplate, test fixtures.
- **What I will do**: domain modeling, transaction boundaries, TDD test design, k6 load scenarios.
- **Verification**: every controller has a failing test written by me first (Iron Law L1).

### P3 — AI 메모 앱 (in progress)

- **This project IS about AI integration.** OpenAI API + pgvector RAG.
- **What AI will do inside the project**: embeddings, summarization (the product feature).
- **What I will do**: the surrounding system — auth, vector storage, eval harness, observability, prompt iteration loop.
- **Verification**: eval harness measures retrieval quality + answer relevance; I review every prompt change.

## Research artifact

This portfolio's research itself — `docs/proposals/2026-08-10-junior-portfolio-research.html` — was synthesized using 3 parallel Claude agents. The synthesis step was human-led (me, choosing what to include, structuring the narrative, picking the right sections). The agents did web search + first-draft extraction; I made the editorial decisions.

## What I will NOT do with AI

- Submit AI-generated code I haven't read.
- Cite a tool that did work without saying what it did.
- Use AI to bypass learning fundamentals (I'm a junior — the fundamentals ARE the point).
- Pass off AI-only commits as my own work.

---

**Last updated**: 2026-08-10
