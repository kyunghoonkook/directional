# 게시판 & 데이터 시각화 프로젝트

이 프로젝트는 게시판 CRUD 기능과 데이터 시각화를 구현한 React 기반 웹 애플리케이션입니다.

## 🚀 프로젝트 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 자동 접속됩니다.

### 3. 로그인

- 이메일: `alice@example.com`
- 비밀번호: `alice1234`

로그인 페이지에 기본값으로 입력되어 있어 바로 로그인 버튼을 누르면 됩니다.

## 🛠 사용한 기술 스택

### Core
- **React 18.3.1** - UI 라이브러리
- **TypeScript 4.9.5** - 정적 타입 체크

### 상태 관리
- **Context API** - 전역 인증 상태 관리
- **@tanstack/react-query 5.x** - 서버 상태 관리
- **React Hooks (useState, useEffect)** - 로컬 상태 관리

### 스타일링
- **styled-components 6.x** - CSS-in-JS 스타일링

### 라우팅
- **react-router-dom 6.x** - 클라이언트 사이드 라우팅

### HTTP 통신
- **axios 1.x** - HTTP 클라이언트
  - 인터셉터를 통한 중앙화된 토큰 관리
  - 에러 처리 미들웨어

### 데이터 시각화
- **recharts 2.x** - React 차트 라이브러리
  - 바 차트, 도넛 차트
  - 스택형 바 차트, 스택형 면적 차트
  - 멀티라인 차트 (이중 Y축)

## 📋 주요 구현 기능

### 1. 게시판 기능

#### ✅ CRUD (Create, Read, Update, Delete)
- 게시글 작성, 조회, 수정, 삭제 기능 완벽 구현
- 로그인한 사용자만 접근 가능

#### ✅ 검색
- 제목 및 본문 내용으로 게시글 검색
- 여러 단어를 공백으로 구분하여 AND 검색 가능

#### ✅ 페이지네이션
- 커서 기반 페이징 (prevCursor/nextCursor)
- 이전/다음 페이지 이동 기능

#### ✅ 정렬
- 작성일(createdAt) 또는 제목(title) 기준 정렬
- 오름차순/내림차순 선택 가능

#### ✅ 필터
- 카테고리별 필터링 (공지사항, 질문답변, 자유게시판)
- 전체 보기 옵션

#### ✅ 금칙어 필터
- "캄보디아", "프놈펜", "불법체류", "텔레그램" 포함 시 등록 불가
- 제목과 본문에서 실시간 검증

#### ✅ 기타 기능
- 태그 추가/삭제 (최대 5개, 각 24자 이내)
- 제목 최대 80자, 본문 최대 2000자 제한
- 실시간 유효성 검사

### 2. 데이터 시각화

#### ✅ 인기 커피 브랜드 분포
- **바 차트**: 브랜드별 인기도를 막대 그래프로 표시
- **도넛 차트**: 브랜드별 점유율을 도넛 차트로 표시

#### ✅ 주간 무드 트렌드
- **스택형 바 차트**: 주차별 감정 분포를 누적 막대로 표시
- **스택형 면적 차트**: 주차별 감정 변화를 누적 면적으로 표시
- X축: 주차, Y축: 백분율(%)
- 행복, 피곤, 스트레스 항목을 누적 형태로 시각화

#### ✅ 팀별 커피 소비량과 생산성
- **멀티라인 차트**: 팀별 커피 섭취량에 따른 버그 수와 생산성 변화
- X축: 커피 섭취량 (잔/일)
- 왼쪽 Y축: 버그 수 (실선, 원형 마커)
- 오른쪽 Y축: 생산성 점수 (점선, 사각형 마커)
- 팀별로 동일한 색상 유지
- 호버 시 상세 정보 표시

### 3. 인증 및 권한 관리

#### ✅ JWT 기반 인증
- 로그인 시 토큰 발급 및 로컬 스토리지 저장
- axios 인터셉터를 통한 자동 토큰 첨부
- 토큰 만료 시 자동 로그아웃 및 로그인 페이지 리다이렉트

#### ✅ Private Route
- 인증되지 않은 사용자는 로그인 페이지로 자동 리다이렉트
- 로그인 상태 유지 (새로고침 시에도 유지)

## 📁 프로젝트 구조

