# SOT Harness — `02-msa-order`

> Single Source of Truth for the MSA order service.
> **Stack note**: User decided to drop Spring from the original README plan; current target is **Python 3.12+ + FastAPI + async SQLAlchemy + Redis**. Kotlin/Spring path is preserved as fallback if the swap is reversed.
> session_id: `p2-msa-order` · date: 2026-08-11

## 1. project_context — AUTO-DERIVED

**Decision: domain-first hexagonal + TDD (consistency with P1)**

Same shape as P1 because:
- Consistency across the 4-project portfolio reads as one architectural story
- The "면접 시 깊이 시그널" goal stated in `projects/02-msa-order/README.md` is best served by hexagonal
- Python + FastAPI is well-suited to ports/adapters (`Protocol` + `Depends()` + dependency injection)

Source: https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html — vertical-slice vs domain-first trade-off

## 2. verification — AUTO-DERIVED

**Decision: A (exit codes) + B (property-based) + C (port contracts) + D (k6 load gate)**

| Layer | Tool | Pass condition |
|---|---|---|
| A. Unit/integration | pytest -q | exit 0, all passed |
| A. Lint/type | ruff check + mypy --strict | exit 0, 0 errors |
| B. Property-based | hypothesis on Order/Payment/Inventory invariants | exit 0, ≥100 examples generated |
| C. Port contracts | test_<port>_contract.py — fake + real adapters | both implementations pass same suite |
| D. Load | k6 run load/order_checkout.js | p95 < 200ms, error rate < 1% |

Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents — layered numeric gates over self-reports

## 3. context — AUTO-DERIVED

**Decision: scratchpad + per-domain subdirectory**

- `.dev-kit/hand-off/p2/<domain>-<feature>.md` — one file per Order/Payment/Inventory domain
- Cross-domain state in `.dev-kit/hand-off/p2/_cross.md` (shared design decisions, dependency choices)
- Session start: read SOT + domain-specific hand-off matching current work

Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents — context externalization for long-running agents

## 4. safety — AUTO-DERIVED

**Decision: MSA-aware perimeter**

- No DB migration without explicit user approval + backup check
- No Redis cache key namespace changes without review (cache stampede risk)
- No adding deps that pull in C extensions without version pinning (compilation risk)
- No changes to `docker-compose.yml` service definitions without user sign-off
- Free to add tests, refactor adapters, write hand-off docs
- Free to use `pytest --reuse-db` for fast iteration

Source: https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html — operational blast radius must be bounded

## 5. lifecycle — AUTO-DERIVED

**Decision: same 5-step ritual as P1, with MSA-specific additions**

- **Start**: read SOT + last `<domain>-<feature>.md` hand-off
- **Mid**: append decisions + rejected alternatives + measurements
- **End**:
  1. `pytest -q` — quote exit code + count
  2. `ruff check` + `mypy --strict` — quote exit codes
  3. `k6 run load/order_checkout.js --quiet` — quote p95 + error rate
  4. Working tree clean, record a snapshot, upload the feature branch
  5. Final hand-off to `.dev-kit/hand-off/p2/<domain>-<feature>-done.md`

Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents — long-running agent rituals

## Implementation phases (sequenced by dependency)

| Phase | Scope | Depends on |
|---|---|---|
| 1. Domain core | Order, Payment, Inventory, Product types + state machines + property tests | — |
| 2. Ports | OrderRepositoryPort, PaymentGatewayPort, InventoryPort, CachePort + contracts | Phase 1 |
| 3. Adapters | async SQLAlchemy repo, Redis cache, mock Toss Payments gateway | Phase 2 |
| 4. HTTP layer | FastAPI routes + dependency injection + error model | Phase 3 |
| 5. Concurrency | Optimistic locking on inventory decrement + race-condition tests | Phase 4 |
| 6. Load test | k6 scripts + postmortem doc | Phase 5 |
| 7. Docker | docker-compose with Postgres + Redis + service | Phase 6 |

## Open questions

- Stack swap confirmation: Kotlin+Spring README → Python+FastAPI. Has the swap been finalized?
- Payment gateway: real Toss Payments sandbox integration, or fully mocked?
- MSA boundaries: single deployable (modular monolith) vs 3-4 actual services from day one?
- Cache invalidation strategy: TTL-only, write-through, or event-driven?

---

**Handoff:**

```bash
/dev-kit:plan --from-sot .dev-kit/hand-off/sot-harness-p2-msa-order.md
/dev-kit:build --from-sot .dev-kit/hand-off/sot-harness-p2-msa-order.md
```
