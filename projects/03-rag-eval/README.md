# P3 · RAG + Eval Harness

## 목표
검색 기반 질의응답(RAG) 시스템 + 자동 평가(eval) 파이프라인. **"왜 이 모델을 골랐는가"** 시그널.

## 왜 이 프로젝트인가
- OpenAI·Anthropic·Cursor·Cognition이 **eval harness·from-scratch transformer** 명시 우대
- "원론적 사고 과정" 평가 (토스·카카오뱅크)
- AI 사고력 = 18/26사 가산 시그널

## 스택
- **Lang:** Python 3.11+
- **Framework:** FastAPI
- **RAG:** LangChain (또는 LlamaIndex)
- **Vector DB:** pgvector (P1과 공유 가능)
- **Eval:** Ragas · 자체 metric (faithfulness·answer relevance)
- **Notebook:** Jupyter (eval 결과 시각화)

## 핵심 컴포넌트
1. **Document loader** (PDF·Markdown·HTML)
2. **Chunker** (semantic chunking)
3. **Embedder** (OpenAI·Cohere 비교)
4. **Retriever** (BM25 + dense hybrid)
5. **Generator** (GPT-4o vs Claude 비교)
6. **Evaluator** (Ragas + 커스텀 metric)

## Eval 결과 표 (작성 예정)

| Retriever | Embedder | Generator | Faithfulness | Answer Rel. | Latency | Cost |
|---|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... | ... |

## Acceptance Criteria
- [ ] RAG 파이프라인 작동
- [ ] Eval 자동화 (CI에서 실행)
- [ ] 결과 표 + 분석 글 1개
- [ ] "왜 이 모델을 골랐나" 글 1개
