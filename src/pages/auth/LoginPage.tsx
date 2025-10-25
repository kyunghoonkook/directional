import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts';
import { Button, Input } from '../../components/common';
import { DEFAULT_CREDENTIALS } from '../../utils/constants';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.backgroundGray};
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 32px;
  color: ${({ theme }) => theme.colors.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ErrorMessage = styled.div`
  padding: 12px;
  background-color: #fee;
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
  text-align: center;
`;

const InfoMessage = styled.div`
  margin-top: 16px;
  padding: 12px;
  background-color: #e3f2fd;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.5;
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState(DEFAULT_CREDENTIALS.email);
  const [password, setPassword] = useState(DEFAULT_CREDENTIALS.password);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Title>로그인</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="이메일"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Input
            type="password"
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </Form>
        <InfoMessage>
          <div><strong>테스트 계정:</strong></div>
          <div>이메일: {DEFAULT_CREDENTIALS.email}</div>
          <div>비밀번호: {DEFAULT_CREDENTIALS.password}</div>
        </InfoMessage>
      </LoginCard>
    </Container>
  );
};

export default LoginPage;

