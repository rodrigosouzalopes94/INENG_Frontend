import React from 'react';
import styled, { css } from 'styled-components'; // Importa styled e css
import { Colors } from '../../theme/colors';
import AppLogo from '../common/AppLogo'; // Mantém import da Logo
import { useLocation, useNavigate } from 'react-router-dom';

// --- Interfaces (SEM ALTERAÇÕES) ---
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

// Container principal do menu lateral (aside)
const SidebarContainer = styled.aside`
  width: 250px;
  padding: 20px;
  background-color: ${Colors.primary};
  color: ${Colors.white};
  height: 100vh;
  position: fixed; // ou 'sticky' se preferir, dependendo do layout pai
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.15);
  box-sizing: border-box; // Inclui padding na largura

  /* Adicionar responsividade se necessário (ex: esconder em telas pequenas) */
  @media (max-width: 768px) {
    /* Exemplo: Esconder o menu e depender de um botão de toggle (requer lógica adicional) */
    /* display: none; */
    /* Ou reduzir a largura */
    /* width: 200px; */
  }
`;

// Container da navegação (nav)
const NavMenu = styled.nav`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// Item de navegação clicável (div)
// Recebe uma prop 'isActive' para estilização condicional
const NavLink = styled.div<{ isActive: boolean }>`
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s, color 0.2s; // Transição suave
  user-select: none; // Evita seleção de texto

  /* Estilo base (não ativo) */
  background-color: transparent;
  color: ${Colors.white}; // Cor padrão do texto

  /* Estilo quando ATIVO */
  ${({ isActive }) =>
    isActive &&
    css`
      background-color: ${Colors.accent};
      color: ${Colors.white}; // Cor do texto ativo (pode ser a mesma ou diferente)
    `}

  /* Efeito Hover (apenas se NÃO estiver ativo) */
  &:hover {
    ${({ isActive }) =>
      !isActive &&
      css`
        background-color: rgba(255, 255, 255, 0.1); // Leve destaque no hover
      `}
  }
`;

// --- Componente React ---

const DrawerMenu: React.FC<DrawerMenuProps> = ({ items, userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    // Usa o SidebarContainer estilizado
    <SidebarContainer>
      <AppLogo /> {/* Renderiza a logo */}
      {/* Usa o NavMenu estilizado */}
      <NavMenu>
        {items
          // Lógica de filtro e map (SEM ALTERAÇÕES)
          .filter(item => !item.allowedRoles || item.allowedRoles.includes(userRole))
          .map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              // Usa o NavLink estilizado, passando a prop 'isActive'
              <NavLink
                key={idx}
                isActive={isActive} // Passa o estado ativo como prop
                onClick={() => navigate(item.path)} // Lógica de navegação
              >
                {item.label}
              </NavLink>
            );
          })}
      </NavMenu>
    </SidebarContainer>
  );
};

export default DrawerMenu;