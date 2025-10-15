// src/components/ui/Button.tsx

import React from 'react';
import { Colors } from '../../theme/colors';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

// ✅ CORREÇÃO: Estende as props nativas do botão HTML
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    // Omitimos o 'onClick' e 'disabled' aqui porque eles já estão em ButtonHTMLAttributes,
    // mas os mantemos se o usuário precisar de uma tipagem mais rigorosa.
    variant?: ButtonVariant;
    icon?: React.ReactNode;
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', icon, loading, disabled, style, ...rest }) => {
    
    // A propriedade `type="submit"` e outras props nativas são aceitas via `...rest`
    // e tipificadas pela herança de React.ButtonHTMLAttributes.

    const baseStyle: React.CSSProperties = {
        padding: '10px 20px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Adicionei para centralizar melhor o texto/ícone
        gap: '8px',
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'all 0.2s',
        border: 'none',
        opacity: disabled || loading ? 0.6 : 1, // Controla opacidade do disabled
    };

    const variants: Record<string, React.CSSProperties> = {
        primary: {
            backgroundColor: Colors.accent,
            color: Colors.white,
        },
        secondary: {
            backgroundColor: Colors.primary, // Usando a cor primary (Chumbo) para secondary
            color: Colors.white,
        },
        ghost: {
            backgroundColor: 'transparent',
            color: Colors.primary,
            border: `1px solid ${Colors.primary}`, // Adicionado borda para melhor visibilidade
        },
    };

    return (
        <button
            style={{ ...baseStyle, ...variants[variant], ...style }} // Inclui o style passado por props
            disabled={disabled || loading} // Usa a prop 'disabled' e 'loading'
            // O ...rest inclui 'onClick', 'type="submit"', 'className', etc.
            {...rest} 
            onMouseEnter={(e) => (e.currentTarget.style.opacity = disabled || loading ? '0.6' : '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = disabled || loading ? '0.6' : '1')}
        >
            {loading ? 'Carregando...' : title}
            {icon}
        </button>
    );
};

export default Button;