// src/components/common/AppLogo.tsx

import React from 'react';
import { AiOutlineSetting } from 'react-icons/ai'; // Ícone de Engrenagem do AntDesign
import { Colors } from '../../theme/colors';

const AppLogo: React.FC = () => {
    return (
        <div style={styles.logoContainer}>
            {/* Ícone de Engrenagem */}
            <AiOutlineSetting size={80} color={Colors.primary} /> 

            <h1 style={styles.logoText}>INENG</h1>
            <p style={styles.logoSubtitle}>Inova Engenharia</p>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    logoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
        textAlign: 'center',
    },
    logoText: {
        fontSize: '40px',
        fontWeight: 'bold',
        color: Colors.primary,
        margin: '5px 0 0 0',
    },
    logoSubtitle: {
        fontSize: '16px',
        color: Colors.text,
        margin: '0',
    },
};

export default AppLogo;