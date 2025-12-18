import React, { type InputHTMLAttributes, ReactNode } from 'react'; // Import ReactNode
import styled from 'styled-components';
import { Colors } from '../../theme/colors';

// Interface atualizada para incluir iconEnd
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  iconEnd?: ReactNode; // Nova prop para o ícone no final
}

// Styled Components
const InputWrapper = styled.div`
  display: flex;
  // flex-direction: column;
  width: 100%;
  // margin-bottom: 15px;
  position: relative; /* Necessário para posicionar o ícone */
`;

const StyledLabel = styled.label`
  margin-bottom: 5px;
  margin-right: 10px;
  font-weight: 500;
  color: ${Colors.text};
  font-size: 0.9em;
`;

// Input ajustado para ter padding-right se houver ícone
const StyledInput = styled.input<{ error?: string; hasIconEnd?: boolean }>`
  padding: 10px 15px;
  /* Adiciona padding extra à direita se houver ícone */
  padding-right: ${props => props.hasIconEnd ? '40px' : '15px'};
  border-radius: 8px;
  border: 1px solid ${props => (props.error ? Colors.danger : Colors.secondary)};
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
  color: ${Colors.text};
  background-color: ${Colors.white};
  font-size: 1em;

  &:focus {
    border-color: ${props => (props.error ? Colors.danger : Colors.accent)};
    box-shadow: 0 0 0 2px ${props => (props.error ? 'rgba(231, 76, 60, 0.2)' : 'rgba(230, 126, 34, 0.2)')};
  }

  &:disabled {
    background-color: ${Colors.background};
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::placeholder {
    color: ${Colors.secondary};
    opacity: 0.8;
  }
`;

// Wrapper para posicionar o ícone
const IconWrapper = styled.div`
  position: absolute;
  right: 10px;
  top: 9px; /* Ajuste conforme necessário para alinhar com o input */
  /* Ajuste fino da posição vertical dependendo da altura do input/label */
  /* Você pode usar transform: translateY(-50%) e top: 50% + (altura_label / 2) */
  height: 24px; // Altura do ícone
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${Colors.secondary};

  &:hover {
    color: ${Colors.primary};
  }

  /* Ajusta o 'top' se o label for menor */
  ${StyledLabel} + & {
     /* Exemplo: Se o label tiver ~20px + 5px margin */
     top: calc( (20px + 5px) + (44px / 2) - (24px / 2) ); /* (AlturaLabel+Margin) + (AlturaInput/2) - (AlturaIcone/2) */
     /* Ajuste 44px se a altura do seu input for diferente */
  }

`;

const ErrorMessage = styled.span`
  color: ${Colors.danger};
  font-size: 0.8em;
  margin-top: 4px;
  min-height: 1.2em;
`;

// Componente Input atualizado
const Input: React.FC<InputProps> = ({
  label,
  error,
  iconEnd, // Recebe a nova prop
  id,
  name,
  type = 'text',
  ...rest
}) => {
  const inputId = id || `input-${name || label.replace(/\s+/g, '-')}`;

  return (
    <InputWrapper>
      <StyledLabel htmlFor={inputId}>{label}</StyledLabel>
      <StyledInput
        id={inputId}
        name={name}
        type={type}
        error={error}
        hasIconEnd={!!iconEnd} // Passa para o styled component se o ícone existe
        {...rest}
      />
      {/* Renderiza o ícone dentro do wrapper posicionado */}
      {iconEnd && <IconWrapper>{iconEnd}</IconWrapper>}
      <ErrorMessage>{error || ''}</ErrorMessage>
    </InputWrapper>
  );
};

export default Input;