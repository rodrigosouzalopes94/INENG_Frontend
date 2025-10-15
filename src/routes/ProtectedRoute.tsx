// src/routes/ProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // O hook que verifica o token e o user

interface ProtectedRouteProps {
    children: React.ReactNode;
    // Futuramente, adicionaria a prop 'allowedRoles?: UserRole[]'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    // Puxa o estado global de autenticação
    const { isAuthenticated, loading } = useAuth(); 

    if (loading) {
        // Opção 1: Retorna null ou um spinner enquanto carrega o estado do localStorage
        return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Carregando...</div>;
    }

    // Se o usuário NÃO estiver autenticado (não há token ou user no storage)
    if (!isAuthenticated()) {
        // ✅ Redireciona para o login (A causa do seu problema)
        // O replace=true evita que o usuário volte para a tela anterior
        return <Navigate to="/" replace />; 
    }

    // Se o usuário ESTIVER autenticado, renderiza o componente filho (ClientPage, DashboardPage, etc.)
    return <>{children}</>;
};

export default ProtectedRoute;