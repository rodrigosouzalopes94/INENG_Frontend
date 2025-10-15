// src/hooks/useResetPassword.ts

import { useState } from 'react';
import axios from 'axios';
import type { ResetPasswordPayload } from '../models/User'; 
import { UserService } from '../api/UserService.ts'; // Serviço que fará o POST

interface UseResetPasswordReturn {
    resetPassword: (data: ResetPasswordPayload) => Promise<boolean>;
    loading: boolean;
    error: string | null;
}

export const useResetPassword = (): UseResetPasswordReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetPassword = async (data: ResetPasswordPayload): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            // ✅ CHAMADA DE API REAL: O Service faz o Axios.post
            await UserService.resetPassword(data); 
            return true;

        } catch (err) {
            let errorMessage = 'Falha ao redefinir senha.';
            
            if (axios.isAxiosError(err) && err.response) {
                errorMessage = err.response.data.error || 'Erro de comunicação com a API.';
            }
            
            setError(errorMessage);
            return false;

        } finally {
            setLoading(false);
        }
    };

    return { resetPassword, loading, error };
};