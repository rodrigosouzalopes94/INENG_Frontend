// src/api/UserService.ts

import api from './client';
import type { RegisterUserPayload, RequestResetPayload } from '../models/User'; // Importa o novo payload

export const UserService = {
    async registerUser(data: RegisterUserPayload) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
    
    // ✅ NOVO: Função para solicitar o token de reset de senha
    async requestReset(data: RequestResetPayload) {
        // A rota será: POST /auth/request-reset
        const response = await api.post('/auth/request-reset', data);
        return response.data;
    },

    // Futuramente, aqui entraria o login e o resetPassword final
};