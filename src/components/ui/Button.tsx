// src/components/ui/Button.tsx

import React from 'react';
import { Colors } from '../../theme/colors';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    variant?: ButtonVariant;
    loading?: boolean;
}

const getBackgroundColor = (variant: ButtonVariant) => {
    switch (variant) {
        case 'primary':
            return Colors.accent; // Laranja
        case 'secondary':
            return Colors.primary; // Chumbo
        case 'danger':
            return Colors.danger; // Vermelho
        default:
            return Colors.accent;
    }
};

const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', loading = false, style, disabled, ...rest }) => {
    const bgColor = getBackgroundColor(variant);

    return (
        <button
            style={{
                ...styles.button,
                ...style,
                backgroundColor: bgColor,
                opacity: disabled || loading ? 0.7 : 1,
            }}
            disabled={disabled || loading}
            {...rest}
        >
            {loading ? 'Carregando...' : title}
        </button>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    button: {
        width: '100%',
        padding: '12px',
        marginTop: '10px',
        color: Colors.white,
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'opacity 0.3s',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
};

export default Button;