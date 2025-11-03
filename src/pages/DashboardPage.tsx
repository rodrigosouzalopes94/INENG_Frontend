import React from 'react';
import styled from 'styled-components';
import { useAuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import CardComponent from '../components/ui/Card';
import DashboardLayout from '../components/ui/DashboardLayout';
import { AiOutlineProject, AiOutlineTeam, AiOutlineUser } from 'react-icons/ai'; 
import { useDashboardData } from '../hooks/useDashboardData';

// --- Menu Items (SEM ALTERAÇÕES) ---
const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Obras', path: '/obras' },
    { label: 'Equipamentos', path: '/equipamentos' },
    { label: 'Funcionários', path: '/funcionarios', allowedRoles: ['GESTOR', 'ADMIN'] as const },
];

// --- Styled Components (CORRIGIDO - SEM DUPLICATAS) ---

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const ErrorMessage = styled.p`
  color: ${Colors.danger};
  text-align: center;
  padding: 20px;
  background-color: #fff4f4;
  border: 1px solid ${Colors.danger};
  border-radius: 8px;
  margin: 20px 0;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between; /* Título à esquerda, Boas-vindas à direita */
  align-items: center;
  margin-bottom: 30px;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  color: ${Colors.primary};
  margin: 0;
  font-weight: bold;
  
  @media (max-width: 600px) {
    font-size: 24px;
    text-align: center;
  }
`;

const WelcomeWrapper = styled.div`
  text-align: right;

  @media (max-width: 600px) {
    text-align: center;
  }
`;

const WelcomeText = styled.p`
  font-size: 1rem;
  color: ${Colors.text};
  margin: 0;
  strong { color: ${Colors.primary}; }
  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 40px;
`;

const MetricCard = styled(CardComponent)`
  width: 180px;
  min-width: 150px;
  height: 120px;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
  flex-grow: 1;
  max-width: 200px;
  padding: 15px;
  svg { margin-bottom: 5px; }
`;

// Definição ÚNICA de CardLabel
const CardLabel = styled.p`
  font-size: 0.9em;
  color: ${Colors.secondary};
  margin: 0;
`;

// Definição ÚNICA de CardValue
const CardValue = styled.p`
  font-size: 1.25em;
  font-weight: bold;
  color: ${Colors.primary};
  margin: 0;
`;

// Container das colunas de "Recentes" (GRID)
const CentralContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
  padding: 0 10px; 

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;

// Coluna individual
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  /* Largura é controlada pelo Grid */
`;

const SectionTitle = styled.h2`
  color: ${Colors.primary};
  margin-bottom: 10px;
  font-size: 1.4em;
  font-weight: bold;
  text-align: center;
`;

const DashboardListCard = styled(CardComponent)`
  gap: 6px;
  transition: transform 0.2s ease-in-out;
  width: 100%;
  &:hover {
    transform: translateY(-3px);
  }
`;

const ListCardTitle = styled.p`
  font-weight: bold;
  color: ${Colors.primary};
  font-size: 1em;
  margin: 0;
`;

const ListCardDetail = styled.p`
  color: ${Colors.text};
  margin: 0;
  font-size: 0.9em;
