// src/routes/AppRoutes.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Telas de Autenticação
import LoginPage from '../pages/LoginPage';
import UserRegisterPage from '../pages/UserRegisterPage';
import RequestResetPage from '../pages/RequestResetPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

// Telas de Módulos
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import ClientPage from '../pages/ClientPage';
import ObraPage from '../pages/ObraPage';

import UnauthorizedPage from '../pages/UnanthorizedPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* ROTAS DE ACESSO PÚBLICO (AUTENTICAÇÃO) */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/register-user" element={<UserRegisterPage />} />
                <Route path="/request-reset" element={<RequestResetPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* ADICIONADO: ROTA PÚBLICA DE ERRO (ACESSO NEGADO) */}
                <Route path="/acesso-negado" element={<UnauthorizedPage />} />

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
                <Route
                    path="/obras"
                    element={
                        <ProtectedRoute>
                            <ObraPage />
                        </ProtectedRoute>
                    }
                />

                {/* MODIFICADO: ROTA DE FALLBACK (404) 
                  Isso substitui o seu <Navigate to="/" /> 
                  e deve ser a ÚLTIMA rota da lista.
                */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;