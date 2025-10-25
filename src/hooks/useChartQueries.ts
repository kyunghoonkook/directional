import { useQuery } from '@tanstack/react-query';
import {
  getCoffeeConsumption,
  getWeeklyMoodTrend,
  getTopCoffeeBrands,
} from '../api';

// Query Keys
export const chartKeys = {
  all: ['charts'] as const,
  coffeeConsumption: () => [...chartKeys.all, 'coffee-consumption'] as const,
  weeklyMood: () => [...chartKeys.all, 'weekly-mood'] as const,
  topBrands: () => [...chartKeys.all, 'top-brands'] as const,
};

// 커피 소비 데이터 조회
export const useCoffeeConsumptionQuery = () => {
  return useQuery({
    queryKey: chartKeys.coffeeConsumption(),
    queryFn: getCoffeeConsumption,
    staleTime: Infinity, // Mock 데이터는 변경되지 않으므로 무한대로 설정
  });
};

// 주간 무드 트렌드 조회
export const useWeeklyMoodTrendQuery = () => {
  return useQuery({
    queryKey: chartKeys.weeklyMood(),
    queryFn: getWeeklyMoodTrend,
    staleTime: Infinity,
  });
};

// 인기 커피 브랜드 조회
export const useTopCoffeeBrandsQuery = () => {
  return useQuery({
    queryKey: chartKeys.topBrands(),
    queryFn: getTopCoffeeBrands,
    staleTime: Infinity,
  });
};

