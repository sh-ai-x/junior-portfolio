Status: pending

# Step 2 — Ports

## Read first

- `.dev-kit/hand-off/sot-harness-p1-ai-memo-build.md` (R2.C port contracts)
- `phases/p1-ai-memo-build/step1.md` (output contracts of domain types)

## Task

Define the port interfaces (TaggerPort, EmbedderPort, MemoRepositoryPort, SearchIndexPort) as TypeScript protocols + write contract tests that any adapter (real or fake) must satisfy. The contract suite is the SSOT for "what an adapter does" — both fake and real impls must pass it.

### Files to create

- `src/ports/tagger.port.ts` — `interface TaggerPort { tag(memo: Memo): Promise<Tag[]> }`
- `src/ports/embedder.port.ts` — `interface EmbedderPort { embed(text: string): Promise<Embedding> }`
- `src/ports/repository.port.ts` — `interface MemoRepositoryPort { ... }`
- `src/ports/search.port.ts` — `interface SearchIndexPort { query(embedding: Embedding, k: number): Promise<Memo[]> }`
- `src/ports/index.ts` — barrel
- `tests/ports/test_tagger_contract.ts` — same suite must pass for FakeTagger and OpenAITagger
- `tests/ports/test_embedder_contract.ts`
- `tests/ports/test_repository_contract.ts`

## Acceptance Criteria

```bash
vitest run tests/ports/   # exit 0
```

Contract suite includes ≥6 invariants per port. When step3 lands, the real adapters must pass the same suite verbatim (no implementation-coupled tests).

## Verification & Status Update

Update index.json step2.status = "completed" when `vitest run tests/ports/` exits 0.

## Don't

- Don't import concrete adapter implementations in port files
- Don't put ports in `src/domain/` — they belong to the boundary layer
- Don't couple tests to a specific LLM provider or DB engine
