import React from 'react';
import styled from 'styled-components'; // Importa styled
import { useNavigate } from 'react-router-dom';
import { AiOutlineStop } from 'react-icons/ai'; // Ícone

import DashboardLayout from '../components/ui/DashboardLayout';
import Button from '../components/ui/Button'; // Importa Button refatorado
import { Colors } from '../theme/colors';
import { useAuthContext } from '../context/AuthContext';

// --- Imports e Lógica (Ajuste na tipagem de menuItems) ---
const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Obras', path: '/obras' },
    { label: 'Equipamentos', path: '/equipamentos' },
    { label: 'Funcionários', path: '/funcionarios', allowedRoles: ['GESTOR', 'ADMIN'] as const },
];

// --- Styled Components ---

// Container principal com estilo de card
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 50px 30px; /* Aumenta padding */
  background-color: ${Colors.white}; /* Fundo branco */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra mais suave */
  margin: 40px auto; /* Centraliza horizontalmente */
  width: 100%;
  max-width: 600px; /* Largura máxima */
  box-sizing: border-box;

  /* Estilo para o ícone */
  svg {
    margin-bottom: 20px; /* Espaço abaixo do ícone */
  }

  @media (max-width: 600px) {
      padding: 40px 20px;
      margin: 20px auto;
  }
`;

// Título da página
const Title = styled.h1`
  font-size: 2em; /* Usa em */
  font-weight: bold;
  color: ${Colors.primary};
  margin: 15px 0 10px 0;

  @media (max-width: 600px) {
      font-size: 1.7em;
  }
`;

// Mensagem de texto
const Message = styled.p`
  font-size: 1.1em; /* Usa em */
  color: ${Colors.text};
  line-height: 1.6;
  max-width: 500px; /* Mantém limite */
  margin-bottom: 30px; /* Aumenta espaço antes do botão */

   @media (max-width: 600px) {
      font-size: 1em;
  }
`;

// Botão para voltar (Usa Button refatorado)
const GoHomeButton = styled(Button)`
  margin-top: 20px; /* Mantém margem */
  padding: 10px 25px;
`;

// --- Componente React ---

const UnauthorizedPage: React.FC = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    // Determina userRole (sem alterações)
    const userRole: 'GESTOR' | 'ADMIN' = user?.role === 'ADMIN' ? 'ADMIN' : 'GESTOR';

    // Handler para navegar (sem alterações)
    const handleGoHome = () => {
        navigate('/dashboard');
    };

    return (
        // Layout principal (sem alterações)
        <DashboardLayout menuItems={menuItems} userRole={userRole}>
            {/* Usa o Container estilizado */}
            <Container>
                {/* Ícone */}
                <AiOutlineStop size={70} color={Colors.danger} />

                {/* Usa o Title estilizado */}
                <Title>Acesso Negado</Title>

                {/* Usa a Message estilizada */}
                <Message>
                    Você não tem as permissões necessárias para visualizar esta página.
                    Se você acha que isso é um erro, por favor, entre em contato com o administrador.
                </Message>

                {/* Usa o GoHomeButton estilizado */}
                <GoHomeButton
                    title="Voltar ao Dashboard"
                    variant="primary" // Usa a variant do Button
                    onClick={handleGoHome}
                />
            </Container>
        </DashboardLayout>
    );
};

export default UnauthorizedPage;