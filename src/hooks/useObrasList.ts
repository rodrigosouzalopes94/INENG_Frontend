// Frontend/src/hooks/useObrasList.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ObraService } from '../api/ObraService';
import { useAuthContext } from '../context/AuthContext';
import type { Obra, ObraPayload, Foto } from '../models/Obra';

export const useObrasList = () => {
    const [obras, setObras] = useState<Obra[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { logout } = useAuthContext();

    const fetchObras = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ObraService.listObras();
            setObras(data);
        } catch (err: any) {
            console.error("Erro ao carregar obras:", err);
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.error
                ? err.response.data.error
                : 'Falha ao carregar lista de obras.';
            setError(errorMessage);
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        fetchObras();
    }, [fetchObras]);

    /**
     * [NOVO - SUBMIT]
     * (Lógica movida de useObraForm para cá)
     */
    const submitObra = async (
        data: ObraPayload | Partial<ObraPayload>,
        fotos: File[] | null, // Alterado de FileList para File[]
        id?: number
    ): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            if (id) {
                await ObraService.updateObra(id, data, fotos);
            } else {
                await ObraService.createObra(data as ObraPayload, fotos);
            }
            await fetchObras(); // Recarrega a lista
            return true;
        } catch (err: any) {
            console.error("Erro ao salvar obra:", err);
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.error
                ? err.response.data.error
                : 'Erro ao salvar obra.';
            setError(errorMessage);
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                logout();
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * [AJUSTADO - REMOVE]
     */
    const removeObra = async (id: number | string): Promise<boolean> => { // Retorna boolean
        if (!window.confirm("ATENÇÃO: Isso deletará a obra e todos os seus arquivos. Tem certeza?")) return false;

        setLoading(true);
        setError(null);
        try {
            await ObraService.deleteObra(id);
            setObras(prev => prev.filter(obra => obra.id !== Number(id))); // Atualiza estado local
            return true; // Sucesso
        } catch (err: any) {
            console.error("Erro ao deletar obra:", err);
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.error
                ? err.response.data.error
                : 'Erro ao deletar obra.';
            setError(errorMessage);
             if (axios.isAxiosError(err) && err.response?.status === 401) {
                logout();
            }
            return false; // Falha
        } finally {
            setLoading(false);
        }
    };

    // Retorna todas as funções necessárias
    return { obras, loading, error, removeObra, fetchObras, submitObra };
};