`;

// --- Componente React ---

const DashboardPage: React.FC = () => {
    const { user, loading: authLoading } = useAuthContext();
    // Hook (sem 'equipamentos')
    const { obras, clientes, funcionarios, loading, error } = useDashboardData();

    const userName = user?.name || 'Visitante';
    const userRole: 'GESTOR' | 'ADMIN' = user?.role === 'ADMIN' ? 'ADMIN' : 'GESTOR';

    // --- Lógica de Loading e Erro (SEM ALTERAÇÕES) ---
    if (authLoading || loading) {
        return <LoadingContainer>Carregando Dashboard...</LoadingContainer>;
    }
    
    let errorMessage: string | null = null;
    if (error) {
        errorMessage = error instanceof Error ? error.message : String(error);
    }
    
    if (errorMessage) {
        return (
             <DashboardLayout menuItems={menuItems} userRole={userRole}>
                <ErrorMessage>Erro ao carregar dados: {errorMessage}</ErrorMessage>
            </DashboardLayout>
        );
    }

    // --- Lógica de Métricas (SEM EQUIPAMENTOS) ---
    const metrics = [
        { label: 'Obras', value: obras.length, icon: <AiOutlineProject size={30} color={Colors.accent} /> },
        { label: 'Clientes', value: clientes.length, icon: <AiOutlineTeam size={30} color={Colors.accent} /> },
        { label: 'Funcionários', value: funcionarios.length, icon: <AiOutlineUser size={30} color={Colors.accent} /> },
    ];

    // --- JSX (com tags de fechamento CORRIGIDAS) ---
    return (
        <DashboardLayout menuItems={menuItems} userRole={userRole}>
            <Header>
                <PageTitle>Dashboard</PageTitle>
                <WelcomeWrapper>
                    <WelcomeText>
                        Bem-vindo, <strong>{userName} ({userRole})</strong>!
                    </WelcomeText>
                </WelcomeWrapper>
            </Header>

            <CardsContainer>
                {metrics.map((metric, idx) => (
                    <MetricCard key={idx} paddingSize="medium">
                        {metric.icon}
                        <CardLabel>{metric.label}</CardLabel>
                        <CardValue>{metric.value}</CardValue>
                    </MetricCard>
                ))}
            </CardsContainer>

            <CentralContainer> {/* <-- Usa GRID */}
                {/* Obras Recentes */}
                <Column>
                    <SectionTitle>Obras Recentes</SectionTitle>
                    {obras.length > 0 ? (
                        obras.slice(0, 5).map((obra) => (
                            <DashboardListCard
                                key={obra.id}
                                highlight={obra.tipoObra === 'CONSTRUCAO' ? 'primary' : 'accent'}
                                paddingSize="medium"
                            >
                                <ListCardTitle>{obra.nomeObra}</ListCardTitle>
                                <ListCardDetail>Tipo: {obra.tipoObra}</ListCardDetail>
                                <ListCardDetail>Cliente: {obra.cliente?.nomeOuRazao || 'N/A'}</ListCardDetail>
                            </DashboardListCard>
                        ))
                    ) : (
                        <ListCardDetail style={{ textAlign: 'center', fontStyle: 'italic' }}>Nenhuma obra recente.</ListCardDetail>
                    )}
                </Column>

                {/* Clientes Recentes */}
                <Column>
                    <SectionTitle>Clientes Recentes</SectionTitle>
                     {clientes.length > 0 ? (
                        clientes.slice(0, 5).map((cliente) => (
                            <DashboardListCard key={cliente.id} paddingSize="medium">
                                <ListCardTitle>{cliente.nomeOuRazao}</ListCardTitle>
                                <ListCardDetail>Tipo: {cliente.tipoPessoa}</ListCardDetail>
                                <ListCardDetail>
                                    {cliente.tipoPessoa === 'FISICA' ? `CPF: ${cliente.cpf}` : `CNPJ: ${cliente.cnpj}`}
                                </ListCardDetail>
                            </DashboardListCard>
                        ))
                    ) : (
                         <ListCardDetail style={{ textAlign: 'center', fontStyle: 'italic' }}>Nenhum cliente recente.</ListCardDetail>
                    )}
                </Column>

                {/* Coluna de Funcionários Recentes */}
                <Column>
                    <SectionTitle>Funcionários Recentes</SectionTitle>
                    {funcionarios.length > 0 ? (
                        funcionarios.slice(0, 5).map((func) => (
                            <DashboardListCard key={func.id} paddingSize="medium">
                                <ListCardTitle>{func.nome}</ListCardTitle>
                                <ListCardDetail>Profissão: {func.tipoProfissao}</ListCardDetail>
                                <ListCardDetail>Contrato: {func.tipoContrato}</ListCardDetail>
                            </DashboardListCard>
                        ))
                    ) : (
                        <ListCardDetail style={{ textAlign: 'center', fontStyle: 'italic' }}>Nenhum funcionário recente.</ListCardDetail>
                    )}
                </Column>
                
            </CentralContainer>
        </DashboardLayout>
    );
};

export default DashboardPage;