// Importa defineConfig do 'vitest/config' para validar a chave 'test'
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Detecta se estamos no modo de produção (usado pela Vercel durante o build)
  const isProd = mode === 'production';

  return {
    plugins: [react()], // Plugin essencial para React

    // Configuração do servidor de desenvolvimento local (`npm run dev`)
    server: {
      proxy: {
        // Quando o frontend (ex: localhost:5173) chama '/api/v1/...'
        // este proxy redireciona a chamada para o seu backend local
        '/api/v1': { // <-- Certifique-se que o prefixo '/api/v1' bate com o que o frontend chama
          target: 'http://localhost:3000', // <-- URL onde seu backend roda LOCALMENTE
          changeOrigin: true, // Necessário para evitar muitos erros de CORS localmente
          secure: false,      // Pode ser útil se o backend local não usa HTTPS
          // 'rewrite' geralmente não é necessário se 'target' é a raiz do backend
          // e o backend já espera por '/api/v1/...'. Use se precisar ajustar o caminho.
          // rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1')
        }
      },
      port: 5173, // Opcional: Define a porta padrão para o dev server
    },

    // Define variáveis de ambiente que serão injetadas no código
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
        isProd
          // VALOR PARA PRODUÇÃO/HOMOLOGAÇÃO (Vercel):
          // Use a URL completa do seu backend deployado na Vercel + prefixo da API
          ? 'https://ineng-backend.vercel.app/api/v1' // <-- SUA URL DO BACKEND VERCEL AQUI
          // VALOR PARA DESENVOLVIMENTO LOCAL:
          // Usa o caminho que será interceptado pelo proxy configurado acima
          : '/api/v1'
      ),
      // Adicione outras variáveis 'define' se necessário
      // 'import.meta.env.VITE_ALGUMA_CHAVE': JSON.stringify(isProd ? 'valorProd' : 'valorDev'),
    },

    // Diretório de saída do build (`npm run build`)
    build: {
      outDir: 'dist', // Pasta onde os arquivos compilados serão gerados (bate com vercel.json)
    },

    // Configuração de aliases para imports (opcional)
    resolve: {
      alias: {
        // Permite usar import '@/components/...' em vez de '../../components/...'
        '@': '/src',
        // Exemplo usando path (requer imports 'path' e 'url' no topo):
        // '@': path.resolve(__dirname, './src'),
      },
    },

    // Configuração do Vitest (mantida da sua versão)
    test: {
      globals: true, // Permite usar expect, it, describe globalmente
      environment: 'jsdom', // Simula o ambiente do navegador (DOM)
      setupFiles: ['./src/test/setup.ts'], // Arquivo de setup inicial
      css: false, // Ignora importações de CSS durante os testes
    },
  };
});