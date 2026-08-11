Status: pending

# Step 5 — UI

## Read first

- `phases/p1-ai-memo-build/step4.md` (HTTP routes exist)
- `01-ai-memo/README.md` (responsive on desktop + mobile)

## Task

Build the React component layer: memo list cards, memo editor with live tag preview, semantic search input + result list. Use Tailwind CSS. Mobile-first responsive.

### Files to create

- `src/components/memo-card.tsx`
- `src/components/memo-editor.tsx`
- `src/components/tag-preview.tsx`
- `src/components/search-input.tsx`
- `src/components/search-results.tsx`
- `src/components/header.tsx` (auth-aware)
- `src/components/sign-in-button.tsx`
- `tests/components/test_*_render.tsx` (Vitest + RTL)

## Acceptance Criteria

```bash
vitest run tests/components/    # exit 0 (≥8 component tests)
# Playwright smoke on the running dev server:
npx playwright test              # exit 0 (3 pages render, search works)
npx lighthouse http://localhost:3000/memos --output=json --quiet | jq '.categories.performance.score'
# expect: ≥ 0.9
```

## Verification & Status Update

Update index.json step5.status = "completed".

## Don't

- Don't add a CMS or admin dashboard
- Don't use a heavy UI library (Material-UI, Chakra) — Tailwind only
- Don't break mobile responsiveness (test at 375px viewport)
