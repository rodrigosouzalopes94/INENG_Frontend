// src/components/layout/DashboardLayout.tsx
import React from 'react';
import DrawerMenu from './DrawerMenu';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'GESTOR' | 'FUNCIONARIO';
}

// Menu items inline, com allowedRoles usando a tipagem do DrawerMenu
const menuItems = [
  { label: 'Clientes', path: '/clientes' },
  { label: 'Obras', path: '/obras' },
  { label: 'Equipamentos', path: '/equipamentos' },
  { label: 'Funcionários', path: '/funcionarios', allowedRoles: ['GESTOR'] as ('GESTOR' | 'FUNCIONARIO')[] },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole }) => {
  return (
    <div style={styles.container}>
      <DrawerMenu items={menuItems} userRole={userRole} />
      <main style={styles.main}>{children}</main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#ecf0f1', // fundo claro
  },
  main: {
    marginLeft: 250, // largura do Drawer
    padding: 30,
    width: '100%',
    backgroundColor: '#f7f9fa',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
};

export default DashboardLayout;
