// src/hooks/useObrasList.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ObraService } from '../api/ObraService';
import { useAuthContext } from '../context/AuthContext';
import type { Obra } from '../models/Obra';

export const useObrasList = () => {
    const [obras, setObras] = useState<Obra[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { logout } = useAuthContext();

    const fetchObras = useCallback(async () => {
        setLoading(true);
        setError(null);
        console.log('Fetching obras...'); // Debug

        try {
            const data = await ObraService.listObras();
            console.log('Obras recebidas do backend:', data); // Debug
            setObras(data);
        } catch (err) {
            console.error("Erro ao carregar obras:", err);
            const errorMessage =
                axios.isAxiosError(err) && err.response?.data?.error
                    ? err.response.data.error
                    : 'Falha ao carregar lista de obras.';
            setError(errorMessage);

            if (axios.isAxiosError(err) && err.response?.status === 401) {
                console.warn('401 - token inválido, logout...');
                logout();
            }
        } finally {
            setLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        fetchObras();
    }, [fetchObras]);

    const removeObra = async (id: number): Promise<void> => {
        if (!window.confirm("ATENÇÃO: Isso deletará a obra e todos os seus arquivos. Tem certeza?")) return;

        setLoading(true);
        setError(null);
        console.log(`Tentando deletar obra #${id}...`); // Debug

        try {
            await ObraService.deleteObra(id);
            setObras(prev => prev.filter(obra => obra.id !== id));
            alert('Obra deletada com sucesso!');
            console.log(`Obra #${id} deletada com sucesso.`); // Debug
        } catch (err) {
            console.error("Erro ao deletar obra:", err);
            const errorMessage =
                axios.isAxiosError(err) && err.response?.data?.error
                    ? err.response.data.error
                    : 'Erro ao deletar obra.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { obras, loading, error, removeObra, fetchObras };
};
