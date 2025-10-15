// src/hooks/useRequestReset.ts

import { useState } from 'react';
import axios from 'axios';
import type { RequestResetPayload } from '../models/User'; 
import { UserService } from '../api/UserService.ts'; // ✅ Agora usa o UserService

interface UseRequestResetReturn {
    requestReset: (data: RequestResetPayload) => Promise<boolean>; 
    loading: boolean;
    error: string | null;
}

export const useRequestReset = (): UseRequestResetReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestReset = async (data: RequestResetPayload): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            // ✅ CHAMADA FINAL: Usa o UserService
            await UserService.requestReset(data); 

            return true;

        } catch (err) {
            let errorMessage = 'Falha ao solicitar o token. Verifique o email.';
            
            if (axios.isAxiosError(err) && err.response) {
                errorMessage = err.response.data.error || 'Erro de comunicação com a API.';
            }
            
            setError(errorMessage);
            return false;

        } finally {
            setLoading(false);
        }
    };

    return { requestReset, loading, error };
};