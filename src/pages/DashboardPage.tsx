import React from 'react';
import styled from 'styled-components';
import { useAuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import CardComponent from '../components/ui/Card'; // Importa Card refatorado (com 'highlight' prop)
import DashboardLayout from '../components/ui/DashboardLayout';
import { AiOutlineProject, AiOutlineTeam, AiOutlineTool } from 'react-icons/ai';
import { useDashboardData } from '../hooks/useDashboardData';

// --- Imports e Lógica (Ajuste na tipagem de menuItems) ---
const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Obras', path: '/obras' },
    { label: 'Equipamentos', path: '/equipamentos' },
    { label: 'Funcionários', path: '/funcionarios', allowedRoles: ['GESTOR', 'ADMIN'] as const },
];

// --- Styled Components ---

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
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
  position: relative;

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
  text-align: center;

  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

const WelcomeWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  @media (max-width: 600px) {
    position: static;
    transform: none;
    text-align: center;
  }
`;

const WelcomeText = styled.p`
  font-size: 1rem;
  color: ${Colors.text};
  margin: 0;

  strong {
    color: ${Colors.primary};
  }

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

  svg {
    margin-bottom: 5px;
  }
`;

const CardLabel = styled.p`
  font-size: 0.9em;
  color: ${Colors.secondary};
  margin: 0;
`;

const CardValue = styled.p`
  font-size: 1.25em;
  font-weight: bold;
  color: ${Colors.primary};
  margin: 0;
`;

const CentralContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 50px;

   @media (min-width: 993px) {
     justify-content: flex-start;
     padding-left: 20px;
   }

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1 1 300px;
  min-width: 280px;
  max-width: 450px;

  @media (max-width: 992px) {
    width: 90%;
    max-width: 600px;
    flex-basis: auto;
  }
`;

const SectionTitle = styled.h2`
  color: ${Colors.primary};
  margin-bottom: 10px;
  font-size: 1.4em;
  font-weight: bold;
  text-align: center;
`;

// CORRIGIDO: Remove background-color condicional
const DashboardListCard = styled(CardComponent)`
  /* Adiciona padding menor */
  padding: 18px;
  gap: 6px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-3px);
  }

  /* REMOVIDO: Linhas de background-color que usavam cores inexistentes */
  /* ${props => props.highlight === 'primary' && `background-color: ${Colors.primaryLight || '#eaf2f8'};`} */
  /* ${props => props.highlight === 'accent' && `background-color: ${Colors.accentLight || '#fef5e7'};`} */
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

const ListCardStock = styled.p`
  color: ${Colors.accent};
  font-weight: bold;
  font-size: 0.95em;
  margin: 0;
  margin-top: 5px;
`;

// --- Componente React ---

const DashboardPage: React.FC = () => {
    const { user, loading: authLoading } = useAuthContext();
    const { obras, clientes, equipamentos, loading, error } = useDashboardData();

    const userName = user?.name || 'Visitante';
    const userRole: 'GESTOR' | 'ADMIN' = user?.role === 'ADMIN' ? 'ADMIN' : 'GESTOR';

    // --- Lógica de Loading e Erro ---
    if (authLoading || loading) {
        return <LoadingContainer>Carregando Dashboard...</LoadingContainer>;
    }
    if (error) {
        return (
             <DashboardLayout menuItems={menuItems} userRole={userRole}>
                <ErrorMessage>Erro ao carregar dados: {error.message}</ErrorMessage>
            </DashboardLayout>
        );
    }

    // --- Lógica de Métricas ---
    const metrics = [
        { label: 'Obras', value: obras.length, icon: <AiOutlineProject size={30} color={Colors.accent} /> },
        { label: 'Clientes', value: clientes.length, icon: <AiOutlineTeam size={30} color={Colors.accent} /> },
        { label: 'Equipamentos', value: equipamentos.length, icon: <AiOutlineTool size={30} color={Colors.accent} /> },
    ];

    // --- JSX com Styled Components ---
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

            <CentralContainer>
                {/* Obras Recentes */}
                <Column>
                    <SectionTitle>Obras Recentes</SectionTitle>
                    {obras.slice(0, 5).map((obra) => (
                        // Usa DashboardListCard com a prop highlight (agora só afeta a borda)
                        <DashboardListCard
                            key={obra.id}
                            highlight={obra.tipoObra === 'CONSTRUCAO' ? 'primary' : 'accent'}
                            paddingSize="medium"
                        >
                            <ListCardTitle>{obra.nomeObra}</ListCardTitle>
                            <ListCardDetail>Tipo: {obra.tipoObra}</ListCardDetail>
                            <ListCardDetail>Cliente: {obra.cliente?.nomeOuRazao}</ListCardDetail>
                        </DashboardListCard>
                    ))}
                </Column>

                {/* Clientes Recentes */}
                <Column>
                    <SectionTitle>Clientes Recentes</SectionTitle>
                    {clientes.slice(0, 5).map((cliente) => (
                        <DashboardListCard key={cliente.id} paddingSize="medium">
                            <ListCardTitle>{cliente.nomeOuRazao}</ListCardTitle>
                            <ListCardDetail>Tipo: {cliente.tipoPessoa}</ListCardDetail>
                            <ListCardDetail>
                                {cliente.tipoPessoa === 'FISICA' ? `CPF: ${cliente.cpf}` : `CNPJ: ${cliente.cnpj}`}
                            </ListCardDetail>
                        </DashboardListCard>
                    ))}
                </Column>

                {/* Equipamentos Recentes */}
                <Column>
                    <SectionTitle>Equipamentos Recentes</SectionTitle>
                    {equipamentos.slice(0, 5).map((equipamento) => (
                        <DashboardListCard key={equipamento.id} paddingSize="medium">
                            <ListCardTitle>{equipamento.equipamento}</ListCardTitle>
                            <ListCardDetail>Patrimônio: {equipamento.patrimonio}</ListCardDetail>
                            <ListCardDetail>Marca: {equipamento.marca}</ListCardDetail>
                            <ListCardStock>Estoque: {equipamento.quantidade}</ListCardStock>
                        </DashboardListCard>
                    ))}
                </Column>
            </CentralContainer>
        </DashboardLayout>
    );
};

export default DashboardPage;