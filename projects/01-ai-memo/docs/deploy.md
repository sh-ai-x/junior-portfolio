# Deploy runbook - 01-ai-memo (Vercel)

## Pre-flight

1. Confirm `.env.production.example` mirrors required env vars.
2. Set Vercel project env vars (Settings -> Environment Variables):
   - `OPENAI_API_KEY` (Production, Preview)
   - `NEON_DATABASE_URL` (Production, Preview)
   - `NEXTAUTH_SECRET` (Production)
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` (Production, Preview)
   - `EMAIL_FROM` (Production)
3. Set `USE_FAKES=0` for prod, `USE_FAKES=1` for preview (skips LLM calls).
4. Apply DB migration: apply `scripts/migrate.sql` to the Neon DB.

## Deploy

- Push the feature branch to origin (triggers Vercel preview deploy).
- Merge to main (triggers production deploy).

## Smoke test (post-deploy)

```
./scripts/smoke-prod.sh https://01-ai-memo.vercel.app
```

Expected:
- `GET /`         -> 200
- `GET /memos`    -> 200 (or 307 to /signin if no session)
- `GET /search`   -> 200
- `GET /search?q=foo` -> 200 with results in <800ms p95

## Rollback

Vercel dashboard -> Deployments -> Promote a previous deployment to Production.

## Incident triage

| Symptom | Likely cause | Action |
|---|---|---|
| `/memos` 500s | `pgvector` extension missing on DB | Run `CREATE EXTENSION vector;` |
| Search empty | `embedding` column NULL on saved memos | Backfill via `UPDATE memos SET embedding = ...` |
| LLM tag latency >5s | OpenAI API slow / rate-limited | Bump cache TTL or fall back to deterministic tagger |
