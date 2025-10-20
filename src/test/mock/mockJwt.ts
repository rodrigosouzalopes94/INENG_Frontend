// src/tests/mocks/mockJwt.ts

import { vi } from 'vitest';

// Gera um token simulado que muda a cada chamada, garantindo isolamento
export const generateMockToken = () => `MOCK_TOKEN_${Math.random().toString(36).substring(2, 15)}`;

// Mock do módulo jsonwebtoken
const mockJwt = {
    // A função sign é usada no backend para criar o token. Mockamos para retornar o mockToken.
    sign: vi.fn(() => generateMockToken()),

    // A função verify é usada no authMiddleware para validar o token.
    // Ela deve retornar o payload DECODIFICADO que o backend espera (userId, role).
    verify: vi.fn(() => ({
        userId: 1, // ID fixo para o usuário mockado
        role: 'GESTOR', // Role fixo
        name: 'Test User',
    })),
    
    // Adicione decode: vi.fn() se você usar jwt.decode
};

// Mocka o módulo jsonwebtoken
vi.mock('jsonwebtoken', () => mockJwt);