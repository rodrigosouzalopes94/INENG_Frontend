import React from 'react';
import styled, { css } from 'styled-components'; // Importa styled e css helper
import { Colors } from '../../theme/colors';

// 1. Atualiza ButtonVariant para incluir as variantes usadas no ClienteForm/Page
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';

// Interface de Props: Estende atributos HTML, inclui variantes e loading
// Removemos 'style', pois styled-components lida com isso via 'className'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  loading?: boolean;
  // 'disabled', 'onClick', 'type' etc., vêm de React.ButtonHTMLAttributes
}

// 2. Define o componente estilizado <StyledButton>
const StyledButton = styled.button<Omit<ButtonProps, 'title'>>` // Omit 'title' se não for usada no estilo
  /* --- Estilos Base --- */
  padding: 10px 20px;
  border-radius: 8px;
  display: inline-flex; /* Usar inline-flex para alinhar com outros elementos se necessário */
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s, opacity 0.2s, border-color 0.2s;
  border: 1px solid transparent; // Borda base transparente para consistência
  line-height: 1.2; // Ajuda no alinhamento vertical
  white-space: nowrap; // Evita quebra de linha no texto

  /* --- Estilos de Variantes (usando props) --- */

  /* Variante Primária (Accent/Laranja) */
  ${({ variant }) =>
    (variant === 'primary' || variant === 'accent') && // Inclui 'accent' como primária
    css`
      background-color: ${Colors.accent};
      color: ${Colors.white};
      &:hover {
        background-color: #d35400; // Tom mais escuro de laranja para hover
      }
    `}

  /* Variante Secundária (Primary/Chumbo) */
  ${({ variant }) =>
    variant === 'secondary' &&
    css`
      background-color: ${Colors.primary};
      color: ${Colors.white};
      &:hover {
        background-color: #1a252f; // Tom mais escuro de chumbo para hover
      }
    `}

  /* Variante Ghost */
  ${({ variant }) =>
    variant === 'ghost' &&
    css`
      background-color: transparent;
      color: ${Colors.primary};
      border-color: ${Colors.primary}; // Usa border-color
      &:hover {
        background-color: rgba(44, 62, 80, 0.05); // Fundo leve no hover
      }
    `}

   /* Variante Danger (Vermelho) */
  ${({ variant }) =>
    variant === 'danger' &&
    css`
      background-color: ${Colors.danger};
      color: ${Colors.white};
      &:hover {
        background-color: #c0392b; // Tom mais escuro de vermelho para hover
      }
    `}

  /* --- Estilos de Estado (Disabled / Loading) --- */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${ ({ variant }) => { // Mantém cor de fundo base, mas com opacidade
        if (variant === 'primary' || variant === 'accent') return Colors.accent;
        if (variant === 'secondary') return Colors.primary;
        if (variant === 'danger') return Colors.danger;
        return Colors.secondary; // Cor fallback para disabled
    }};
    border-color: transparent; // Remove borda no disabled ghost
    color: ${Colors.white}; // Garante cor do texto no disabled

     /* Se for ghost, muda a cor do texto e borda */
     ${({ variant }) =>
        variant === 'ghost' &&
        css`
            background-color: transparent;
            color: ${Colors.secondary};
            border-color: ${Colors.secondary};
        `}
  }

  /* Opcional: Estilo específico para loading (ex: cursor) */
  ${({ loading }) =>
    loading &&
    css`
      cursor: wait;
    `}
`;

// 3. Componente Button renderiza StyledButton e lida com conteúdo dinâmico
const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary', // Define 'primary' como padrão
  icon,
  loading,
  disabled,
  children, // Adiciona children se quiser passar algo além de title/icon
  ...rest // Repassa outras props HTML (onClick, type, etc.)
}) => {
  const isDisabled = disabled || loading;

  return (
    <StyledButton
      variant={variant}
      disabled={isDisabled}
      loading={loading} // Passa loading para estilização condicional se necessário
      {...rest} // Repassa onClick, type, etc.
    >
      {/* Mostra 'Carregando...' ou o título/children */}
      {loading ? 'Carregando...' : (children || title)}
      {/* Renderiza o ícone se ele for passado */}
      {!loading && icon}
    </StyledButton>
  );
};

export default Button;