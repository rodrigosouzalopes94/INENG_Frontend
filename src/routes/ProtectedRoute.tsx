// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // espera o hook carregar o usuário
  if (loading) return <div>Carregando...</div>;

  if (!isAuthenticated()) return <Navigate to="/" />;

  return <>{children}</>;
};

export default ProtectedRoute;
