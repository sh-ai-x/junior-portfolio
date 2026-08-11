Status: pending

# Step 6 — Deploy

## Read first

- `./step5.md` (UI complete)
- `../../../../projects/01-ai-memo/README.md` (Vercel deploy target)

## Task

Configure Vercel project: env vars (OPENAI_API_KEY, NEON_DATABASE_URL, NEXTAUTH_SECRET), production domain, git integration. Run a production smoke test. Capture p95 latency.

### Files to create

- `../../vercel.json` (build config, region)
- `../../.env.production.example` (template, gitignored)
- `../../scripts/smoke-prod.sh` (curl 3 routes, log p95)
- `../../docs/deploy.md` (deploy runbook)

## Acceptance Criteria

```bash
vercel deploy --prod
bash ../../scripts/smoke-prod.sh
# expect:
#   GET /         -> 200 in <500ms (p95)
#   GET /memos    -> 200 in <500ms (p95)
#   POST /api/memos (with valid session) -> 201
#   GET /search?q=foo -> 200 with results in <800ms
```

Plus `../../docs/deploy.md` documents the runbook.

## Verification & Status Update

Update ./index.json step6.status = "completed".

## Don't

- Don't commit real env vars to git
- Don't use Vercel's free tier auto-scaling assumptions — verify the production DB connection pool
- Don't skip the smoke test — it must run on the actual deployed URL, not localhost
