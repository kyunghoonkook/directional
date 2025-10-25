import axiosInstance from './axios';
import { LoginRequest, LoginResponse } from '../types/api';

// 로그인
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

// Health Check
export const healthCheck = async (): Promise<void> => {
  await axiosInstance.get('/health');
};

