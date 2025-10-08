// src/components/ui/Card.tsx

import React from 'react';
import { Colors } from '../../theme/colors';

interface CardProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, style }) => {
    return (
        <div style={{ ...styles.card, ...style }}>
            {children}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    card: {
        width: '100%',
        maxWidth: '500px',
        padding: '30px',
        backgroundColor: Colors.white,
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
};

export default Card;