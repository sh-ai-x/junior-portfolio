Status: pending

# Step 3 — Adapters (real)

## Read first

- `./step2.md` (port contracts)
- `../../tests/ports/test_*_contract.ts` (what real adapters must satisfy)

## Task

Implement real adapters: OpenAI Tagger + Embedder, pgvector repository. Each adapter must pass the contract suite from step 2 verbatim — no extra tests, no relaxed expectations. Plus a pgvector testcontainer integration test.

### Files to create

- `../../src/adapters/openai-tagger.ts`
- `../../src/adapters/openai-embedder.ts`
- `../../src/adapters/pgvector-repo.ts`
- `../../src/adapters/fakes/fake-tagger.ts` (already from step2)
- `../../tests/adapters/test_openai_tagger_integration.py` — gated on `OPENAI_API_KEY` env
- `../../tests/adapters/test_pgvector_integration.py` — uses testcontainers/postgres+pgvector

## Acceptance Criteria

```bash
vitest run ../../tests/ports/                  # exit 0 (real impls pass contract)
vitest run ../../tests/adapters/               # exit 0 (real impls integration)
```

## Verification & Status Update

Update ./index.json step3.status = "completed".

## Don't

- Don't relax the contract suite to make real impls pass — fix the impl
- Don't skip the integration tests with `describe.skip` — must run if env vars present
- Don't call OpenAI from tests without mocking — use VCR/cassette pattern or skip when key absent
