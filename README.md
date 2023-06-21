## Development Environment

- OS: Testing on Linux & macOS
- Language: Typescript
- Node.js >=18.16.0
- npm >=9.7.1
- Based on NestJS
- typeorm
- sqlite3
- swagger
- class-transformer
- class-validator
- sqlite3

## Production runtime Environment

- todo

## Swagger API Document

- http://localhost:3000/api

## health check

- http://localhost:3000/health

## run on local dev

- npm run start:dev

## Run Unit test

- npm run test

## Run Integration test

- npm run test:e2e

---

## 시나리오

### 지갑생성

1. 지갑을 생성
1. 생성된 ID로 지갑을 확인

### 입금 & 출금

1. 지갑을 생성(optional)
1. 지갑 ID로 입출금 요청
1. 지갑 ID로 입출금 내역 확인
1. 지갑 ID로 지갑 잔액확인

### 입출금 처리

1. 무엇인가 trigger가 되어서 거래(입출금) 처리 API 호출
1. 사용자들은 거래(입출금) 내역 리스트 조회 후 결과를 확인
1. 사용자들은 지갑 ID로 잔액확인

---

## 기능 명세

- 지갑생성
  - 요청: 초기잔액
  - 기능: 지갑생성(식별자: UUID)
  - 응답: 생성된 지갑 데이터
  - validation: balance > 0 & int type
- 입출금
  - 요청: 지갑식별자, 유형: (입금, 출금), 입출금 액수
  - 기능: 해당 지갑의 입출금 내역 생성
  - 응답: 생성된 입출금 내역 데이터
  - validation: walletId is UUID, BankingType is enum, amount > 0 & int type, check inprogress, wallet, balance > amount
- 거래(입출금) 처리 엔드포인트
  - 요청: n/a
  - 기능: 입출금 내역 상태 변경과 이에 따른 잔액 변경
  - 응답: 상태가 변경된 입출금 내역의 수
  - valdation: 출금에 balance 체크
- 지갑(잔액) 조회 엔드포인트
  - 요청: 지갑식별자
  - 기능: 해당 지갑(잔액) 조회
  - 응답: 지갑데이터
  - validation: walletId is UUID
- 거래(입출금) 내역 리스트 조회 엔드포인트
  - 요청: 지갑식별자, 최대개체수, 시작 개체 인덱스
  - 기능: 해당 지갑의 입출금 내역 리스트 조회
    - 처리중이거나처리됨상태모두포함될수있음
  - 응답: 입출금 내역 리스트
  - validation: walletId is UUID, size > 0, lastBankingId is int

---

## API Design

- POST /wallet
- POST /banking
- PUT /banking/batch
- GET /wallet/:id
- GET /banking

---

## Data Design

### 지갑

- 식별자 UUID
- balance 빠르게 서빙하기 위해 데이터 비정규화
- 생성시간
- 수정시간

### 은행업무

- 식별자
- 지갑 식별자
- amount
- 입출금 구분
- 진행 상태
- 생성시간
- 수정시간

---
