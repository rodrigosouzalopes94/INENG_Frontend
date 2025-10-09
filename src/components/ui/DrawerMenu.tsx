// src/components/layout/DrawerMenu.tsx
import React from 'react';
import { Colors } from '../../theme/colors';
import AppLogo from '../common/AppLogo';
import { useLocation, useNavigate } from 'react-router-dom';

interface MenuItem {
  label: string;
  path: string;
  allowedRoles?: ('GESTOR' | 'FUNCIONARIO')[];
}

interface DrawerMenuProps {
  items: MenuItem[];
  userRole: 'GESTOR' | 'FUNCIONARIO';
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ items, userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside style={styles.sidebar}>
      <AppLogo />
      <nav style={styles.nav}>
        {items
          .filter(item => !item.allowedRoles || item.allowedRoles.includes(userRole))
          .map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={idx}
                style={{
                  ...styles.navLink,
                  backgroundColor: isActive ? Colors.accent : 'transparent',
                  color: isActive ? Colors.white : Colors.white,
                }}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </div>
            );
          })}
      </nav>
    </aside>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: 250,
    padding: 20,
    backgroundColor: Colors.primary,
    color: Colors.white,
    height: '100vh',
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 6px rgba(0,0,0,0.15)',
  },
  nav: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  navLink: {
    padding: '10px 15px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.2s all',
    userSelect: 'none',
  },
};

export default DrawerMenu;
