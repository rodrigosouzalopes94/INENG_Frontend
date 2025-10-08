// src/routes/AppRoutes.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importa as páginas (Views)
import LoginPage from '../pages/LoginPage';
import UserRegisterPage from '../pages/UserRegisterPage';
// import DashboardPage from '../pages/DashboardPage'; // Futura tela principal

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial (Login) */}
        <Route path="/" element={<LoginPage />} />

        {/* Página de cadastro de usuário */}
        <Route path="/register" element={<UserRegisterPage />} />

        {/* Rota padrão: redireciona para o login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
