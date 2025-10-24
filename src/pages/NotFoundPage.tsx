import React from 'react';
import styled from 'styled-components'; // Importa styled
import { useNavigate } from 'react-router-dom';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 50px 20px; /* Aumenta padding vertical */
  background-color: ${Colors.white};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 40px auto; /* Centraliza horizontalmente se o layout permitir */
  width: 100%;
  max-width: 600px; /* Define uma largura máxima */
  box-sizing: border-box;

  /* Estilo para o ícone */
  svg {
    margin-bottom: 15px; /* Espaço abaixo do ícone */
  }

  @media (max-width: 600px) {
      padding: 30px 15px;
      margin: 20px auto;
  }
`;

const Title = styled.h1`
  font-size: 2em; /* Usa em */
  font-weight: bold;
  color: ${Colors.primary};
  margin: 15px 0 10px 0; /* Ajusta margens */

  @media (max-width: 600px) {
      font-size: 1.6em;
  }
`;

const Message = styled.p`
  font-size: 1.1em; /* Usa em */
  color: ${Colors.text};
  line-height: 1.6;
  max-width: 500px;
  margin-bottom: 25px; /* Adiciona espaço antes do botão */

   @media (max-width: 600px) {
      font-size: 1em;
  }
`;

// Estiliza o botão importado
const GoHomeButton = styled(Button)`
  margin-top: 20px;
  padding: 10px 25px; /* Ajusta padding */
`;

// --- Componente React ---

const NotFoundPage: React.FC = () => {
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
                <AiOutlineQuestionCircle size={70} color={Colors.accent} />

                {/* Usa o Title estilizado */}
                <Title>Página Não Encontrada (404)</Title>

                {/* Usa a Message estilizada */}
                <Message>
                    O endereço que você está tentando acessar não existe ou foi removido.
                    Verifique se a URL está correta.
                </Message>

                {/* Usa o GoHomeButton estilizado */}
                <GoHomeButton
                    title="Ir para o Dashboard"
                    variant="primary" // Usa a variant do Button
                    onClick={handleGoHome}
                />
            </Container>
        </DashboardLayout>
    );
};

export default NotFoundPage;