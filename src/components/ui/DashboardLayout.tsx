// src/components/layout/DashboardLayout.tsx

import React from 'react';
import { Colors } from '../../theme/colors';
import DrawerMenu from '../ui/DrawerMenu';

// ✅ DEFINIÇÃO DO TIPO AQUI para resolver o problema de importação
interface MenuItem {
    label: string;
    path: string;
    allowedRoles?: ('GESTOR' | 'ADMIN')[];
}

const SIDEBAR_WIDTH = 250; 

interface DashboardLayoutProps {
    children: React.ReactNode;
    menuItems: MenuItem[];
    userRole: 'GESTOR' | 'ADMIN'; 
}

const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: Colors.background,
        width: '100%',
    },
    sidebarContainer: {
        width: SIDEBAR_WIDTH,
        flexShrink: 0, // Garante que a sidebar não encolha
        // Adicionando altura total para fixar a sidebar (se o DrawerMenu não fizer isso)
        height: '100vh', 
        position: 'sticky', // Fica fixo no scroll
        top: 0,
    },
    mainContent: {
        flexGrow: 1, 
        padding: 30,
        // Adiciona margem superior para compensar o header se ele fosse fixo
    },
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, menuItems, userRole }) => {
    return (
        <div style={styles.wrapper}>
            
            {/* 1. SIDEBAR: Fixa e com largura definida */}
            <div style={styles.sidebarContainer}>
                 {/* O DrawerMenu deve preencher esta div */}
                 <DrawerMenu items={menuItems} userRole={userRole} />
            </div>
            
            {/* 2. CONTEÚDO PRINCIPAL: Ocupa o espaço restante */}
            <div style={styles.mainContent}>
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;