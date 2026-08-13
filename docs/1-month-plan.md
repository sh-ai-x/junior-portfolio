# 1-Month Sharp Plan

> **Premise:** Build a research-backed junior-portfolio in 4 weeks, not 8. Cut everything that's not critical-path.

## Why 4 weeks, not 8

The original 8-week plan in README.md had 4 projects + 3 blog posts + OSS + behavioral + docs. That's volume-padding.

The 2025-2026 hiring research is explicit: **3-5 deployed projects beats 10 shallow ones**, **3 strong projects communicate competence effectively** (Joseph Assefa, Medium). The personal portfolio site is **contested** — many senior voices say skip unless substantial.

So: **3 projects + 1 OSS PR + 2 blogs + minimal site**. Same outcome, half the time.

## Critical-path only

| | Original (8w) | Sharp (4w) | Saved by |
|---|---|---|---|
| Projects | 4 (P1-P4) | 3 (P1-P3, skip P4) | Research: 3 strong > 4 shallow |
| Blog posts | 3-5 | 2 | Volume-padding removed |
| OSS PRs | 1 | 1 | Same signal density |
| Personal site | full site | GH Pages 1-page | Research: contested; only build if adds what GitHub can't |
| Docs / proposals | multiple | 1 research HTML | Already produced |
| Behavioral STAR | full set | 5 STARs | Same scope |

## Week-by-week (4 weeks)

### Week 1 — Foundation (the portfolio IS the artifact)

| Day | Task | Done when |
|---|---|---|
| Mon | GitHub repo set up + profile README | `.github/profile/README.md` exists |
| Tue | AI_USAGE.md (must-have #4) | `AI_USAGE.md` exists with per-project breakdown |
| Wed | P1 case-study shipped | `projects/01-dev-harness-kit/README.md` + `case-study.html` |
| Thu | Personal site scaffold | `sanghee.dev` (GH Pages) serves a single-page index |
| Fri | README sync + worktree setup | Top-level `README.md` lists 3 projects + AI_USAGE.md links |

**Deliverable:** A portfolio repo that already passes the 55-second screen. Recruiter sees: 3 projects (1 shipped), GitHub profile, AI usage disclosure.

### Week 2 — Flagship depth (the proof)

| Day | Task | Done when |
|---|---|---|
| Mon | dev-harness-kit README = Problem→Solution→Result | Already done in W1; refine |
| Tue | Architecture diagram in P1 README | SVG inline |
| Wed | Pin dev-harness-kit on GitHub profile | Profile README updated |
| Thu | OSS PR attempt #1 — small, typo-fix or doc-improver | PR opened (merged optional) |
| Fri | Personal site links to all 3 case studies | All 3 READMEs cross-link |

**Deliverable:** Flagship reads deep. OSS contribution attempt logged (merge is bonus).

### Week 3 — AI differentiator (the gap-filler)

| Day | Task | Done when |
|---|---|---|
| Mon-Tue | P3 (AI 메모 앱) MVP — Next.js + Postgres + pgvector + OpenAI | Endpoints functional locally |
| Wed | Vercel deploy + first 5 users (could be friends/colleagues) | Live URL + at least 5 signups |
| Thu | LLM response-time logging + basic eval harness | Logs + eval CSV |
| Fri | Blog post #1: "왜 이 스택을 골랐는가 — Postgres pgvector vs Pinecone" | Published on dev.to + repo `blog/` |

**Deliverable:** Live deployed AI-integrated project with a real user base + eval data + 1 blog post.

### Week 4 — Polish + Ship

| Day | Task | Done when |
|---|---|---|
| Mon-Tue | P2 (Spring 주문 서비스) — complete TDD cycle | All controllers + tests + Redis + k6 |
| Wed | Lighthouse pass (≥ 95 on personal site) | All green |
| Thu | LinkedIn Featured refresh + 1 post about the portfolio itself | Posted |
| Fri | `/dev-kit:review` on the entire portfolio repo | All findings addressed |

**Deliverable:** Shipped portfolio. Apply to Sourcegraph IC2 + 2-3 cold-outreach targets.

## What this plan deliberately skips

- ❌ P4 (CLI 도구) → OSS PR로 대체
- ❌ Multiple blog posts → 2가지만 (깊이 우선)
- ❌ Full personal site → 1-page GH Pages
- ❌ Excessive documentation → case-study 1개 + AI_USAGE.md
- ❌ "Show everything" → show the JD-research-derived must-haves만

## Anti-patterns this plan avoids

Per the research anti-patterns section:

- ❌ **Tutorial graveyard** — All 3 projects are real problems I built
- ❌ **Mass-quantity portfolio** — 3 sharp, not 10 shallow
- ❌ **Over-engineered site** — 1-page GH Pages, no WebGL
- ❌ **No README / no tests** — Every project has the case-study structure; tests-first on P2/P3
- ❌ **Empty GitHub** — Profile README + 3 pinned repos + real contribution graph

## Decision rule for ad-hoc additions

If during the month something interesting comes up (a new OSS issue, a Twitter thread opportunity, a recruiter email):

> **Will this add a *new capability* the JDs are looking for, or is it volume?**

If volume → defer. If new capability → consider, but never at the expense of W1-W4 deliverables.

## Success criteria at end of month

- [ ] 3 projects live + case-study READMEs (1 shipped, 2 deployable)
- [ ] AI_USAGE.md + profile README + personal site live
- [ ] 1 OSS PR (merged or open with substantive feedback)
- [ ] 2 blog posts published (dev.to)
- [ ] Lighthouse 95+ on personal site
- [ ] Apply to at least 3 targets (Sourcegraph IC2 + 2 cold outreach)
- [ ] `/dev-kit:review` on the entire repo passes

If 6 of 7 are met → portfolio is shippable. The 7th (OSS PR merged) is bonus.
