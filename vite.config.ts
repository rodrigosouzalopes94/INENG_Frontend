// vite.config.ts

// ✅ CORREÇÃO: Importamos defineConfig do 'vitest/config' para que o objeto 'test' seja reconhecido
import { defineConfig } from 'vitest/config'; 
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // CONFIGURAÇÃO DO VITEST
  test: {
    globals: true, // Permite usar expect, it, describe globalmente
    environment: 'jsdom', // Simula o ambiente do navegador (DOM)
    setupFiles: ['./src/test/setup.ts'], // Arquivo de setup inicial (para RTL e Mocks)
    css: false, // Ignora importações de CSS durante os testes
  },
});