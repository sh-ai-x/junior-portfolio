# P1 · AI 메모 앱

## 목표
사용자가 메모를 작성하면 자동으로 **분류·요약·시맨틱 검색**을 제공하는 LLM 기반 메모 앱.

## 왜 이 프로젝트인가
- **"ship something users actually use"** 시그널 (Meta·Vercel·Cursor)
- LLM API·RAG·pgvector를 **실서비스에 붙인 경험** = AI-Native 5사 명시 가산점
- Vercel 배포 = Next.js 데모 가산점 (Vercel·Vercel 직속 채용)

## 스택
- **Frontend:** Next.js 15 (App Router) · TypeScript · React Server Components
- **DB:** PostgreSQL + pgvector (시맨틱 검색 SSOT)
- **LLM:** OpenAI GPT-4o-mini (분류·요약) + text-embedding-3-small (임베딩)
- **Auth:** NextAuth.js v5
- **Deploy:** Vercel

## 트레이드오프 (작성 예정)
- App Router vs Pages Router
- pgvector vs Pinecone
- Embedding 모델 선택 (cost vs quality)

## 트러블슈팅 로그 (작성 예정)

## 지표 (목표)
- 사용자 수: 10명 이상
- 평균 LLM 응답 시간: < 2s
- 비용/월: < $5

## Acceptance Criteria
- [ ] 메모 CRUD
- [ ] 자동 분류 (카테고리·태그)
- [ ] 시맨틱 검색 ("내 메모에서 …찾아줘")
- [ ] Vercel 라이브 URL
- [ ] README에 사용자 수·응답 시간·비용 첨부
