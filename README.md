# 게시판 & 데이터 시각화 프로젝트

React와 TypeScript를 사용한 게시판 CRUD와 데이터 시각화 구현 과제입니다.

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

- 이메일: `rnrrudgg6620@naver.com`
- 비밀번호: `f8VtM1hRc5`

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

## 📋 주요 구현 기능

### 1. 게시판 기능
- CRUD (작성, 조회, 수정, 삭제)
- 검색 (제목/본문)
- 커서 기반 페이지네이션
- 정렬 (작성일/제목, 오름차순/내림차순)
- 카테고리 필터
- 금칙어 필터
- 태그 기능

### 2. 데이터 시각화
- 바 차트 / 도넛 차트
- 스택형 바 차트 / 스택형 면적 차트
- 멀티라인 차트 (이중 Y축)

### 3. 인증 및 권한 관리
- JWT 기반 인증
- Private Route

## 📁 프로젝트 구조

```
src/
├── api/              # API 서비스 (axios 설정, 인증/게시글/차트 API)
├── components/       # 재사용 컴포넌트 (Button, Input 등)
├── contexts/         # Context API (인증 상태)
├── hooks/           # 커스텀 훅 (React Query)
├── pages/           # 페이지 (로그인, 게시판, 시각화)
├── styles/          # 전역 스타일 및 테마
├── types/           # TypeScript 타입 정의
└── utils/           # 유틸리티 (상수, 검증, 스토리지)
```

---

## 🧩 구현 과정 메모

### 프로젝트 초기 설정

- **CRA로 TypeScript 프로젝트 생성** ⭕
  
  폴더 이름에 대문자가 들어가서 npm naming 에러가 발생해서 임시 폴더에 생성 후 파일을 옮기는 방식으로 해결했다.

- **프로젝트 폴더 구조 설계** ⭕
  
  계층화된 구조로 만들기 위해 api, components, contexts, hooks, pages, styles, types, utils로 나눴다.
  특히 pages 폴더 안에는 auth, posts, visualization으로 기능별로 분리해서 관리하기 쉽게 구성했다.

### API 및 상태 관리 구현

- **axios 인스턴스 설정 및 인터셉터 구현** ⭕
  
  인터셉터를 사용해서 모든 요청에 자동으로 JWT 토큰을 헤더에 추가하도록 했다.
  에러 처리도 한 곳에서 관리하려고 응답 인터셉터에 HTTP 상태 코드별로 한글 에러 메시지를 반환하게 구현했다.
  401 에러가 발생하면 자동으로 로그아웃하고 로그인 페이지로 리다이렉트되도록 처리했다.

  ```typescript
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }
  );
  ```

- **Context API로 인증 상태 관리** ⭕
  
  전역 인증 상태를 관리하기 위해 Context API를 사용했다.
  로컬 스토리지에 토큰과 사용자 정보를 저장해서 새로고침해도 로그인 상태가 유지되도록 구현했다.
  처음에는 useEffect에서 로컬 스토리지를 읽어올 때 타이밍 이슈가 있었는데, isLoading 상태를 추가해서 해결했다.

- **React Query 설정 및 커스텀 훅** ⭕
  
  서버 상태 관리를 위해 React Query를 도입했다.
  Query Keys를 계층적으로 관리해서 캐시 무효화를 효율적으로 할 수 있게 구성했다.
  
  ```typescript
  export const postKeys = {
    all: ['posts'] as const,
    lists: () => [...postKeys.all, 'list'] as const,
    list: (params?: PostListParams) => [...postKeys.lists(), params] as const,
    details: () => [...postKeys.all, 'detail'] as const,
    detail: (id: string) => [...postKeys.details(), id] as const,
  };
  ```

### 게시판 구현

- **게시글 목록 페이지 - 검색, 필터, 정렬** ⭕
  
  커서 기반 페이지네이션을 처음 구현해봤는데, 일반 offset 페이지네이션보다 복잡했다.
  prevCursor와 nextCursor를 상태로 관리하고, 검색이나 필터 변경 시 커서를 초기화해야 했다.
  
  검색어 입력마다 API 호출하는 게 비효율적일 것 같아서 debounce를 적용하려 했는데, 

- **금칙어 필터 구현** ⭕
  
  금칙어 체크 함수를 utils에 만들어서 재사용할 수 있게 했다.
  제목과 본문 둘 다 체크하고, 어떤 금칙어가 포함됐는지 정확히 알려주도록 구현했다.
  
  ```typescript
  export const checkForbiddenWords = (text: string): string | null => {
    const lowerText = text.toLowerCase();
    for (const word of FORBIDDEN_WORDS) {
      if (lowerText.includes(word.toLowerCase())) {
        return word;
      }
    }
    return null;
  };
  ```

