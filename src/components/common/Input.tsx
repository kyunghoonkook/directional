import React from 'react';
import styled from 'styled-components';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const StyledInput = styled.input<{ $hasError: boolean }>`
  padding: 12px;
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.primary)};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundGray};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
`;

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onKeyPress,
  disabled = false,
  error,
  label,
}) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        disabled={disabled}
        $hasError={!!error}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default Input;

