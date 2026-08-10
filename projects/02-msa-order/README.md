# P2 · MSA 주문 서비스

## 목표
TDD + 헥사고날 아키텍처 기반 도메인驱動 주문 서비스. 면접 시 "깊이" 시그널.

## 왜 이 프로젝트인가
- **CS 코딩면접** 시연 가능 (네이버·토스·쿠팡·삼성SDS 모두 4단계 평가)
- **TDD·클린코드**는 우테코/배민이 명시 우대
- **시스템 설계 기초** = 카카오·토스 컬처핏 단계

## 스택
- **Lang:** Kotlin 1.9+ (coroutines 포함)
- **Framework:** Spring Boot 3.2+ · Spring Data JPA
- **DB:** PostgreSQL · Redis (캐시)
- **Test:** JUnit 5 · Kotest · MockK · Testcontainers
- **Build:** Gradle (Kotlin DSL)
- **Infra:** Docker · docker-compose

## 도메인 (예정)
- `Order` (주문)
- `Product` (상품)
- `Payment` (결제 — Toss Payments API 연동 가능)
- `Inventory` (재고)

## 트레이드오프 (작성 예정)
- JPA vs QueryDSL
- 모놀리식 모듈러 vs 본격 MSA
- Redis 캐시 무효화 전략

## Acceptance Criteria
- [ ] 도메인 모델 + 단위 테스트 (TDD)
- [ ] REST API + 통합 테스트
- [ ] 동시성 테스트 (재고 차감)
- [ ] 부하 테스트 (k6) 결과 첨부
- [ ] 트러블슈팅 포스트모템 글 1개
