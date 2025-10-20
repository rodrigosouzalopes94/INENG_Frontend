// src/pages/NotFoundPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineQuestionCircle } from 'react-icons/ai'; // Ícone de "Dúvida"

import DashboardLayout from '../components/ui/DashboardLayout';
import Button from '../components/ui/Button';
import { Colors } from '../theme/colors';
import { useAuthContext } from '../context/AuthContext';

// Copiamos os menuItems de outra página para manter o layout consistente
const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Obras', path: '/obras' },
    { label: 'Equipamentos', path: '/equipamentos' },
    { label: 'Funcionários', path: '/funcionarios', allowedRoles: ['GESTOR', 'ADMIN'] },
];

const NotFoundPage: React.FC = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    
    const userRole: 'GESTOR' | 'ADMIN' = user?.role === 'ADMIN' ? 'ADMIN' : 'GESTOR';

    const handleGoHome = () => {
        navigate('/dashboard');
    };

    return (
        <DashboardLayout menuItems={menuItems} userRole={userRole}>
            <div style={styles.container}>
                <AiOutlineQuestionCircle size={70} color={Colors.accent} />
                
                <h1 style={styles.title}>Página Não Encontrada (404)</h1>
                
                <p style={styles.message}>
                    O endereço que você está tentando acessar não existe ou foi removido.
                    Verifique se a URL está correta.
                </p>
                
                <Button 
                    title="Ir para o Dashboard" 
                    variant="primary" 
                    onClick={handleGoHome} 
                    style={{ marginTop: 20 }}
                />
            </div>
        </DashboardLayout>
    );
};

// Os estilos são idênticos aos da UnauthorizedPage
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px',
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        margin: '40px 0',
        width: '100%',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        margin: '20px 0 10px 0',
    },
    message: {
        fontSize: 18,
        color: Colors.text,
        lineHeight: 1.6,
        maxWidth: 500,
    },
};

export default NotFoundPage;