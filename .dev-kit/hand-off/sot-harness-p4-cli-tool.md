# SOT Harness — `04-cli-tool`

> Single Source of Truth for the CLI tool project (first OSS PR merge target).
> **Stack**: Go 1.22+ (default) or Rust (fallback); framework: cobra (Go) or clap (Rust).
> **Project choice** (A/B/C/D from README) is **OPEN** — TBD.
> session_id: `p4-cli-tool` · date: 2026-08-11

## 1. project_context — AUTO-DERIVED

**Decision: thin-slice MVP → v0.1 release → external OSS PR**

Inverted from P1/P2/P3 because the goal is different:
- P1-P3: depth signal for portfolio interviews
- **P4: OSS PR signal** — getting a PR merged into a popular external repo

Shape:
- Pick project (A/B/C/D) — spec it — ship v0.1 to own GitHub — submit upstream PR

Source: https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html — for "ship something small" goals, vertical-slice beats domain-first

## 2. verification — AUTO-DERIVED

**Decision: A (exit codes) + F (cross-platform build) + G (smoke `--help`)**

| Layer | Tool | Pass condition |
|---|---|---|
| A. Unit/integration | go test ./... (or cargo test) | exit 0, all passed |
| A. Lint | golangci-lint run (or cargo clippy) | exit 0, 0 warnings |
| A. Format | gofmt -l (or cargo fmt --check) | exit 0, no diffs |
| **F. Cross-platform build** | make build-all — builds linux/darwin/windows × amd64/arm64 | exit 0, all 8 binaries produced |
| **G. Smoke `--help`** | Run `tool --help` after build | exit 0, usage output matches spec |

Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents — CLI correctness = compilation + smoke + format

## 3. context — AUTO-DERIVED

**Decision: minimal — README + upstream-PR etiquette doc**

- No `.dev-kit/hand-off/p4/` — this project is small enough that context fits in `README.md` + the PR description draft
- Cross-session memory: PR description draft in `docs/pr-draft.md` (markdown, easy to copy into GitHub PR form)

Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents — small projects don't need elaborate hand-off directories

## 4. safety — AUTO-DERIVED

**Decision: upstream-PR-aware perimeter**

- Never write to upstream without explicit user approval (PR is the unit, not the snapshot)
- No rewriting remote history on a feature branch after a PR is open (reviewer trust)
- No adding deps that pull in CGo (cross-compile risk) without justification
- No modifications to `LICENSE` or `CONTRIBUTING.md` of upstream target
- Free to fork, free to iterate locally, free to upload to own fork
- Free to add comprehensive tests (upstream loves tests)

Source: https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html — OSS contribution etiquette is a hard scope boundary

## 5. lifecycle — AUTO-DERIVED

**Decision: PR-shaped ritual**

- **Start**: read SOT + `README.md` + `docs/pr-draft.md`
- **Mid**: update `docs/pr-draft.md` as the PR description evolves
- **End**:
  1. `go test ./...` (or `cargo test`) — quote exit code + count
  2. `golangci-lint run` + `gofmt -l` — quote exit codes
  3. `make build-all` — quote exit code + binary count
  4. `tool --help` — quote exit code
  5. Working tree clean, record a snapshot, upload to fork
  6. Update `docs/pr-draft.md` with final description

Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents — long-running agent rituals

## Implementation phases (sequenced by dependency)

| Phase | Scope | Depends on |
|---|---|---|
| 0. Pick project | Decide A/B/C/D (currently OPEN — see README) | — |
| 1. Spec | README.md draft + docs/pr-draft.md skeleton | Phase 0 |
| 2. MVP | Minimal CLI: arg parsing + one core subcommand + --help | Phase 1 |
| 3. Tests | Unit + integration tests + golden output tests | Phase 2 |
| 4. CI | GitHub Actions: lint + test + build-all matrix | Phase 3 |
| 5. Release | Tag v0.1.0 + upload to own GitHub + write blog post | Phase 4 |
| 6. Upstream PR | Submit to target repo, iterate on review feedback | Phase 5 |

## Open questions

- Project choice (A/B/C/D) — must be decided before Phase 1 starts. Recommendations:
  - A (GitHub CLI plugin): medium signal; broad usage; reviews likely slow
  - B (k8s manifest validator): high signal if you target k8s-heavy companies; steep domain ramp
  - C (LLM cache CLI): medium signal; clear use case; small niche
  - D (Markdown link checker): lowest signal but easiest to land first PR; good for "OSS PR exists" baseline
- Stack: Go (faster ramp, broader ecosystem) or Rust (better signal, steeper ramp)?
- Target repo for first PR: pick before Phase 6 — too late to decide then

---

**Handoff:**

```bash
/dev-kit:plan --from-sot .dev-kit/hand-off/sot-harness-p4-cli-tool.md
/dev-kit:build --from-sot .dev-kit/hand-off/sot-harness-p4-cli-tool.md
```
