// src/context/AuthContext.tsx

import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth'; 

// Tipagem baseada no seu useAuth.ts
interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'GESTOR';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: () => boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use o useAuth como fonte de verdade
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para consumir o contexto
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Isso garante que você use o hook DENTRO do <AuthProvider>
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};