import React from 'react';
import styled from 'styled-components';
import CoffeeBrandsCharts from './components/CoffeeBrandsCharts';
import WeeklyMoodCharts from './components/WeeklyMoodCharts';
import CoffeeConsumptionChart from './components/CoffeeConsumptionChart';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Section = styled.section`
  padding: 32px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.text};
`;

const VisualizationPage: React.FC = () => {
  return (
    <Container>
      <Title>데이터 시각화</Title>

      <Section>
        <SectionTitle>인기 커피 브랜드 분포</SectionTitle>
        <CoffeeBrandsCharts />
      </Section>

      <Section>
        <SectionTitle>주간 무드 트렌드</SectionTitle>
        <WeeklyMoodCharts />
      </Section>

      <Section>
        <SectionTitle>팀별 커피 소비량과 생산성</SectionTitle>
        <CoffeeConsumptionChart />
      </Section>
    </Container>
  );
};

export default VisualizationPage;

