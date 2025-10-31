import React from 'react';
import styled from 'styled-components'; // Importa styled-components
import { useAuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import CardComponent from '../components/ui/Card'; // Importa Card refatorado
import DashboardLayout from '../components/ui/DashboardLayout';
// Importa o ícone de Funcionário
import { AiOutlineProject, AiOutlineTeam, AiOutlineTool, AiOutlineUser } from 'react-icons/ai'; 
import { useDashboardData } from '../hooks/useDashboardData'; // Hook que busca todos os dados

// --- Menu Items (com tipagem correta) ---
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
  background-color: #fff4f4;
  border: 1px solid ${Colors.danger};
  border-radius: 8px;
  margin: 20px 0;
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

// Container dos cards de métrica
const CardsContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 40px;
`;

// Card de métrica
const MetricCard = styled(CardComponent)`
  width: 180px;
  min-width: 150px;
  height: 120px;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
  flex-grow: 1;
  max-width: 200px;
  padding: 15px; // Garante o padding

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

// Container das colunas de "Recentes"
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

// Coluna individual
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

// Card para as listas de recentes
const DashboardListCard = styled(CardComponent)`
  gap: 6px;
  transition: transform 0.2s ease-in-out;
  width: 100%; // Garante que ocupe a coluna

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
    // Pega TODOS os dados do hook, incluindo 'funcionarios'
    const { obras, clientes, equipamentos, funcionarios, loading, error } = useDashboardData();

    const userName = user?.name || 'Visitante';
    const userRole: 'GESTOR' | 'ADMIN' = user?.role === 'ADMIN' ? 'ADMIN' : 'GESTOR';

    // --- Lógica de Loading e Erro ---
    if (authLoading || loading) {
        return <LoadingContainer>Carregando Dashboard...</LoadingContainer>;
    }
    
    // Mostra erro se houver (converte objeto Error para string)
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

    // --- Lógica de Métricas (COM FUNCIONÁRIOS) ---
    const metrics = [
        { label: 'Obras', value: obras.length, icon: <AiOutlineProject size={30} color={Colors.accent} /> },
        { label: 'Clientes', value: clientes.length, icon: <AiOutlineTeam size={30} color={Colors.accent} /> },
        { label: 'Equipamentos', value: equipamentos.length, icon: <AiOutlineTool size={30} color={Colors.accent} /> },
        // ✅ CARD DE FUNCIONÁRIOS ADICIONADO
        { label: 'Funcionários', value: funcionarios.length, icon: <AiOutlineUser size={30} color={Colors.accent} /> },
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

            {/* Cards de Métrica */}
            <CardsContainer>
                {metrics.map((metric, idx) => (
                    <MetricCard key={idx} paddingSize="medium">
                        {metric.icon}
                        <CardLabel>{metric.label}</CardLabel>
                        <CardValue>{metric.value}</CardValue>
                    </MetricCard>
                ))}
            </CardsContainer>

            {/* Colunas de Dados Recentes */}
            <CentralContainer>
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

                {/* Equipamentos Recentes */}
                <Column>
                    <SectionTitle>Equipamentos Recentes</SectionTitle>
                    {equipamentos.length > 0 ? (
                        equipamentos.slice(0, 5).map((equipamento) => (
                            <DashboardListCard key={equipamento.id} paddingSize="medium">
                                <ListCardTitle>{equipamento.equipamento}</ListCardTitle>
                                <ListCardDetail>Patrimônio: {equipamento.patrimonio}</ListCardDetail>
                                <ListCardDetail>Marca: {equipamento.marca}</ListCardDetail>
                                <ListCardStock>Estoque: {equipamento.quantidade}</ListCardStock>
                            </DashboardListCard>
                        ))
                    ) : (
                        <ListCardDetail style={{ textAlign: 'center', fontStyle: 'italic' }}>Nenhum equipamento recente.</ListCardDetail>
                    )}
                </Column>
                
                {/* COLUNA DE FUNCIONÁRIOS (Seu pedido original era só o CARD)
                  Se você também quiser a coluna de "Funcionários Recentes", 
                  descomente o bloco abaixo e ajuste os campos (ex: nome, profissão).
                */}
                {/*
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
                */}

            </CentralContainer>
        </DashboardLayout>
    );
};

export default DashboardPage;

// Lembrete: Se você não definiu Colors.primaryLight e Colors.accentLight em theme/colors.ts,
// a prop 'highlight' no DashboardListCard (para Obras) só mudará a cor da borda,
// o que é perfeitamente normal, já que removemos o background-color de lá.