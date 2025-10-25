import React from 'react';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTopCoffeeBrandsQuery } from '../../../hooks';
import { Loading } from '../../../components/common';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const CoffeeBrandsCharts: React.FC = () => {
  const { data, isLoading, error } = useTopCoffeeBrandsQuery();

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage>{error.message}</ErrorMessage>;
  if (!data) return null;

  return (
    <Container>
      <ChartWrapper>
        <ChartTitle>바 차트</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data as any}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brand" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="popularity" fill="#3b82f6" name="인기도" />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper>
        <ChartTitle>도넛 차트</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data as any}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="popularity"
              label={(entry: any) => `${entry.brand}: ${entry.popularity}%`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </Container>
  );
};

export default CoffeeBrandsCharts;

