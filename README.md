# Junior Dev Portfolio

> 신입 백엔드 + AI 통합 트랙 포트폴리오.
> **12개사 신입 채용 기준 + 30+ 포트폴리오 리서치** 기반 설계 (2025–2026 출처).
> **4-week sharp plan** — critical-path only, no volume-padding.

## 🎯 Career Target

**AI-Integrated Backend Engineer (Spring/Kotlin + LLM)**

리서치 근거:
- 한국 신입 직군 1위 = 백엔드 (~38%) + AI 통합 baseline이 12개사 중 8개사 (NAVER·Kakao·Toss·Coupang·Woowa·Daangn·Krafton·NCSoft)
- 토스·카카오뱅크·네이버·쿠팡·삼성SDS 모두 Kotlin/Java/Spring 신입 채용
- 글로벌 AI-tool 9개사 (Sourcegraph·Cursor·Cognition·Replit·Modal·Cloudflare·Anthropic·LangChain·Continue) 중 IC2/주니어 JD가 직접 열린 곳은 Sourcegraph 단독
- 차별화: **Spring 깊이 + LLM API·RAG·Agent 실전 사용 1개**

## 📦 Projects (3개 — 3-5 sweet spot per research)

| # | 프로젝트 | 시그널 | 스택 | 상태 | 케이스스터디 |
|---|---|---|---|---|---|
| **P1** | **dev-harness-kit** (flagship) | ship + plugin ecosystem + 41 skills · 22 hooks · 118 tests · cross-runtime | Python · Bash · GitHub Actions · pytest | ✅ | [projects/01-dev-harness-kit/case-study.html](projects/01-dev-harness-kit/case-study.html) |
| P2 | Spring 주문 서비스 (TDD) | Spring 깊이 + Red-Green 사이클 | Kotlin · Spring Boot 3 · JPA · Redis · Docker · k6 | ⏳ | [projects/02-msa-order/README.md](projects/02-msa-order/README.md) |
| P3 | AI 메모 앱 (RAG) | ship + LLM 실전 + eval | Next.js 15 · TS · Postgres · pgvector · OpenAI SDK · Vercel | ⏳ | [projects/03-ai-memo/README.md](projects/03-ai-memo/README.md) |

**Cut from original 4 → 3** per research consensus ("3 strong > 4 shallow"). P4 (CLI tool) deferred — will instead invest that time in **OSS contribution 1건** + **블로그 2건**, both have higher signal density per research must-haves #2 + #8.

각 프로젝트 README는 must-have #6 구조:
**문제 정의 → 왜 이 스택 → 트레이드오프 → 트러블슈팅 → 지표 → 다음에 다르게**

## 🗂️ Repo Map (sharp)

| Path | 용도 | Research must-have |
|---|---|---|
| `projects/` | 3개 실배포 프로젝트 + 케이스스터디 | #2 (3-5 deployed) · #3 (case study) |
| `cs-study/` | CS 기초 노트 (알고·DB·OS·네트워크) | signals depth, not surface |
| `blog/` | 깊이 있는 기술 글 2-3개 | nice-to-have #1 (writing) |
| `oss-contributions/` | 머지된 PR · 작성한 이슈 | nice-to-have #2 (OSS signal) |
| `behavioral/` | STAR 스토리 5개 (면접용) | interview prep, not portfolio |
| `docs/proposals/` | 리서치 보고서 + 설계 제안 | [research.html](docs/proposals/2026-08-10-junior-portfolio-research.html) |
| `AI_USAGE.md` | (루트) AI 사용 disclose — must-have #4 | required since 2025 |
| `.github/profile/README.md` | GitHub 프로필 — must-have #1 | required |

## 📅 4-Week Sharp Plan (from research must-haves, not volume)

| W | 마일스톤 | 완료 기준 (검증 가능한 것만) |
|---|---|---|
| **1** | **Foundation** | GitHub repo · profile README · AI_USAGE.md · P1 case-study shipped · personal site scaffold at `sanghee.dev` (GH Pages) |
| **2** | **Flagship depth** | dev-harness-kit README = Problem→Solution→Result 구조 · 아키텍처 다이어그램 · pinned repo · **OSS PR 1건 머지 or 외부 issue 1건** |
| **3** | **AI differentiator** | P3 (AI 메모 앱) MVP + Vercel 배포 + 실사용자 5명+ + LLM 응답시간 로깅 + **블로그 1건** ("왜 이 스택을 골랐는가") |
| **4** | **Polish + Ship** | P2 완성 (Spring) · Lighthouse ≥ 95 · 모든 링크 검증 · LinkedIn Featured 갱신 · behavioral/ 완성 · `/dev-kit:review` 통과 |

**Cut from 8-week plan:**
- ❌ P4 (CLI 도구) → OSS PR로 대체 (같은 시간에 더 강한 signal)
- ❌ "평가·검증" 단계 분리 → P3 자체에 eval 통합
- ❌ 8주 → 4주, 같은 마일스톤을 critical-path만 압축

## 🛡️ dev-kit Workflow

- W1: `/dev-kit:bootstrap` (이미 적용) + `/dev-kit:ci-setup` + `/dev-kit:docs-maintenance`
- W2~W4: `/dev-kit:build-tdd` (Red-Green-Refactor)
- W3: `/dev-kit:proposal` (P3 설계 → HTML)
- W4: `/dev-kit:review` → `/dev-kit:inspect` → `/dev-kit:ship`

## 📚 Related Materials

- **리서치 보고서 (HTML)**: [docs/proposals/2026-08-10-junior-portfolio-research.html](docs/proposals/2026-08-10-junior-portfolio-research.html) — 12개사 채용 기준 + 30+ 포트폴리오 가이드 종합
- **Flagship 케이스스터디 (HTML)**: [projects/01-dev-harness-kit/case-study.html](projects/01-dev-harness-kit/case-study.html) — P1을 JD 능력에 1:1 매핑한 포트폴리오 brief
- **1개월 sharp plan (상세)**: [docs/1-month-plan.md](docs/1-month-plan.md)
- **AI 사용 disclose**: [AI_USAGE.md](AI_USAGE.md)

---

**Built with dev-kit** · TDD-first · **4-week sharp sprint** · research-backed · 신입 트랙 신호 우선