- **태그 입력 UI** ⭕
  
  태그를 입력하고 Enter를 누르면 추가되도록 onKeyPress 이벤트를 사용했다.
  처음에는 Input 컴포넌트에 onKeyPress props가 없어서 타입 에러가 났는데, 
  인터페이스에 추가해서 해결했다.
  
  중복 태그 체크, 최대 5개 제한, 24자 제한 등 여러 검증 로직이 들어가다 보니 
  코드가 좀 길어졌는데, 나중에 커스텀 훅으로 분리하면 좋을 것 같다.

### 데이터 시각화 구현

- **Recharts 라이브러리 선택** ⭕
  
  차트 라이브러리로 Recharts를 선택한 이유는 React 친화적이고 사용법이 직관적이기 때문이다.
  TypeScript 타입 지원도 잘 되어 있어서 개발 경험이 좋았다.

- **바 차트 / 도넛 차트** ⭕
  
  TopCoffeeBrands API에서 받은 데이터를 바 차트와 도넛 차트 두 가지로 표현했다.
  도넛 차트의 innerRadius를 설정해서 중앙이 비어있는 모양으로 만들었다.
  
  처음에 TypeScript 타입 에러가 났는데, Recharts의 타입 정의가 엄격해서 `as any`로 우회했다.
  실무에서는 이렇게 하면 안 되겠지만, 시간 관계상 일단 진행했다.

- **스택형 바 차트 / 스택형 면적 차트** ⭕
  
  주간 무드 트렌드 데이터를 누적(Stack) 형태로 표현했다.
  Bar 컴포넌트에 stackId를 동일하게 주면 자동으로 쌓이는 게 신기했다.
  
  백분율로 표시하기 위해 Y축에 label을 추가하고, 각 감정별로 색상을 다르게 지정했다.

- **멀티라인 차트 (이중 Y축)** ⭕
  
  이 부분이 가장 까다로웠다. 
  - 왼쪽 Y축: 버그 수 (실선, 원형 마커)
  - 오른쪽 Y축: 생산성 (점선, 사각형 마커)
  - 같은 팀은 같은 색상
  - 호버 시 해당 커피 잔수의 모든 팀 데이터 표시
  
  데이터 구조를 변환하는 부분에서 시간이 좀 걸렸다.
  각 팀의 series를 하나의 배열로 병합해야 했는데, cups 값을 기준으로 재구성했다.
  
  ```typescript
  const chartData = data.teams[0].series.map((_, index) => {
    const point: any = { cups: index + 1 };
    data.teams.forEach((team) => {
      point[`${team.team} - 버그`] = team.series[index].bugs;
      point[`${team.team} - 생산성`] = team.series[index].productivity;
    });
    return point;
  });
  ```
  
  커스텀 툴팁을 만들어서 호버 시 깔끔하게 정보를 표시하도록 했다.
  사각형 마커를 만들려고 했는데 Recharts에서 shape prop을 지원하지 않아서 그냥 원형으로 통일했다.

### 스타일링

- **styled-components 테마 설정** ⭕
  
  전역 테마를 만들어서 색상, 그림자, border-radius 등을 일관되게 관리했다.
  카테고리별 색상(공지사항: 빨강, Q&A: 파랑, 자유게시판: 초록)도 테마에 정의해서 재사용했다.
  
  처음에 TypeScript에서 테마 타입 에러가 났는데, styled.d.ts 파일을 만들어서 
  DefaultTheme 인터페이스를 확장해서 해결했다.

- **공통 컴포넌트 제작** ⭕
  
  Button, Input, Textarea, Select, Loading 등 재사용 가능한 컴포넌트를 만들었다.
  각 컴포넌트마다 error, disabled 등의 상태를 props로 받아서 처리하도록 구현했다.

### 라우팅 및 권한 관리

- **Private Route 구현** ⭕
  
  인증되지 않은 사용자가 보호된 페이지에 접근하면 로그인 페이지로 리다이렉트하도록 했다.
  isLoading 상태를 확인해서 로그인 상태를 확인하는 동안 로딩 화면을 보여주도록 구현했다.

---

## ⛏ 구현 중 겪었던 주요 이슈

### TypeScript 타입 에러 해결

**문제점**

빌드 시 styled-components의 theme 관련 타입 에러가 대량으로 발생했다.
```
Property 'colors' does not exist on type 'DefaultTheme'.
```

**시도한 방법**
1. inline으로 theme 객체를 직접 참조 → 가독성이 너무 떨어짐
2. 타입 단언 사용 → 근본적인 해결이 아님
3. styled.d.ts 파일 생성하여 DefaultTheme 확장 → 해결!

**해결 방법**

styled-components의 DefaultTheme 인터페이스를 확장하는 타입 정의 파일을 생성했다.

```typescript
// src/styles/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      // ... 기타 색상들
    };
    shadows: { ... };
    borderRadius: { ... };
  }
}
```

### Recharts 타입 이슈

**문제점**

TopCoffeeBrandsResponse 타입이 Recharts의 ChartDataInput[] 타입과 호환되지 않았다.
```
Type 'TopCoffeeBrandsResponse' is not assignable to type 'ChartDataInput[]'.
```

**해결 방법**

