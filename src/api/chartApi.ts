import axiosInstance from './axios';
import {
  CoffeeConsumptionResponse,
  WeeklyMoodTrendResponse,
  TopCoffeeBrandsResponse,
} from '../types/api';

// 커피 소비 데이터 조회
export const getCoffeeConsumption = async (): Promise<CoffeeConsumptionResponse> => {
  const response = await axiosInstance.get<CoffeeConsumptionResponse>('/mock/coffee-consumption');
  return response.data;
};

// 주간 무드 트렌드 조회
export const getWeeklyMoodTrend = async (): Promise<WeeklyMoodTrendResponse> => {
  const response = await axiosInstance.get<WeeklyMoodTrendResponse>('/mock/weekly-mood-trend');
  return response.data;
};

// 인기 커피 브랜드 조회
export const getTopCoffeeBrands = async (): Promise<TopCoffeeBrandsResponse> => {
  const response = await axiosInstance.get<TopCoffeeBrandsResponse>('/mock/top-coffee-brands');
  return response.data;
};

