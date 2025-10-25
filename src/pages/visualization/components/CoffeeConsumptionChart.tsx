import React from 'react';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useCoffeeConsumptionQuery } from '../../../hooks';
import { Loading } from '../../../components/common';

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  background-color: #fee;
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 16px;
  line-height: 1.6;
`;

// 팀별 색상
const TEAM_COLORS: { [key: string]: string } = {
  Frontend: '#3b82f6',
  Backend: '#10b981',
  AI: '#f59e0b',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // 팀별로 그룹화
    const teamData: { [key: string]: { bugs?: number; productivity?: number } } = {};
    
    payload.forEach((entry) => {
      const teamName = entry.dataKey.replace(' - 버그', '').replace(' - 생산성', '');
      if (!teamData[teamName]) {
        teamData[teamName] = {};
      }
      
      if (entry.dataKey.includes('버그')) {
        teamData[teamName].bugs = entry.value;
      } else if (entry.dataKey.includes('생산성')) {
        teamData[teamName].productivity = entry.value;
      }
    });

    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: '8px' }}>커피: {label}잔/일</p>
        {Object.entries(teamData).map(([team, data]) => (
          <div key={team} style={{ marginBottom: '8px' }}>
            <p style={{ fontWeight: 600, color: TEAM_COLORS[team] }}>{team}</p>
            {data.bugs !== undefined && <p style={{ fontSize: '12px' }}>버그 수: {data.bugs}</p>}
            {data.productivity !== undefined && (
              <p style={{ fontSize: '12px' }}>생산성: {data.productivity}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const CoffeeConsumptionChart: React.FC = () => {
  const { data, isLoading, error } = useCoffeeConsumptionQuery();

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage>{error.message}</ErrorMessage>;
  if (!data) return null;

  // 데이터 변환: 각 팀의 시리즈를 하나의 배열로 병합
  const chartData = data.teams[0].series.map((_, index) => {
    const point: any = { cups: index + 1 };
    
    data.teams.forEach((team) => {
      point[`${team.team} - 버그`] = team.series[index].bugs;
      point[`${team.team} - 생산성`] = team.series[index].productivity;
    });
    
    return point;
  });

  return (
    <ChartWrapper>
      <Description>
        왼쪽 Y축: 버그 수 (실선, 원형 마커) / 오른쪽 Y축: 생산성 점수 (점선, 사각형 마커)
        <br />
        동일한 팀은 같은 색상을 사용합니다.
      </Description>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="cups" 
            label={{ value: '커피 섭취량 (잔/일)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            yAxisId="left"
            label={{ value: '버그 수', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            label={{ value: '생산성 점수', angle: 90, position: 'insideRight' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* 각 팀의 버그 수 (실선, 원형 마커) */}
          {data.teams.map((team) => (
            <Line
              key={`${team.team}-bugs`}
              yAxisId="left"
              type="monotone"
              dataKey={`${team.team} - 버그`}
              stroke={TEAM_COLORS[team.team]}
              strokeWidth={2}
              dot={{ r: 4, fill: TEAM_COLORS[team.team] }}
              name={`${team.team} - 버그`}
            />
          ))}
          
          {/* 각 팀의 생산성 (점선, 사각형 마커) */}
          {data.teams.map((team) => (
            <Line
              key={`${team.team}-productivity`}
              yAxisId="right"
              type="monotone"
              dataKey={`${team.team} - 생산성`}
              stroke={TEAM_COLORS[team.team]}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: TEAM_COLORS[team.team] }}
              name={`${team.team} - 생산성`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default CoffeeConsumptionChart;