```
src/
├── api/                    # API 서비스 레이어
│   ├── axios.ts           # axios 인스턴스 및 인터셉터
│   ├── authApi.ts         # 인증 API
│   ├── postApi.ts         # 게시글 API
│   ├── chartApi.ts        # 차트 데이터 API
│   └── index.ts
├── components/            # 재사용 가능한 컴포넌트
│   ├── common/           # 공통 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   └── Loading.tsx
│   └── layout/           # 레이아웃 컴포넌트
│       ├── Layout.tsx
│       ├── Navigation.tsx
│       └── PrivateRoute.tsx
├── contexts/             # Context API
│   └── AuthContext.tsx   # 인증 상태 관리
├── hooks/                # 커스텀 훅
│   ├── usePostQueries.ts # 게시글 React Query 훅
│   └── useChartQueries.ts # 차트 데이터 React Query 훅
├── pages/                # 페이지 컴포넌트
│   ├── auth/
│   │   └── LoginPage.tsx
│   ├── posts/
│   │   ├── PostListPage.tsx
│   │   ├── PostDetailPage.tsx
│   │   └── PostFormPage.tsx
│   └── visualization/
│       ├── VisualizationPage.tsx
│       └── components/
│           ├── CoffeeBrandsCharts.tsx
│           ├── WeeklyMoodCharts.tsx
│           └── CoffeeConsumptionChart.tsx
├── styles/               # 전역 스타일
│   ├── GlobalStyle.ts    # 전역 스타일
│   └── theme.ts          # 테마 정의
├── types/                # TypeScript 타입 정의
│   └── api.ts
├── utils/                # 유틸리티 함수
│   ├── constants.ts      # 상수
│   ├── storage.ts        # 로컬 스토리지 관리
│   └── validation.ts     # 유효성 검사
├── App.tsx               # 루트 컴포넌트
└── index.tsx             # 진입점
```

## 💡 주요 설계 특징

### 1. 계층화된 아키텍처
- API 레이어와 UI 레이어 분리
- 서비스 레이어에서 중앙화된 에러 처리
- 타입 안정성을 위한 TypeScript 전면 도입

### 2. 상태 관리 전략
- **전역 상태**: Context API (인증)
- **서버 상태**: React Query (캐싱, 리페칭, 낙관적 업데이트)
- **로컬 상태**: useState (폼 입력)

### 3. 에러 처리
- axios 인터셉터에서 중앙화된 에러 처리
- HTTP 상태 코드별 한글 에러 메시지 제공
- 사용자 친화적인 에러 표시

### 4. UX 개선
- 로딩 상태 표시
- 에러 메시지 명확하게 표시
- 모달을 통한 삭제 확인
- 실시간 입력 검증 및 피드백

### 5. 코드 재사용성
- 공통 컴포넌트 분리 (Button, Input, Textarea, Select)
- 커스텀 훅을 통한 로직 재사용
- styled-components를 통한 스타일 재사용

## 🎨 디자인 컨셉

- 깔끔하고 모던한 UI
- 직관적인 네비게이션
- 반응형 디자인 (모바일 지원)
- 일관된 색상 체계
- 카테고리별 색상 구분 (공지사항: 빨강, Q&A: 파랑, 자유게시판: 초록)

## 📝 API 명세

프로젝트는 다음 API를 사용합니다:
- Base URL: https://fe-hiring-rest-api.vercel.app
- Swagger 문서: https://fe-hiring-rest-api.vercel.app/docs

### 주요 엔드포인트
- `POST /auth/login` - 로그인
- `GET /posts` - 게시글 목록 조회
- `POST /posts` - 게시글 작성
- `GET /posts/:id` - 게시글 상세 조회
- `PATCH /posts/:id` - 게시글 수정
- `DELETE /posts/:id` - 게시글 삭제
- `GET /mock/top-coffee-brands` - 커피 브랜드 데이터
- `GET /mock/weekly-mood-trend` - 주간 무드 트렌드 데이터
- `GET /mock/coffee-consumption` - 커피 소비 데이터

## 🔒 보안

- JWT 토큰 기반 인증
- 로컬 스토리지에 토큰 저장
- Private Route를 통한 페이지 접근 제어
- axios 인터셉터를 통한 자동 토큰 관리
- 401 에러 시 자동 로그아웃

## 📱 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 🐛 알려진 이슈

없음

## 🔮 향후 개선 사항

- 다크 모드 지원
- 게시글 좋아요/댓글 기능
- 이미지 업로드 기능
- 무한 스크롤 페이지네이션
- 검색어 자동완성
- 모바일 최적화 개선

---

개발자: 국경훈
