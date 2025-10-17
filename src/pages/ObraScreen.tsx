// src/pages/ObraScreen.tsx

import React from 'react';
import { Colors } from '../theme/colors';
import Card from '../components/ui/Card';
import DashboardLayout from '../components/ui/DashboardLayout';
import ObraForm from '../components/ui/ObraForm';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Obras', path: '/obras' }, // Rota de Listagem
    // ...
];

const ObraScreen: React.FC = () => {
    // Usar o hook de auth para o Layout e redirecionamento
    const { user, loading } = useAuthContext();
    const navigate = useNavigate();
    
    // Simulação: Apenas o formulário de cadastro será renderizado por agora
    // Futuramente, esta tela listaria todas as obras.
    const userRole = user?.role === 'ADMIN' ? 'ADMIN' : 'GESTOR';

    // Placeholder para a função onSave
    const handleObraSave = () => {
        alert("Obra salva! Redirecionando para a lista de obras.");
        // Navega de volta para a lista (futura) ou para o dashboard
        navigate('/dashboard'); 
    };

    return (
        <DashboardLayout menuItems={menuItems} userRole={userRole}>
            <div style={styles.pageHeader}>
                 <h1 style={styles.pageTitle}>Cadastrar Nova Obra</h1>
            </div>
            
            {/* O formulário ObraForm lida com a lógica de submissão */}
            <Card style={styles.formCard}>
                <ObraForm onSave={handleObraSave} />
            </Card>

        </DashboardLayout>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    pageHeader: {
        marginBottom: 20,
        padding: '0 20px',
    },
    pageTitle: {
        fontSize: 28,
        color: Colors.primary,
        margin: 0,
        fontWeight: 'bold',
    },
    formCard: {
        padding: 0,
        boxShadow: 'none', // O Layout já tem a sombra geral
        maxWidth: '740px', // Mais largo para o formulário de duas colunas
        margin: '0 auto',
    }
};

export default ObraScreen;