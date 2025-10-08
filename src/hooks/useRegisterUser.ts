import { useState } from 'react';
import axios from 'axios';
import { UserService } from '../api/UserService';
import type { RegisterUserPayload, UserRole } from '../models/User';

interface UseRegisterUserReturn {
    registerUser: (data: RegisterUserPayload) => Promise<{ success: boolean; message?: string }>;
    loading: boolean;
    error: string | null;
}

export const useRegisterUser = (): UseRegisterUserReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const registerUser = async (data: RegisterUserPayload) => {
        setLoading(true);
        setError(null);

        try {
            // Normalização de dados
            const payload: RegisterUserPayload = {
                ...data,
                role: data.role.toUpperCase() as UserRole, // força o tipo UserRole
                cpf: data.cpf.replace(/\D/g, ''),
            };

            const response = await UserService.registerUser(payload);

            return { success: true, message: response.message || 'Cadastro realizado com sucesso!' };
        } catch (err: unknown) {
            let errorMessage = 'Erro desconhecido. Verifique o servidor.';

            // Se for erro do Axios, tenta extrair a mensagem
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }

            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return { registerUser, loading, error };
};
