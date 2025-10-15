// src/hooks/useAuth.ts

import { useState, useEffect, useCallback } from 'react';

// Tipagem corrigida para refletir o schema do backend (ADMIN/GESTOR)
interface User {
  id: number; // Alterado para number, alinhando-se ao ID do Prisma
  name: string;
  email: string;
  role: 'ADMIN' | 'GESTOR'; // ✅ Alinhado com o backend
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  // O estado 'loading' começa como true para bloquear a renderização até a checagem do storage
  const [loading, setLoading] = useState(true); 

  // 1. Lógica de Leitura do Storage (Executa apenas na montagem)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // 1. Tenta ler o user e o token
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Se o JSON estiver corrompido, limpa tudo
        console.error("Erro ao parsear user do localStorage:", e);
        localStorage.clear(); 
      }
    }
    
    // ✅ CRÍTICO: Seta loading para false SOMENTE DEPOIS que a checagem foi concluída.
    setLoading(false); 
  }, []);

  // 2. Lógica de Autenticação (Memoizada)
  const isAuthenticated = useCallback(() => {
    // Retorna true se houver objeto 'user' no estado, que só é setado se o token também for encontrado.
    return !!user; 
  }, [user]);

  // 3. Funções de Manipulação
  const login = (userData: User, token: string) => {
    // Armazena dados essenciais no localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear(); // Limpa ambos
    setUser(null);
    // Nota: O redirecionamento para '/' é feito pelo ProtectedRoute após o estado 'user' mudar
  };

  return {
    user, 
    login, 
    logout, 
    isAuthenticated, 
    loading, // CRÍTICO para o ProtectedRoute
  };
};