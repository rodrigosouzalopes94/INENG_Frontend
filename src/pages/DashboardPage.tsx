// src/pages/DashboardPage.tsx

import React from 'react';
import { useAuthContext } from '../context/AuthContext'; 
import { Colors } from '../theme/colors';
import Card from '../components/ui/Card';
import DashboardLayout from '../components/ui/DashboardLayout';
import { AiOutlineUser, AiOutlineProject, AiOutlineDollar, AiOutlineTeam, AiOutlineTool } from 'react-icons/ai';

// Definição dos itens de menu (sem alteração)
const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' }, 
    { label: 'Obras', path: '/obras' },
    { label: 'Equipamentos', path: '/equipamentos' },
    { label: 'Funcionários', path: '/funcionarios', allowedRoles: ['GESTOR', 'ADMIN'] }, // Ajustando para ADMIN
];

const DashboardPage: React.FC = () => {
    // ✅ USO DO HOOK DE AUTENTICAÇÃO: Puxa o user logado (que vem do localStorage)
    const { user, loading } = useAuthContext();
    
    // Define a role e o nome de forma segura
    const userName = user?.name || 'Visitante';
    const userRole: 'GESTOR' | 'ADMIN' = user?.role === 'ADMIN' ? 'ADMIN' : 'GESTOR';

    // Se o layout estiver carregando (lendo o token), mostra o loading
    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Carregando Dashboard...</div>;
    }
    
    // Dados estáticos para demonstração
    const metrics = [
        { label: 'Usuários', value: 120, icon: <AiOutlineUser size={30} color={Colors.accent} /> },
        { label: 'Projetos', value: 45, icon: <AiOutlineProject size={30} color={Colors.accent} /> },
        { label: 'Faturamento', value: 'R$ 350k', icon: <AiOutlineDollar size={30} color={Colors.accent} /> },
        { label: 'Clientes', value: 32, icon: <AiOutlineTeam size={30} color={Colors.accent} /> },
        { label: 'Equipamentos', value: 18, icon: <AiOutlineTool size={30} color={Colors.accent} /> },
    ];

    const recentProjects = [
        { name: 'Projeto A', status: 'Em andamento', budget: 'R$ 50k' },
        { name: 'Projeto B', status: 'Concluído', budget: 'R$ 120k' },
        { name: 'Projeto C', status: 'Em andamento', budget: 'R$ 80k' },
        { name: 'Projeto D', status: 'Em atraso', budget: 'R$ 25k' },
    ];

    return (
        <DashboardLayout menuItems={menuItems} userRole={userRole}>
            
            <header style={styles.header}>
                <h1 style={styles.pageTitle}>Dashboard</h1>
                <p style={styles.welcomeText}>
                    Bem-vindo, <strong style={{ color: Colors.primary }}>{userName} ({userRole})</strong>!
                </p>
            </header>

            {/* Cards métricos */}
            <div style={styles.cardsContainer}>
                {metrics.map((metric, idx) => (
                    <Card key={idx} style={styles.metricCard}>
                        {metric.icon}
                        <p style={styles.cardLabel}>{metric.label}</p>
                        <p style={styles.cardValue}>{metric.value}</p>
                    </Card>
                ))}
            </div>

            {/* Containers de Conteúdo */}
            <div style={styles.twoColumnGrid}>
                
                {/* Lista de projetos recentes */}
                <div style={styles.listContainer}>
                    <h2 style={styles.sectionTitle}>Projetos Recentes</h2>
                    {recentProjects.map((proj, idx) => (
                        <Card key={idx} style={styles.listCard}>
                            <p style={styles.listCardTitle}>{proj.name}</p>
                            <p style={styles.listCardDetail}>Status: {proj.status}</p>
                            <p style={styles.listCardDetail}>Orçamento: {proj.budget}</p>
                        </Card>
                    ))}
                </div>

                {/* Seção adicional de relatórios */}
                <div style={styles.reportsContainer}>
                    <h2 style={styles.sectionTitle}>Relatórios Rápidos</h2>
                    <div style={styles.reportsGrid}>
                        <Card style={styles.reportCard}>Vendas - Janeiro</Card>
                        <Card style={styles.reportCard}>Obras Concluídas</Card>
                        <Card style={styles.reportCard}>Equipamentos</Card>
                        <Card style={styles.reportCard}>Funcionários</Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
    },
    pageTitle: {
        fontSize: 28,
        color: Colors.primary,
        margin: 0,
        fontWeight: 'bold',
    },
    welcomeText: {
        fontSize: 18,
        color: Colors.text,
        margin: 0,
    },
    cardsContainer: {
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 30,
    },
    metricCard: {
        width: 180,
        height: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 5,
        padding: 15,
    },
    cardLabel: {
        fontSize: 14,
        color: Colors.secondary,
        margin: 0,
    },
    cardValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
        margin: 0,
    },
    twoColumnGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', 
        gap: 30,
        alignItems: 'flex-start',
    },
    sectionTitle: {
        color: Colors.primary, 
        marginBottom: 15,
        fontSize: 22,
        fontWeight: 'bold',
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
    },
    listCard: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        alignItems: 'flex-start',
        width: '100%',
    },
    listCardTitle: {
        fontWeight: 'bold',
        color: Colors.primary,
        fontSize: 16,
        margin: 0,
    },
    listCardDetail: {
        color: Colors.text,
        margin: 0,
        fontSize: 14,
    },
    reportsContainer: {
        // Estilos de container
    },
    reportsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 15,
    },
    reportCard: {
        padding: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: Colors.primary,
    },
};

export default DashboardPage;