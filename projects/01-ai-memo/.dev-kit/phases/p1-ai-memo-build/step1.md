Status: pending

# Step 1 — Domain core

## Read first

- `../../../../.dev-kit/hand-off/sot-harness-p1-ai-memo.md` (§1 project_context, §5 lifecycle)
- `../hand-off/interview-feat-p1-ai-memo-build.md` (acceptance rubric, AC1)

## Task

Build the hexagonal core: Memo / Tag / Embedding value types + pure functions that operate on them. No HTTP, no LLM, no DB — just type definitions and operations verified by property-based tests.

### Files to create

- `../../src/domain/memo.ts` — Memo value type + factory + derivation functions
- `../../src/domain/tag.ts` — Tag vocabulary + derived-tag logic
- `../../src/domain/embedding.ts` — Embedding type + similarity math (cosine)
- `../../src/domain/index.ts` — barrel export
- `../../tests/unit/domain/test_memo.py` — example tests
- `../../tests/unit/domain/test_memo_properties.py` — fast-check property tests ≥12 cases

## Acceptance Criteria

`vitest run --reporter=verbose` exits 0 with:
- ≥12 property-based tests on Memo/Tag invariants (e.g., `derived_tags ⊆ corpus_vocabulary`, `len(embedding) == model_dim`, `search_results sorted desc by similarity`)
- All example tests pass
- 0 type errors (`../../node_modules/.bin/tsc --noEmit` (or `../../projects/01-ai-memo/`) — actually run from `../../` exit 0)

## Verification & Status Update

```bash
vitest run --reporter=verbose      # expect: ≥X passed (exit 0)
tsc --noEmit                       # expect: 0 errors (exit 0)
```

Update `./index.json`: step1.status = "completed", step1.completed_at = <ISO>.

## Don't

- Don't import Next.js, OpenAI, pg, or any IO library in domain code
- Don't add HTTP routes or DB schemas
- Don't skip the property tests — they catch un-enumerated edge cases
