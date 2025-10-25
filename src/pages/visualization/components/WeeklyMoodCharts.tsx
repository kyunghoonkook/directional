import React from 'react';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useWeeklyMoodTrendQuery } from '../../../hooks';
import { Loading } from '../../../components/common';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorMessage = styled.div`
  padding: 20px;
  background-color: #fee;
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
`;

const WeeklyMoodCharts: React.FC = () => {
  const { data, isLoading, error } = useWeeklyMoodTrendQuery();

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage>{error.message}</ErrorMessage>;
  if (!data) return null;

  return (
    <Container>
      <ChartWrapper>
        <ChartTitle>스택형 바 차트</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis label={{ value: '백분율 (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="happy" stackId="a" fill="#10b981" name="행복" />
            <Bar dataKey="tired" stackId="a" fill="#f59e0b" name="피곤" />
            <Bar dataKey="stressed" stackId="a" fill="#ef4444" name="스트레스" />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper>
        <ChartTitle>스택형 면적 차트</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis label={{ value: '백분율 (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="happy"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              name="행복"
            />
            <Area
              type="monotone"
              dataKey="tired"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b"
              name="피곤"
            />
            <Area
              type="monotone"
              dataKey="stressed"
              stackId="1"
              stroke="#ef4444"
              fill="#ef4444"
              name="스트레스"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </Container>
  );
};

export default WeeklyMoodCharts;

