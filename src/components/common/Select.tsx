import React from 'react';
import styled from 'styled-components';

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
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

const StyledSelect = styled.select`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundGray};
    cursor: not-allowed;
  }
`;

const Select: React.FC<SelectProps> = ({ value, onChange, options, disabled = false, label }) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <StyledSelect value={value} onChange={onChange} disabled={disabled}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
    </Container>
  );
};

export default Select;

