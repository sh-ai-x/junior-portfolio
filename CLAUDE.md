# CLAUDE.md

> 신입 백엔드 + AI 통합 트랙 포트폴리오.
> dev-kit의 Iron Laws / TDD / review-first 원칙을 따른다.

## Project Goal

8주 안에 26개사 신입 평가 시그널을 충족하는 4개 실배포 프로젝트 + CS 노트 + 블로그 + behavioral.md 완성.

## Iron Laws (from dev-harness-kit)

- **L1 — No production code without failing test** (TDD)
- **L3 — No "done" without quoted exit code + test count + build log**
- **L4 — No cleanup without regression test**
- **L5 — Main branch protected; all work via worktree**

이 레포는 학습·포트폴리오용이므로 worktree는 강제하지 않음. 단, 기능 작업은 브랜치 → PR → 리뷰 후 머지 권장.

## Workflow

- TDD: Red → Green → Refactor
- 리뷰: PR마다 `/dev-kit:review` (multi-dim)
- 문서: 코드 변경 시 같은 PR에서 README 동기화

## References

- Research HTML: `docs/proposals/2026-08-10-junior-portfolio-research.html`
- Repo map: 본 README의 "Repo Map" 섹션
