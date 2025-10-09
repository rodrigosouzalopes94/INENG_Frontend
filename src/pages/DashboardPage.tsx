// src/pages/DashboardPage.tsx
import React from 'react';
import { Colors } from '../theme/colors';
import Card from '../components/ui/Card';
import AppLogo from '../components/common/AppLogo';
import DrawerMenu from '../components/ui/DrawerMenu';
import { AiOutlineUser, AiOutlineProject, AiOutlineDollar, AiOutlineTeam, AiOutlineTool } from 'react-icons/ai';

const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Obras', path: '/obras' },
    { label: 'Equipamentos', path: '/equipamentos' },
    { label: 'Funcionários', path: '/funcionarios', allowedRoles: ['GESTOR'] },
];

const DashboardPage: React.FC = () => {
    const userRole: 'GESTOR' | 'FUNCIONARIO' = 'GESTOR';

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
        <div style={styles.wrapper}>
            <DrawerMenu items={menuItems} userRole={userRole} />

            <div style={styles.mainContent}>
                {/* Header */}
                <header style={styles.header}>
                    <AppLogo />
                    <p style={styles.welcomeText}>
                        Bem-vindo, <strong>Administrador</strong>!
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

                {/* Lista de projetos recentes */}
                <div style={styles.listContainer}>
                    <h2 style={{ color: Colors.primary, marginBottom: 15 }}>Projetos Recentes</h2>
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
                    <h2 style={{ color: Colors.primary, marginBottom: 15 }}>Relatórios</h2>
                    <div style={styles.reportsGrid}>
                        <Card style={styles.reportCard}>Relatório de Vendas - Janeiro</Card>
                        <Card style={styles.reportCard}>Relatório de Obras Concluídas</Card>
                        <Card style={styles.reportCard}>Relatório de Equipamentos</Card>
                        <Card style={styles.reportCard}>Relatório de Funcionários</Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: Colors.background,
    },
    mainContent: {
        flex: 1,
        padding: 30,
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 30,
    },
    welcomeText: {
        fontSize: 18,
        color: Colors.text,
        marginTop: 10,
    },
    cardsContainer: {
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 30,
    },
    metricCard: {
        width: 180,
        height: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
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
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
        marginBottom: 30,
    },
    listCard: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
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
        marginTop: 30,
    },
    reportsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
