// src/hooks/useClientes.ts

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ClienteService } from '../api/ClienteService.ts';
import type { Cliente, ClientePayload } from '../models/Cliente';
import { useAuthContext } from '../context/AuthContext'; // Para logout em caso de 401

export const useClientes = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.error ? err.response.data.error : 'Falha ao carregar lista de clientes.';
            setError(errorMessage);
            
            // Redirecionamento de segurança em caso de token expirado
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                logout(); 
            }
        } finally {
            setLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        fetchClientes();
    }, [fetchClientes]);

    // Lógica do submitCliente (CREATE/UPDATE)
    const submitCliente = async (data: ClientePayload, id?: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            // Faz a chamada de criação ou atualização
            id 
                ? await ClienteService.updateCliente(id, data)
                : await ClienteService.createCliente(data);
            
            // Recarrega a lista e retorna sucesso
            await fetchClientes(); 
            return true;
        } catch (err) {
            console.error("Erro na submissão:", err);
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.error ? err.response.data.error : 'Erro ao salvar cliente.';
            setError(errorMessage);
            return false; // Sinaliza falha
        } finally {
            setLoading(false);
        }
    };
    
    // Processo de Deleção
    const removeCliente = async (id: number): Promise<void> => {
        if (!window.confirm("Tem certeza que deseja deletar este cliente? Esta ação não pode ser desfeita.")) return;
        setLoading(true);
        setError(null);
        try {
            await ClienteService.deleteCliente(id);
            // Atualiza o estado removendo o cliente deletado sem recarregar a lista
            setClientes(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.error ? err.response.data.error : 'Erro ao deletar cliente.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    return { clientes, loading, error, submitCliente, removeCliente, fetchClientes };
};