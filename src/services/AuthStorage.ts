// src/services/AuthStorage.ts

// ✅ CHAVE ALINHADA COM O useAuth.ts
const TOKEN_KEY = 'token'; 

export const AuthStorage = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
  // O seu useAuth faz um localStorage.clear(), mas é bom manter o clear também
  clear: (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem(TOKEN_KEY);
  }
};