# Junior Dev Portfolio

> 신입 백엔드 + AI 통합 트랙 포트폴리오.
> **26개사 신입 채용 기준 리서치** 기반으로 설계 (2025–2026 출처).

## 🎯 Career Target

**AI-Integrated Backend Engineer (Spring/Kotlin + LLM)**

리서치 근거:
- 한국 신입 직군 분포 1위 = 백엔드 38% (byline.network/2025/02/12-386)
- 토스·카카오뱅크·네이버·쿠팡·삼성SDS 모두 Kotlin/Java/Spring 신입 채용
- AI 역량은 18/26사에서 baseline (Cursor·Cognition·OpenAI·카카오·토스 등)
- 차별화: Spring 깊이 + LLM API·RAG·Agent 실전 사용 1개

## 📦 Projects

| # | 프로젝트 | 시그널 | 스택 | 상태 |
|---|---|---|---|---|
| P1 | AI 메모 앱 | ship + LLM 실전 | Next.js 15 · TS · Postgres · pgvector · OpenAI SDK · Vercel | ⏳ |
| P2 | MSA 주문 서비스 | Spring 깊이 + TDD | Kotlin · Spring Boot 3 · JPA · Redis · Docker · k6 | ⏳ |
| P3 | RAG + Eval Harness | AI 사고력 | Python · FastAPI · LangChain · pgvector · Ragas | ⏳ |
| P4 | CLI 도구 | OSS 첫 기여 | Go · GitHub Actions | ⏳ |

각 프로젝트 README에 **문제 정의 → 왜 이 스택 → 트레이드오프 → 트러블슈팅 → 지표 → 다음에 다르게** 명시.

## 🗂️ Repo Map

- `projects/` — 실배포 가능한 4개 프로젝트
- `cs-study/` — CS 기초 (알고리즘·DB·OS·네트워크) + 원론적 사고 노트
- `blog/` — 깊이 있는 기술 글 3~5개 (Velog/Tistory 외부 발행 가능)
- `oss-contributions/` — 머지된 PR·작성한 이슈
- `behavioral/` — STAR 스토리 5개 (면접용)
- `certs/` — 자격증 트래킹
- `docs/proposals/` — 설계 제안 (리서치 보고서 HTML 포함)

## 📅 8-Week Plan

| W | 마일스톤 | 완료 기준 |
|---|---|---|
| 1 | 부트스트랩 + CI | CI 통과, README 초안 |
| 2 | P2 도메인·테스트 | Red-Green 사이클 작동 |
| 3 | P2 완성 + 첫 블로그 글 | `gradle build` 통과, 부하테스트 결과 |
| 4 | P1 MVP | LLM 응답 시간 로깅 |
| 5 | P1 Vercel 배포 + 사용자 10명 | 실배포 URL, 지표 README 첨부 |
| 6 | P3 완성 + 두 번째 글 | eval 결과 표, "왜 이 모델" 글 |
| 7 | P4 publish + OSS PR 1개 머지 | v0.1 release, 외부 머지 PR |
| 8 | behavioral + 최종 README + 리뷰 | `/dev-kit:review` 통과, CI 100% |

## �️ dev-kit Workflow

- W1: `/dev-kit:bootstrap` (이미 적용됨) + `/dev-kit:ci-setup`
- W2~W8: `/dev-kit:build-tdd` (TDD Red-Green-Refactor)
- W3·W5·W6·W8: `/dev-kit:review [paths]`
- W8: `/dev-kit:inspect` → `/dev-kit:docs-maintenance` → `/dev-kit:ship`

## 📚 Related Materials

- 리서치 보고서 (HTML): `docs/proposals/2026-08-10-junior-portfolio-research.html`
- 한국 자료: 토스 tech blog, 카카오 tech blog, 우아한형제들 tech blog, 우테코, 네이버 부스트캠프
- 글로벌 자료: Spring docs, Kotlin Coroutines, Anthropic prompt engineering docs, OpenAI Cookbook
- 면접 후기: Velog·Tistory "토스 NEXT 2025 합격후기", "카카오뱅크 면접 후기"

---

**Built with dev-kit** · TDD-first · 8-week sprint · 신입 트랙 신호 우선
