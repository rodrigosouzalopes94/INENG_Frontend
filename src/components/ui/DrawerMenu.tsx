import React from 'react';
import styled, { css } from 'styled-components';
import { Colors } from '../../theme/colors';
import AppLogo from '../common/AppLogo';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext'; // 1. Importa o AuthContext
import { AiOutlineLogout } from 'react-icons/ai'; // Exemplo: Ícone para logout

// --- Interfaces ---
interface MenuItem {
  label: string;
  path: string;
  allowedRoles?: ('GESTOR' | 'ADMIN')[];
}

interface DrawerMenuProps {
  items: MenuItem[];
  userRole: 'GESTOR' | 'ADMIN';
}

// --- Styled Components ---

const SidebarContainer = styled.aside`
  width: 250px;
  padding: 20px;
  background-color: ${Colors.primary};
  color: ${Colors.white};
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column; // Conteúdo principal empilhado
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;

  /* Responsividade (Exemplo) */
  @media (max-width: 768px) {
    /* width: 60px; // Poderia virar um menu só com ícones */
    /* Ou esconder completamente: display: none; */
  }
`;

// Wrapper para Logo e Navegação (permite empurrar logout para baixo)
const MainContent = styled.div`
    flex-grow: 1; // Ocupa todo o espaço vertical disponível
`;

const NavMenu = styled.nav`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// NavLink (como estava antes)
const NavLink = styled.div<{ $isActive: boolean }>` // Usa transient prop
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s, color 0.2s;
  user-select: none;
  display: flex; // Para alinhar ícone (se adicionar)
  align-items: center; // Para alinhar ícone (se adicionar)
  gap: 10px; // Espaço para ícone (se adicionar)

  background-color: transparent;
  color: ${Colors.white};

  ${({ $isActive }) =>
    $isActive &&
    css`
      background-color: ${Colors.accent};
      color: ${Colors.white};
    `}

  &:hover {
    ${({ $isActive }) =>
      !$isActive &&
      css`
        background-color: rgba(255, 255, 255, 0.1);
      `}
  }
`;

// 2. Styled Component para o Botão Logout
const LogoutButton = styled.button`
  background-color: rgba(255, 255, 255, 0.1); // Fundo sutil
  color: ${Colors.white};
  border: none;
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  text-align: left; // Alinha texto à esquerda
  width: 100%; // Ocupa largura
  margin-top: auto; // Empurra para o final do flex container (SidebarContainer)
  display: flex;
  align-items: center;
  gap: 10px; // Espaço entre ícone e texto
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2); // Escurece um pouco no hover
  }

  svg { // Estilo para o ícone
    font-size: 1.2em; // Tamanho do ícone
  }
`;


// --- Componente React ---

const DrawerMenu: React.FC<DrawerMenuProps> = ({ items, userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthContext(); // 3. Pega a função logout

  // 4. Handler para o Logout
  const handleLogout = () => {
    logout(); // Limpa o estado/token de autenticação
    navigate('/'); // Redireciona para a página de login
  };

  return (
    <SidebarContainer>
       {/* Conteúdo Principal (Logo e Navegação) */}
      <MainContent>
            <AppLogo />
            <NavMenu>
                {items
                .filter(item => !item.allowedRoles || item.allowedRoles.includes(userRole))
                .map((item, idx) => {
                    const isActive = location.pathname === item.path;
                    return (
                    // Usa transient prop '$isActive'
                    <NavLink
                        key={idx}
                        $isActive={isActive} // Passa como transient prop
                        onClick={() => navigate(item.path)}
                    >
                        {/* Adicionar ícones aqui se quiser */}
                        {item.label}
                    </NavLink>
                    );
                })}
            </NavMenu>
      </MainContent>

      {/* 5. Botão de Logout Adicionado */}
      <LogoutButton onClick={handleLogout}>
            <AiOutlineLogout /> {/* Ícone */}
            Sair
      </LogoutButton>
    </SidebarContainer>
  );
};

export default DrawerMenu;