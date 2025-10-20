// src/pages/UnauthorizedPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineStop } from 'react-icons/ai'; // Ícone de "Pare"

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

const UnauthorizedPage: React.FC = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    
    // Define a role para o layout, mesmo na tela de erro
    const userRole: 'GESTOR' | 'ADMIN' = user?.role === 'ADMIN' ? 'ADMIN' : 'GESTOR';

    const handleGoHome = () => {
        navigate('/dashboard');
    };

    return (
        <DashboardLayout menuItems={menuItems} userRole={userRole}>
            {/* O header da página de erro é o próprio conteúdo */}
            <div style={styles.container}>
                <AiOutlineStop size={70} color={Colors.danger} />
                
                <h1 style={styles.title}>Acesso Negado</h1>
                
                <p style={styles.message}>
                    Você não tem as permissões necessárias para visualizar esta página.
                    Se você acha que isso é um erro, por favor, entre em contato com o administrador.
                </p>
                
                <Button 
                    title="Voltar ao Dashboard" 
                    variant="primary" 
                    onClick={handleGoHome} 
                    style={{ marginTop: 20 }}
                />
            </div>
        </DashboardLayout>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px',
        backgroundColor: '#fff', // Um card branco para destacar
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
        maxWidth: 500, // Limita a largura do texto
    },
};

export default UnauthorizedPage;