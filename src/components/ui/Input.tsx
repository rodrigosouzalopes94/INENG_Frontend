// src/components/ui/Input.tsx

import React from 'react';
import { Colors } from '../../theme/colors';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, name, error, style, ...rest }) => {
    return (
        <div style={styles.container}>
            <label htmlFor={name} style={styles.label}>{label}</label>
            <input
                id={name}
                name={name}
                style={{ ...styles.input, ...style, borderColor: error ? Colors.danger : Colors.secondary }}
                {...rest}
            />
            {error && <span style={styles.errorText}>{error}</span>}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        marginBottom: '15px',
        width: '100%',
    },
    label: {
        display: 'block',
        color: Colors.text,
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '14px',
    },
    input: {
        width: 'calc(100% - 22px)',
        padding: '10px',
        border: `1px solid ${Colors.secondary}`,
        borderRadius: '5px',
        fontSize: '16px',
        boxSizing: 'border-box', // Garante que padding não afete a largura total
    },
    errorText: {
        color: Colors.danger,
        fontSize: '12px',
        marginTop: '3px',
        display: 'block',
    },
};

export default Input;