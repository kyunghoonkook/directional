import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts';

const Nav = styled.nav`
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserEmail = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #475569;
  }
`;

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">게시판</Logo>
        <NavLinks>
          <NavLink to="/posts">게시글 목록</NavLink>
          <NavLink to="/visualization">데이터 시각화</NavLink>
          <UserInfo>
            {user && <UserEmail>{user.email}</UserEmail>}
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          </UserInfo>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navigation;

