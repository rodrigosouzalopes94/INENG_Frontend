import React from 'react';
import styled, { css } from 'styled-components';
import { Colors } from '../../theme/colors'; // Importa suas cores

// Interface de Props
interface CardProps {
  children: React.ReactNode;
  className?: string; // Para estilização externa
  highlight?: 'primary' | 'accent'; // Prop para a borda de destaque
  paddingSize?: 'small' | 'medium' | 'large'; // Prop para controlar padding
}

// Mapeia paddingSize para valores CSS
const getPadding = (size: CardProps['paddingSize']) => {
  switch (size) {
    case 'small':
      return '12px';
    case 'large':
      return '24px';
    case 'medium':
    default:
      return '20px'; // Valor padrão
  }
};

// Componente estilizado usando apenas as cores definidas
const StyledCard = styled.div<CardProps>`
  background-color: ${Colors.white};
  border-radius: 10px;
  padding: ${props => getPadding(props.paddingSize)};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  border-left: 5px solid transparent; // Borda inicial

  /* Estilos condicionais para a BORDA baseados na prop 'highlight' */
  /* Usa apenas Colors.primary e Colors.accent que existem */
  ${props =>
    props.highlight === 'primary' &&
    css`
      border-left-color: ${Colors.primary};
    `}

  ${props =>
    props.highlight === 'accent' &&
    css`
      border-left-color: ${Colors.accent};
    `}

  /* Responsividade Interna para padding */
  @media (max-width: 600px) {
    padding: ${props => props.paddingSize === 'large' ? getPadding('medium') : getPadding('small')};
  }
`;

// Componente Card renderiza StyledCard
const Card: React.FC<CardProps> = ({
  children,
  className,
  highlight,
  paddingSize = 'medium'
}) => (
  <StyledCard
    className={className}
    highlight={highlight}
    paddingSize={paddingSize}
  >
    {children}
  </StyledCard>
);

export default Card;