Recharts 타입 정의가 굉장히 엄격해서 `as any`로 타입 단언을 사용했다.
실무에서는 좋은 방법은 아니지만, 과제 제출 시간이 촉박해서 우선 진행했다.

```typescript
<BarChart data={data as any}>
```

### 커서 기반 페이지네이션 구현

**문제점**

처음 커서 기반 페이지네이션을 구현해보는 거라 어떻게 상태를 관리해야 할지 막막했다.
검색이나 필터를 바꿀 때 커서를 초기화해야 하는데, 이 부분을 놓쳐서 버그가 발생했다.

**해결 방법**

검색어나 필터가 변경될 때마다 nextCursor와 prevCursor를 undefined로 초기화하도록 했다.

```typescript
const handleCategoryChange = (category: string) => {
  setParams((prev) => ({
    ...prev,
    category: category === 'ALL' ? undefined : (category as Category),
    nextCursor: undefined,  // 커서 초기화
    prevCursor: undefined,
  }));
};
```

### Input 컴포넌트에 onKeyPress 추가

**문제점**

태그 입력 시 Enter로 추가하는 기능을 만들려고 했는데, Input 컴포넌트에 onKeyPress props가 없어서 에러가 발생했다.

**해결 방법**

InputProps 인터페이스에 onKeyPress를 선택적(optional) prop으로 추가했다.

```typescript
interface InputProps {
  // ... 기존 props들
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
```

---

## 🛠 개발하면서 느낀 점

### 타입스크립트의 중요성

처음에는 타입 에러 때문에 시간이 많이 걸렸는데, 나중에는 오히려 타입스크립트 덕분에 
버그를 사전에 많이 잡을 수 있었다. 특히 API 응답 타입을 정확히 정의해두니 
자동완성도 잘 되고 실수할 여지가 줄어들었다.

### React Query의 강력함

서버 상태 관리를 React Query로 하니까 캐싱, 리페칭, 에러 처리 등이 너무 편했다.
특히 mutation 후 자동으로 쿼리를 무효화시키는 기능이 정말 유용했다.

```typescript
const createMutation = useCreatePostMutation();

// mutation 성공 시 자동으로 목록 쿼리 무효화
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: postKeys.lists() });
}
```

### 컴포넌트 설계의 중요성

처음에는 급하게 만들다 보니 컴포넌트가 너무 커졌는데, 
나중에 재사용하려고 보니 결합도가 높아서 분리하기 힘들었다.
처음부터 작은 단위로 나누고, 각 컴포넌트가 하나의 책임만 갖도록 설계하는 게 중요하다는 걸 느꼈다.

---

## 💊 추가로 개선하고 싶은 부분

### 1. 테스트 코드 작성

시간 관계상 테스트 코드를 작성하지 못했는데, 실무에서는 필수라고 생각한다.
특히 유틸리티 함수(금칙어 체크, 유효성 검사 등)는 테스트하기 좋은 순수 함수들이라 
Jest로 단위 테스트를 작성하면 좋을 것 같다.

### 2. 에러 바운더리 추가

현재는 각 컴포넌트에서 에러를 처리하고 있는데, 
예상치 못한 에러를 잡아내기 위해 Error Boundary를 추가하면 좋겠다.

### 3. 성능 최적화

- 검색어 입력 시 debounce 적용
- React.memo를 활용한 불필요한 리렌더링 방지
- 이미지 lazy loading
- 코드 스플리팅

### 4. 접근성 개선

- 키보드 네비게이션 지원
- ARIA 속성 추가
- 스크린 리더 대응

### 5. 반응형 디자인 강화

현재는 기본적인 반응형만 구현했는데, 
모바일 환경에서 더 최적화된 UI를 제공하면 좋겠다.

### 6. 차트 인터랙션 강화

- 차트 줌인/줌아웃 기능
- 데이터 포인트 클릭 시 상세 정보 표시
- 범례 클릭으로 데이터 시리즈 토글

---

## 📝 배운 점 정리

### 기술적인 부분

1. **커서 기반 페이지네이션**: offset 방식보다 구현이 복잡하지만, 대용량 데이터에서는 더 효율적이라는 걸 알게 됨
2. **React Query의 강력함**: 서버 상태 관리가 이렇게 편할 수 있다는 걸 체감
3. **TypeScript의 장점**: 처음엔 불편했지만, 타입 안정성 덕분에 런타임 에러가 많이 줄어듦
4. **styled-components 테마**: 테마를 잘 설계하면 일관된 디자인 시스템을 유지하기 쉬움

### 설계적인 부분

1. **계층화의 중요성**: API, 컴포넌트, 페이지를 명확히 분리하니 유지보수가 쉬워짐
2. **재사용 가능한 컴포넌트**: 처음부터 재사용을 고려해서 설계하는 게 중요
3. **중앙화된 에러 처리**: axios 인터셉터로 한 곳에서 에러를 관리하니 코드가 깔끔해짐
4. **타입 정의의 중요성**: API 응답 타입을 명확히 정의하면 개발 경험이 훨씬 좋아짐

---

개발자: 국경훈
