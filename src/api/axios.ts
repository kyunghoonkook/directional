import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getToken, clearAuth } from '../utils/storage';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 인증 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // 에러 처리
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      // 401 에러 - 인증 실패
      if (status === 401) {
        // 로그인 페이지가 아닐 경우만 토큰 제거 및 리다이렉트
        if (!window.location.pathname.includes('/login')) {
          clearAuth();
          window.location.href = '/login';
        }
        return Promise.reject(new Error('인증이 만료되었습니다. 다시 로그인해주세요.'));
      }

      // 400 에러 - 잘못된 요청
      if (status === 400) {
        const message = data?.message || '잘못된 요청입니다.';
        return Promise.reject(new Error(message));
      }

      // 404 에러 - 리소스를 찾을 수 없음
      if (status === 404) {
        return Promise.reject(new Error('요청한 데이터를 찾을 수 없습니다.'));
      }

      // 500 에러 - 서버 오류
      if (status >= 500) {
        return Promise.reject(new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'));
      }

      // 기타 에러
      return Promise.reject(new Error(data?.message || '알 수 없는 오류가 발생했습니다.'));
    }

    // 네트워크 에러
    if (error.request) {
      return Promise.reject(new Error('네트워크 연결을 확인해주세요.'));
    }

    // 기타 에러
    return Promise.reject(new Error(error.message || '알 수 없는 오류가 발생했습니다.'));
  }
);

export default axiosInstance;

