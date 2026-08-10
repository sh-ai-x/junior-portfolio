# SOT Harness — `01-ai-memo`

> Single Source of Truth for the AI-powered memo app (Next.js 15 + pgvector + OpenAI).
> Generated via `/dev-kit:sot-harness-writer`. session_id: `p1-ai-memo` · date: 2026-08-10

## 1. project_context — LOCKED

**Decision: domain-first hexagonal + TDD**

| Rec | Thesis | Source |
|---|---|---|
| A. Vertical-slice | Full thin slice first (memo CRUD + LLM tag). | https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html |
| **B. Domain-first hexagonal** | Lock Memo/Tag/Embedding invariants before HTTP/LLM/DB. | https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html |
| **C. TDD red-green-refactor** | Strict TDD discipline applied within B. | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents |

Auto-locked B + C (user-confirmed in interview R1).

## 2. verification — LOCKED

**Decision: A (exit codes) + B (property-based) + C (port contracts) layered**

| Rec | Thesis | Source |
|---|---|---|
| **A. Exit codes + counts** | npm test, tsc --noEmit, next build quoted before any done claim. | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents |
| **B. Property-based** | fast-check on Memo/Tag invariants. | https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html |
| **C. Port contracts** | test_<port>_contract.ts — fake + real adapters pass same suite. | https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html |

Auto-locked A + B + C (user-confirmed in interview R2).

## 3. context — AUTO-DERIVED

**Decision: scratchpad + PR-handoff summary**

- Working memory: `.dev-kit/hand-off/<feature>.md` per feature
- Cross-session: log + PR descriptions only — no separate agent memory file
- Session start: agent reads this SOT + last hand-off; no in-conversation re-read

Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

## 4. safety — AUTO-DERIVED

**Decision: conservative perimeter, Vercel-aware**

- No destructive operations on remote main, no rm -rf outside project root, no direct DB writes
- No adding deps without PR review (lockfile changes need explicit approval)
- No Vercel env var changes without user confirmation
- Read `.env*.local` freely; never write secrets to committed files
- Free to add tests, mocks, hand-off docs

Source: https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html

## 5. lifecycle — AUTO-DERIVED

**Decision: read SOT + last hand-off on start; record + upload + hand-off on end**

- **Start**: read SOT + newest file in `.dev-kit/hand-off/` (sorted mtime)
- **Mid**: append to current hand-off file as decisions land
- **End**:
  1. Run `npm run verify` — quote exit code + test count
  2. Working tree clean (or staged with rationale in hand-off)
  3. Record a snapshot + upload the feature branch
  4. Final hand-off to `.dev-kit/hand-off/<feature>-done.md`
  5. Update this SOT only if a locked decision flipped (with reason)

Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

## Implementation phases (sequenced by dependency)

| Phase | Scope | Depends on |
|---|---|---|
| 1. Domain core | Memo, Tag, Embedding types + pure functions + property tests | — |
| 2. Ports | TaggerPort, EmbedderPort, MemoRepositoryPort + contract tests | Phase 1 |
| 3. Adapters | OpenAITagger, OpenAIEmbedder, pgvector repo (real impls) | Phase 2 |
| 4. HTTP layer | Next.js App Router routes + RSC + NextAuth wiring | Phase 3 |
| 5. UI | Memo list, editor, semantic search page | Phase 4 |
| 6. Deploy | Vercel env config + production smoke test | Phase 5 |

## Open questions

- Frontend test stack: Vitest + React Testing Library, or Playwright only?
- Auth: NextAuth.js v5 vs Clerk?
- Embedding model: text-embedding-3-small (cost) vs text-embedding-3-large (quality)?

---

**Handoff:**

```bash
/dev-kit:plan --from-sot .dev-kit/hand-off/sot-harness-p1-ai-memo.md
/dev-kit:build --from-sot .dev-kit/hand-off/sot-harness-p1-ai-memo.md
```
