import React from 'react';
import styled from 'styled-components';

interface TextareaProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  rows?: number;
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

const StyledTextarea = styled.textarea<{ $hasError: boolean }>`
  padding: 12px;
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
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

const Textarea: React.FC<TextareaProps> = ({
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  label,
  rows = 5,
}) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <StyledTextarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        $hasError={!!error}
        rows={rows}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default Textarea;

