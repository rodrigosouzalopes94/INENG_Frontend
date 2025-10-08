// src/api/UserService.ts
import api from './client';
import type { RegisterUserPayload } from '../models/User';

export const UserService = {
  async registerUser(data: RegisterUserPayload) {
    // Corrigido: /auth/register
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};
