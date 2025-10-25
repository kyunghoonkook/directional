// API Base URL
export const API_BASE_URL = 'https://fe-hiring-rest-api.vercel.app';

// 로컬 스토리지 키
export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user_info';

// 금칙어 목록
export const FORBIDDEN_WORDS = ['캄보디아', '프놈펜', '불법체류', '텔레그램'];

// 페이지네이션 기본 값
export const DEFAULT_PAGE_LIMIT = 10;

// 카테고리 한글 이름
export const CATEGORY_LABELS: Record<string, string> = {
  NOTICE: '공지사항',
  QNA: '질문답변',
  FREE: '자유게시판',
};

// 로그인 기본 계정 정보 (API 문서 참고)
export const DEFAULT_CREDENTIALS = {
  email: 'alice@example.com',
  password: 'alice1234',
};

