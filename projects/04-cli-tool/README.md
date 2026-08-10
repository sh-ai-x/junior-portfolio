# P4 · CLI 도구

## 목표
작지만 실사용 가능한 CLI 도구를 만들고 **외부 OSS에 첫 PR 머지**.

## 왜 이 프로젝트인가
- **OSS 머지 PR** = 15/26사 가산 시그널 (OpenAI·Anthropic·Stripe 명시)
- 작은 typo 수정이라도 머지 이력 자체가 시그널
- 1~2주 내 v0.1 publish + 외부 기여 가능

## 후보 (선택 필요)
- A) **GitHub CLI 플러그인** (PR 자동 라벨링)
- B) **k8s 매니페스트 검증기** (yaml lint + diff)
- C) **LLM 캐시 CLI** (프롬프트 응답 캐싱)
- D) **Markdown 링크 체커** (외부 OSS로 머지 쉬움)

## 스택
- **Lang:** Go 1.22+ (또는 Rust)
- **CLI:** cobra (Go) · clap (Rust)
- **CI:** GitHub Actions
- **Release:** GoReleaser 또는 cargo-dist

## Acceptance Criteria
- [ ] v0.1 GitHub release
- [ ] README + man page
- [ ] 외부 OSS에 PR 1개 머지 (PR 링크 첨부)
- [ ] CI 통과 (build·test·lint)
