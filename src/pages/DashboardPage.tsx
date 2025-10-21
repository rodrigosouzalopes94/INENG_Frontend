// src/pages/DashboardPage.tsx

import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import Card from '../components/ui/Card';
import DashboardLayout from '../components/ui/DashboardLayout';
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
    // 1. ATUALIZADO: Recebendo 'equipamentos' e 'error' do hook
    const { obras, clientes, equipamentos, loading, error } = useDashboardData();

    const userName = user?.name || 'Visitante';
    const userRole: 'GESTOR' | 'ADMIN' = user?.role === 'ADMIN' ? 'ADMIN' : 'GESTOR';

    if (authLoading || loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                Carregando Dashboard...
            </div>
        );
    }
    
    // ADICIONADO: Tratamento de erro
    if (error) {
        return (
             <DashboardLayout menuItems={menuItems} userRole={userRole}>
                <p style={{ color: Colors.danger, textAlign: 'center' }}>
                    Erro ao carregar dados: {error.message}
                </p>
            </DashboardLayout>
        );
    }

    // 2. ATUALIZADO: Métrica de equipamentos agora é dinâmica
    const metrics = [
        { label: 'Obras', value: obras.length, icon: <AiOutlineProject size={30} color={Colors.accent} /> },
        { label: 'Clientes', value: clientes.length, icon: <AiOutlineTeam size={30} color={Colors.accent} /> },
        // Valor '18' substituído por 'equipamentos.length'
        { label: 'Equipamentos', value: equipamentos.length, icon: <AiOutlineTool size={30} color={Colors.accent} /> },
    ];

    return (
        <DashboardLayout menuItems={menuItems} userRole={userRole}>
            <header style={styles.header}>
                <h1 style={styles.pageTitle}>Dashboard</h1>
                
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

            {/* Conteúdo centralizado */}
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

                {/* 3. ADICIONADO: Coluna de Equipamentos Recentes */}
                <div style={styles.column}>
                    <h2 style={styles.sectionTitle}>Equipamentos Recentes</h2>
                    {equipamentos.slice(0, 5).map((equipamento) => (
                        <Card key={equipamento.id} style={styles.listCard}>
                            <p style={styles.listCardTitle}>{equipamento.equipamento}</p>
                            <p style={styles.listCardDetail}>Patrimônio: {equipamento.patrimonio}</p>
                            <p style={styles.listCardDetail}>Marca: {equipamento.marca}</p>
                            <p style={styles.listCardStock}>Estoque: {equipamento.quantidade}</p>
                        </Card>
                    ))}
                </div>

            </div>
        </DashboardLayout>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    // Header (igual)
    header: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
        position: 'relative', 
    },
    pageTitle: {
        fontSize: 28,
        color: Colors.primary,
        margin: 0,
        fontWeight: 'bold',
        textAlign: 'center', 
    },
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
    
    // Cards Métricos (igual)
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

    // Colunas de Conteúdo (atualizado)
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
        flex: 1, // Adicionado para melhor distribuição
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
    // ADICIONADO: Estilo para o card de estoque
    listCardStock: {
        color: Colors.accent, 
        fontWeight: 'bold',
        fontSize: 15,
        margin: 0,
        marginTop: 5,
    },
    sectionTitle: {
        color: Colors.primary,
        marginBottom: 10,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // Responsividade (igual)
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