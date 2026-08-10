# SOT Harness — `03-rag-eval`

> Single Source of Truth for the RAG + Eval Harness project (Python 3.11+ + FastAPI + LangChain + pgvector + Ragas).
> session_id: `p3-rag-eval` · date: 2026-08-10

## 1. project_context — AUTO-DERIVED

**Decision: eval-first, then RAG implementation**

Inverted from P1/P2: build the eval harness BEFORE the RAG pipeline. Reason: if you can't measure it, you can't improve it. The eval suite is the contract; the RAG is one implementation of that contract.

- Phase 1: Eval harness (Ragas + custom metrics on synthetic Q&A pairs)
- Phase 2: Naive RAG (vanilla retrieval + generation)
- Phase 3: Iterative improvements measured against the eval harness

Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents — build the test before the thing being tested, even in research-shaped work

## 2. verification — AUTO-DERIVED

**Decision: A (exit codes) + B (property-based) + C (port contracts) + E (Ragas metric gate)**

| Layer | Tool | Pass condition |
|---|---|---|
| A. Unit/integration | pytest -q | exit 0, all passed |
| A. Lint/type | ruff check + mypy --strict | exit 0, 0 errors |
| B. Property-based | hypothesis on Document chunking invariants | exit 0, ≥100 examples |
| C. Port contracts | test_<port>_contract.py — fake + real (in-memory vs pgvector) | both pass |
| **E. Ragas metrics** | ragas.evaluate() on synthetic Q&A set | faithfulness ≥ 0.85, answer_relevance ≥ 0.80, context_precision ≥ 0.75 |

Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents — eval-first means the harness defines "done" before implementation starts

## 3. context — AUTO-DERIVED

**Decision: notebook + scratchpad hybrid**

- Jupyter notebook in `projects/03-rag-eval/evals/` for exploratory eval runs + visualizations
- `.dev-kit/hand-off/p3/` for design decisions, prompt iterations, metric definitions
- Eval dataset is **immutable** (frozen snapshot) — never edit, only version

Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents — research tasks need both narrative (notebook) and structured (hand-off) artifacts

## 4. safety — AUTO-DERIVED

**Decision: dataset-immutability + cost-cap perimeter**

- Eval dataset is **read-only after v1 freeze** — modifications require new dataset version + reason
- No LLM API calls in eval harness without `--max-cost` flag (cost runaway protection)
- No modifications to eval metric definitions after they ship (changes invalidate historical comparisons)
- No adding external corpora without license check + source attribution
- Free to iterate prompts, embedding strategies, chunking parameters
- Free to add new eval metrics AS NEW METRICS (not modifying existing ones)

Source: https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html — eval comparability requires immutability of measurement artifacts

## 5. lifecycle — AUTO-DERIVED

**Decision: eval-run + metric-quote ritual**

- **Start**: read SOT + last eval-run notebook + last hand-off
- **Mid**: each eval run gets a notebook cell + metric values appended to hand-off
- **End**:
  1. `pytest -q` — quote exit code + count
  2. `ruff check` + `mypy --strict` — quote exit codes
  3. `ragas.evaluate()` — quote all 3 metric values
  4. Compare to last session's metrics; flag regressions > 5%
  5. Record a snapshot + upload the feature branch + write `.dev-kit/hand-off/p3/<date>-run-<n>.md`

Source: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents — long-running agent rituals

## Implementation phases (sequenced by dependency)

| Phase | Scope | Depends on |
|---|---|---|
| 1. Eval harness | Ragas setup + synthetic Q&A dataset (50 pairs) + custom metrics | — |
| 2. Naive RAG | Document loader (PDF/MD/HTML) + chunker + pgvector store + retrieval + generation | Phase 1 |
| 3. Baseline run | Run Ragas on naive RAG, record all 3 metrics | Phase 2 |
| 4. Iteration 1 | Better chunking (semantic vs fixed-size) — re-measure | Phase 3 |
| 5. Iteration 2 | Re-ranking (Cohere rerank or LLM-based) — re-measure | Phase 4 |
| 6. Iteration N | HyDE, multi-query, or query expansion — re-measure | Phase 5 |
| 7. Postmortem | Why each iteration helped/hurt; chart metric progression | Phase 6 |

## Open questions

- RAG framework: LangChain vs LlamaIndex vs from-scratch?
- Embedding model: OpenAI text-embedding-3-small (cost) or open-source bge-large-en-v1.5 (privacy)?
- Eval LLM-as-judge: GPT-4o-mini (cheap) or Claude Haiku (high-quality judge)?
- Dataset domain: Programming Q&A (CS-focused) or general knowledge?

---

**Handoff:**

```bash
/dev-kit:plan --from-sot .dev-kit/hand-off/sot-harness-p3-rag-eval.md
/dev-kit:build --from-sot .dev-kit/hand-off/sot-harness-p3-rag-eval.md
```
