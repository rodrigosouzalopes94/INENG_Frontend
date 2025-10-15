// src/hooks/useClientes.ts

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ClienteService } from '../api/ClienteService.ts';
import type { Cliente, ClientePayload } from '../models/Cliente';
// ❌ REMOVEMOS: import { useNavigate } from 'react-router-dom';
// ✅ NOVO: Importamos o hook do contexto de autenticação
import { useAuthContext } from '../context/AuthContext';

export const useClientes = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // ✅ OBTEMOS APENAS O LOGOUT DO CONTEXTO DE AUTENTICAÇÃO
    const { logout } = useAuthContext();

    // Função que busca todos os clientes
    const fetchClientes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ClienteService.listClientes();
            setClientes(data);
        } catch (err) {
            console.error("Erro ao carregar clientes:", err);
            setError(axios.isAxiosError(err) && err.response?.data?.error ? err.response.data.error : 'Falha ao carregar lista de clientes.');

            // ✅ CORREÇÃO: Usa logout() para limpar estado e redirecionar
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                logout(); // Limpa tokens e redireciona para o login
            }
        } finally {
            setLoading(false);
        }
        // Remove 'navigate' dos deps, que não é mais necessário
    }, [logout]);

    useEffect(() => {
        fetchClientes();
    }, [fetchClientes]);

    // ... (submitCliente e removeCliente permanecem os mesmos)
    const submitCliente = async (data: ClientePayload, id?: number): Promise<boolean> => {
        // ... (lógica de submissão)
    };

    const removeCliente = async (id: number): Promise<void> => {
        // ... (lógica de remoção)
    };

    return { clientes, loading, error, submitCliente, removeCliente, fetchClientes };
};