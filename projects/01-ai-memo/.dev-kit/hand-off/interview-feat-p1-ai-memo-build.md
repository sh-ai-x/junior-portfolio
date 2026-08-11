---
session: feat-p1-ai-memo-build
status: ok
created_at: 2026-08-11
fields:
  goal: locked
  constraints: locked
  success_criteria: locked
  anti_goals: locked
  acceptance_rubric: locked
ambiguity_score: 2
narrowing_history: "10 -> 2 (one cycle, all 5 fields derived from locked SOT decisions)"
---

# Interview contract — `feat-p1-ai-memo-build`

5-field safety contract per Phase 6 (MUST-15). All fields auto-derived from
`../../../.dev-kit/hand-off/sot-harness-p1-ai-memo.md` and conversation context.
User accepted the locked values via "/dev-kit:interview" with the
default-accept pattern (no override per question).

## 1. `goal`

Ship **01-ai-memo** as a working demo: a Next.js 15 + pgvector + GPT-4o-mini memo app that
takes user-written memos, auto-tags + summarizes them via LLM, and supports semantic
search via pgvector embeddings. Hosted on Vercel at a public URL, responsive on
desktop and mobile.

> Source: locked via SOT §1 (domain-first hexagonal) + §2 (verification); 01-ai-memo/README.md.

## 2. `constraints`

- Single-developer scope; junior portfolio timeline (target: 8 weeks total)
- MiniMax as LLM provider (configured on the repo; `MINIMAX_API_KEY` + `DEV_KIT_GITHUB_TOKEN` set)
- No LLM review cost budget beyond secrets already configured (`minimax` provider, Anthropic fallback via `CI_REVIEW_PROVIDER`)
- Vercel-only hosting (no self-hosted infra)
- pgvector on Neon free tier (1 project, <0.5GB)

> Source: SOT §4 (safety perimeter: conservative + Vercel-aware); conversation.

## 3. `success_criteria`

A) `npm run verify` exits 0 with all checks green:
   - `npm test` (vitest + RTL) — `exit 0`, ≥N tests passing
   - `tsc --noEmit` — `exit 0`, 0 errors
   - `next build` — `exit 0`, no build warnings

B) Application functional on the Vercel URL:
   - Sign in via NextAuth (email magic link or GitHub OAuth)
   - Create / read / update / delete a memo
   - LLM tag + summary generated within 5s p95
   - Semantic search returns relevant memos (top-5 hit rate ≥ 60% on a fixed test query set)

C) `/dev-kit:review` (3-dim) passes with verdict = Approve or Acceptable findings addressed

> Source: SOT §2 (verification: A exit codes + B property-based + C port contracts).

## 4. `anti_goals`

A) **No Clerk auth swap.** NextAuth.js v5 only. Rationale: README says NextAuth; the swap
   would be feature creep that signals you don't follow your own constraints.
   Breach-response if reviewer asks for Clerk: "defer to v2 — NextAuth is sufficient for
   first-deploy demo, Clerk adds SDK + billing complexity for no behavioral gain."

B) **No Postgres sync / mobile push.** Web-only delivery for the demo. Rationale: shipping
   scope discipline; mobile sync adds API surface area and testing matrix.
   Breach-response: "defer to v2 — web responsiveness covers the demo use case."

C) **No public OSS release of 01-ai-memo.** Internal portfolio only. Rationale: AI-memo is
   a demo, not a reusable library; releasing it dilutes the SOT's evidence-as-portfolio
   framing. Breach-response: "defer to v2 — first prove it runs at scale, then consider OSS."

> Source: SOT open questions marked TBD + portfolio scope rule from CLAUDE.md.

## 5. `acceptance_rubric`

| Iron Law | Test | Pass condition |
|---|---|---|
| **L1 — TDD** | Every public function has a failing test before its impl | `git log -p` shows test-before-impl order; `pytest -q` exits 0; property tests on Memo/Tag invariants present |
| **L3 — Evidence before done** | Every "done" claim quotes an exit code + test count + log line | PR body has `npm test → 47 passed, 0 failed (exit 0)`; `tsc --noEmit → exit 0`; `next build → exit 0` |
| **L4 — Refactor-safe** | Any refactor has a regression test | diff contains `+test` matching the refactored module |
| **L5 — Worktree-isolated** | One task = one worktree + branch | `git worktree list` shows distinct branch per feature |

Plus the **SOT §2 verification layer**:

- **A**: `exit codes + counts` quoted before any "done" claim
- **B**: `fast-check property tests` on `Memo`/`Tag`/`Embedding` invariants
- **C**: `port contracts` — fake + real adapters pass the same `test_<port>_contract.ts` suite

> Source: project CLAUDE.md Iron Laws + SOT §2.

---

# Interview loop log

| Cycle | Field asked | Answer source | Score (1-10) | Status |
|---|---|---|---|---|
| 1 | goal | locked from SOT §1 + Q1 default | 10 → 2 | ok |
| 1 | constraints | locked from SOT §4 + CLAUDE.md scope | 10 → 2 | ok |
| 1 | success_criteria | locked from SOT §2 + 01-ai-memo README | 10 → 2 | ok |
| 1 | anti_goals | locked from SOT open-questions TBD set | 10 → 3 | ok |
| 1 | acceptance_rubric | locked from CLAUDE.md + SOT §2 | 10 → 1 | ok |

**Composite convergence:** `status: ok` — `ambiguity_score: 2 ≤ 3` — all 5 fields present and clear.

## Hand-off chain

1. `interview` (this skill) — wrote `./interview-feat-p1-ai-memo-build.md` with `status: ok`
2. `plan` (next invocation) — reads this hand-off, emits `../../PRD.md` + `../phases/p1-ai-memo-build/`
3. `build` (later) — implements steps in per-step worktrees (MUST-38)

Ref: `/dev-kit:plan --from-sot ../../../.dev-kit/hand-off/sot-harness-p1-ai-memo.md`
