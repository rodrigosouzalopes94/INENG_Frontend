import React from 'react';
import { Colors } from '../../theme/colors';

interface ButtonProps {
  title: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onClick, variant = 'primary', icon, loading }) => {
  const baseStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s',
    border: 'none',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: Colors.accent,
      color: Colors.white,
    },
    secondary: {
      backgroundColor: Colors.secondary,
      color: Colors.white,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: Colors.primary,
    },
  };

  return (
    <button
      style={{ ...baseStyle, ...variants[variant] }}
      onClick={onClick}
      disabled={loading}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
    >
      {icon}
      {loading ? 'Carregando...' : title}
    </button>
  );
};

export default Button;
