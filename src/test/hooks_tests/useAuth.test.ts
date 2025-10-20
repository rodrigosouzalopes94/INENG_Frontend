// src/tests/hooks_tests/useAuth.test.ts

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useAuth } from '../../hooks/useAuth'; 

// ==========================================================
// ✅ HELPER: Geração de Token Temporário e Único
// ==========================================================
const generateMockToken = () => `MOCK_TOKEN_${Math.random().toString(36).substring(2, 10)}`;


// ==========================================================
// MOCK DO LOCAL STORAGE
// ==========================================================
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });


// DADOS MOCKADOS
const mockUserData = { id: 101, name: 'Admin Teste', email: 'admin@test.com', role: 'ADMIN' };


describe('useAuth', () => {
  beforeEach(() => {
    localStorageMock.clear(); 
    vi.useFakeTimers(); 
  });
  
  afterEach(() => {
    vi.useRealTimers(); 
  });

  // -------------------------------------------------------------
  // TESTES DE INICIALIZAÇÃO
  // -------------------------------------------------------------

  it('deve ser false após a checagem inicial (quando não há token)', async () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      vi.advanceTimersByTime(100); 
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated()).toBe(false);
  });

  it('deve carregar o usuário automaticamente do storage na inicialização', async () => {
    // ✅ Token gerado dinamicamente para este teste
    const dynamicToken = generateMockToken(); 
    
    // 1. Configura o storage ANTES de renderizar o hook
    localStorageMock.setItem('user', JSON.stringify(mockUserData));
    localStorageMock.setItem('token', dynamicToken);
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // 2. Verifica se o hook carregou o estado
    expect(result.current.isAuthenticated()).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.user?.id).toBe(mockUserData.id);
  });

  // -------------------------------------------------------------
  // TESTES DE FUNÇÕES (login/logout)
  // -------------------------------------------------------------

  it('deve executar login, salvar o user/token e setar isAuthenticated como true', () => {
    const { result } = renderHook(() => useAuth());
    // ✅ Token gerado dinamicamente para este teste
    const dynamicToken = generateMockToken(); 

    act(() => {
      result.current.login(mockUserData as any, dynamicToken);
    });

    // Verifica o estado e se o token dinâmico foi salvo
    expect(result.current.isAuthenticated()).toBe(true);
    expect(localStorageMock.getItem('token')).toBe(dynamicToken); 
  });

  it('deve executar logout e limpar o estado/storage', () => {
    const { result } = renderHook(() => useAuth());
    // Inicia autenticado com token dinâmico
    act(() => {
        result.current.login(mockUserData as any, generateMockToken());
    });
    
    // Executa logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated()).toBe(false);
    expect(localStorageMock.getItem('token')).toBeNull();
  });
  
  // -------------------------------------------------------------
  // TESTES DE ERRO/LIMPEZA
  // -------------------------------------------------------------
  
  it('deve limpar o storage se os dados do usuário estiverem corrompidos', async () => {
      // Configura o storage com JSON inválido e um token dinâmico
      localStorageMock.setItem('user', '{ "id": 1, "name":'); 
      localStorageMock.setItem('token', generateMockToken());
      
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        vi.advanceTimersByTime(100);
      });
      
      expect(result.current.user).toBeNull();
      expect(localStorageMock.getItem('user')).toBeNull();
      expect(localStorageMock.getItem('token')).toBeNull();
  });
});