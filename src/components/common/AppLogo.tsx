// src/components/common/AppLogo.tsx

import React from 'react';
import { AiOutlineSetting } from 'react-icons/ai'; // Ícone de engrenagem
import { Colors } from '../../theme/colors';

const AppLogo: React.FC = () => {
    return (
        <div style={styles.logoContainer}>
            {/* Ícone grande e destacado */}
            <AiOutlineSetting size={60} color={Colors.accent} style={{ marginBottom: 10 }} />

            {/* Nome da aplicação */}
            <h1 style={styles.logoText}>INENG</h1>

            {/* Subtítulo / slogan */}
            <p style={styles.logoSubtitle}>Inova Engenharia</p>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    logoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px',
        textAlign: 'center',
    },
    logoText: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: Colors.primary,
        margin: '0',
    },
    logoSubtitle: {
        fontSize: '14px',
        color: Colors.secondary,
        margin: '4px 0 0 0',
    },
};

export default AppLogo;
