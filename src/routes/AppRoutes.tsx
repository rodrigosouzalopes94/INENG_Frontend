// src/routes/AppRoutes.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Telas de Autenticação
import LoginPage from '../pages/LoginPage';
import UserRegisterPage from '../pages/UserRegisterPage';
import RequestResetPage from '../pages/RequestResetPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

// Telas de Módulos
import DashboardPage from '../pages/DashboardPage'; // Sua Dashboard existente
import ClientPage from '../pages/ClientPage';// ✅ NOVO: Página de Clientes
import ProtectedRoute from './ProtectedRoute'; // Componente para rotas protegidas

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* ROTAS DE ACESSO PÚBLICO (AUTENTICAÇÃO) */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/register-user" element={<UserRegisterPage />} />
                <Route path="/request-reset" element={<RequestResetPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* ROTAS PROTEGIDAS (Dashboard, Clientes, Obras, etc.) */}
                <Route
                    path="/dashboard/*"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                
                {/* ✅ ROTA PROTEGIDA PARA CLIENTES */}
                <Route
                    path="/clientes"
                    element={
                        <ProtectedRoute>
                            <ClientPage />
                        </ProtectedRoute>
                    }
                />
                
                {/* ROTA DE REDIRECIONAMENTO (Fallback) */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;