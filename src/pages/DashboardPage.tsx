// src/pages/DashboardPage.tsx

import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import Card from '../components/ui/Card';
import DashboardLayout from '../components/ui/DashboardLayout';
// MODIFICADO: Removido AiOutlineUser e AiOutlineDollar pois não são mais usados
import { AiOutlineProject, AiOutlineTeam, AiOutlineTool } from 'react-icons/ai'; 
import { useDashboardData } from '../hooks/useDashboardData';

const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Obras', path: '/obras' },
    { label: 'Equipamentos', path: '/equipamentos' },
    { label: 'Funcionários', path: '/funcionarios', allowedRoles: ['GESTOR', 'ADMIN'] },
];

const DashboardPage: React.FC = () => {
    const { user, loading: authLoading } = useAuthContext();
    const { obras, clientes, loading } = useDashboardData();

    const userName = user?.name || 'Visitante';
    const userRole: 'GESTOR' | 'ADMIN' = user?.role === 'ADMIN' ? 'ADMIN' : 'GESTOR';

    if (authLoading || loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                Carregando Dashboard...
            </div>
        );
    }

    // MODIFICADO: Exibindo apenas os cards solicitados
    const metrics = [
        // { label: 'Usuários', value: 120, icon: <AiOutlineUser size={30} color={Colors.accent} /> }, // Removido
        { label: 'Obras', value: obras.length, icon: <AiOutlineProject size={30} color={Colors.accent} /> }, // Label atualizado de 'Projetos'
        // { label: 'Faturamento', value: 'R$ 350k', icon: <AiOutlineDollar size={30} color={Colors.accent} /> }, // Removido
        { label: 'Clientes', value: clientes.length, icon: <AiOutlineTeam size={30} color={Colors.accent} /> },
        { label: 'Equipamentos', value: 18, icon: <AiOutlineTool size={30} color={Colors.accent} /> }, // Mantido (valor '18' é estático por enquanto)
    ];

    return (
        <DashboardLayout menuItems={menuItems} userRole={userRole}>
            {/* MODIFICADO (Reaplicando correção anterior): JSX do header */}
            <header style={styles.header}>
                <h1 style={styles.pageTitle}>Dashboard</h1>
                
                {/* Wrapper para o texto de boas-vindas */}
                <div style={styles.welcomeWrapper}>
                    <p style={styles.welcomeText}>
                        Bem-vindo, <strong style={{ color: Colors.primary }}>{userName} ({userRole})</strong>!
                    </p>
                </div>
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

            {/* Conteúdo centralizado, porém mais à esquerda */}
            <div style={styles.centralContainer}>
                {/* Obras Recentes */}
                <div style={styles.column}>
                    <h2 style={styles.sectionTitle}>Obras Recentes</h2>
                    {obras.slice(0, 5).map((obra) => (
                        <Card
                            key={obra.id}
                            style={{
                                ...styles.listCard,
                                backgroundColor:
                                    obra.tipoObra === 'CONSTRUCAO' ? Colors.primaryLight : Colors.accentLight,
                                borderLeft: `5px solid ${obra.tipoObra === 'CONSTRUCAO' ? Colors.primary : Colors.accent}`,
                            }}
                        >
                            <p style={styles.listCardTitle}>{obra.nomeObra}</p>
                            <p style={styles.listCardDetail}>Tipo: {obra.tipoObra}</p>
                            <p style={styles.listCardDetail}>Cliente: {obra.cliente?.nomeOuRazao}</p>
                        </Card>
                    ))}
                </div>

                {/* Clientes Recentes */}
                <div style={styles.column}>
                    <h2 style={styles.sectionTitle}>Clientes Recentes</h2>
                    {clientes.slice(0, 5).map((cliente) => (
                        <Card key={cliente.id} style={styles.listCard}>
                            <p style={styles.listCardTitle}>{cliente.nomeOuRazao}</p>
                            <p style={styles.listCardDetail}>Tipo: {cliente.tipoPessoa}</p>
                            <p style={styles.listCardDetail}>
                                {cliente.tipoPessoa === 'FISICA' ? `CPF: ${cliente.cpf}` : `CNPJ: ${cliente.cnpj}`}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    // MODIFICADO (Reaplicando correção anterior): Estilo do header
    header: {
        display: 'flex',
        justifyContent: 'center', // MUDADO de 'space-between'
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
        position: 'relative', // ADICIONADO
    },
    pageTitle: {
        fontSize: 28,
        color: Colors.primary,
        margin: 0,
        fontWeight: 'bold',
        textAlign: 'center', // Adicionado para garantir
    },
    // ADICIONADO (Reaplicando correção anterior): Wrapper do texto
    welcomeWrapper: {
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
    },
    welcomeText: {
        fontSize: 18,
        color: Colors.text,
        margin: 0,
    },
    
    // MODIFICADO (Pedido atual): Centralizando os cards
    cardsContainer: {
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        justifyContent: 'center', // MUDADO de 'flex-start'
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
    centralContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: 50,
        flexWrap: 'wrap',
        marginBottom: 50,
        paddingLeft: 20,
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        minWidth: 320,
        maxWidth: 400,
    },
    listCard: {
        padding: 25,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'flex-start',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
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
    sectionTitle: {
        color: Colors.primary,
        marginBottom: 10,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // Responsividade
    '@media(max-width: 900px)': {
        centralContainer: {
            flexDirection: 'column',
            alignItems: 'center',
            paddingLeft: 0,
        },
        column: {
            maxWidth: '90%',
        },
    },
};

export default DashboardPage;