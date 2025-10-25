// 공통 타입
export type Category = 'NOTICE' | 'QNA' | 'FREE';
export type SortField = 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';

// User 타입
export interface User {
  id: string;
  email: string;
}

// Post 타입
export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: Category;
  tags: string[];
  createdAt: string;
}

// 로그인 요청/응답
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// 게시글 생성 요청
export interface PostCreateRequest {
  title: string;
  body: string;
  category: Category;
  tags?: string[];
}

// 게시글 수정 요청
export interface PostUpdateRequest {
  title?: string;
  body?: string;
  category?: Category;
  tags?: string[];
}

// 게시글 목록 조회 파라미터
export interface PostListParams {
  limit?: number;
  prevCursor?: string;
  nextCursor?: string;
  sort?: SortField;
  order?: SortOrder;
  category?: Category;
  from?: string;
  to?: string;
  search?: string;
}

// 게시글 목록 응답
export interface PostListResponse {
  items: Post[];
  nextCursor: string | null;
  prevCursor?: string | null;
}

// 삭제 응답
export interface DeleteResponse {
  ok: boolean;
  deleted: number;
}

// 차트 데이터 타입
export interface CoffeeDataPoint {
  cups: number;
  bugs: number;
  productivity: number;
}

export interface CoffeeTeam {
  team: string;
  series: CoffeeDataPoint[];
}

export interface CoffeeConsumptionResponse {
  teams: CoffeeTeam[];
}

export interface WeeklyMoodItem {
  week: string;
  happy: number;
  tired: number;
  stressed: number;
}

export type WeeklyMoodTrendResponse = WeeklyMoodItem[];

export interface TopCoffeeBrandItem {
  brand: string;
  popularity: number;
}

export type TopCoffeeBrandsResponse = TopCoffeeBrandItem[];

