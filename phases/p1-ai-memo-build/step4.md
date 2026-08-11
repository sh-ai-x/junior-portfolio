Status: pending

# Step 4 — HTTP layer

## Read first

- `01-ai-memo/README.md` (§stack — Next.js 15 App Router + NextAuth v5)
- `phases/p1-ai-memo-build/step3.md` (real adapters available)

## Task

Wire the App Router: routes for memo CRUD + LLM tag/summary + semantic search. NextAuth v5 for sign-in (GitHub OAuth + email magic link). Use Server Components for memo list, Server Actions for mutations.

### Files to create

- `src/app/layout.tsx` — root layout with auth context
- `src/app/page.tsx` — landing page
- `src/app/memos/page.tsx` — memo list (RSC)
- `src/app/memos/new/page.tsx` — memo editor (RSC + Server Action)
- `src/app/memos/[id]/page.tsx` — memo detail
- `src/app/search/page.tsx` — semantic search
- `src/app/api/memos/route.ts` — POST/GET (Server Action alternative)
- `src/app/api/search/route.ts` — GET
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth handler
- `src/lib/auth.ts` — NextAuth config

## Acceptance Criteria

```bash
tsc --noEmit         # exit 0
next build           # exit 0
next dev &           # start dev server
curl http://localhost:3000/         # 200
curl http://localhost:3000/memos    # 200 (or 307 to sign-in)
curl http://localhost:3000/search   # 200
kill %1              # stop dev server
```

## Verification & Status Update

Update index.json step4.status = "completed".

## Don't

- Don't use Pages Router
- Don't store secrets in client components — Server Actions only
- Don't bypass NextAuth on protected routes
