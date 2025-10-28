import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Importa axios para checagem de erro
import { FuncionarioService } from '../api/FuncionarioService'; // Service de Funcionário (já refatorado)
import type { Funcionario, FuncionarioPayload } from '../models/Funcionario'; // Modelos de Funcionário
import { useAuthContext } from '../context/AuthContext'; // Para logout em caso de 401

export const useFuncionarios = () => {
    // Estado para a lista de funcionários
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    // Estados de loading e erro
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Pega a função logout do contexto
    const { logout } = useAuthContext(); 

    /**
     * [GET] Busca a lista de funcionários.
     * (Mantido como no seu código)
     */
    const fetchFuncionarios = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await FuncionarioService.listFuncionarios();
            setFuncionarios(data);
        } catch (err) {
            console.error("Erro ao carregar funcionários:", err);
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.error 
                ? err.response.data.error 
                : 'Falha ao carregar lista de funcionários.';
            setError(errorMessage);
            
            // ✅ IMPORTANTE: Se o erro for 401 (Não Autorizado), desloga o usuário
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                alert("Sua sessão expirou. Por favor, faça login novamente."); // Feedback opcional
                logout(); 
            }
        } finally {
            setLoading(false);
        }
    }, [logout]); // Depende do logout

    // Busca inicial ao montar o componente
    useEffect(() => {
        fetchFuncionarios();
    }, [fetchFuncionarios]);

    /**
     * [CREATE/UPDATE] Submete (cria ou atualiza) um funcionário.
     * ATUALIZADO: Aceita 'data' (payload de texto) e 'foto' (arquivo) separadamente.
     */
    const submitFuncionario = async (
        data: FuncionarioPayload | Partial<FuncionarioPayload>, // Dados de texto do formulário
        foto: File | null, // O arquivo (foto/pdf) ou null
        id?: number // ID (se for edição)
    ): Promise<boolean> => {
        
        setLoading(true); // Usa o loading principal do hook
        setError(null);
        
        try {
            if (id) {
                // MODO UPDATE: Chama updateFuncionario(id, data, foto)
                // 'data' pode ser Partial<FuncionarioPayload>
                await FuncionarioService.updateFuncionario(id, data, foto);
            } else {
                // MODO CREATE: Chama createFuncionario(data, foto)
                // 'data' DEVE ser o FuncionarioPayload completo
                await FuncionarioService.createFuncionario(data as FuncionarioPayload, foto);
            }
            
            // Recarrega a lista após o sucesso (mantendo padrão do useClientes)
            await fetchFuncionarios(); 
            return true; // Sucesso
        } catch (err) {
            console.error("Erro na submissão de funcionário:", err);
            // Lógica de erro mantida (igual ao seu código)
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.error 
                ? err.response.data.error 
                : 'Erro ao salvar funcionário.';
            setError(errorMessage);
            
            // ✅ Trata 401 também no submit
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                alert("Sua sessão expirou. Por favor, faça login novamente.");
                logout();
            }
            return false; // Falha
        } finally {
            setLoading(false);
        }
    };
    
    /**
     * [DELETE] Remove um funcionário.
     * (Mantido como no seu código)
     */
    const removeFuncionario = async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await FuncionarioService.deleteFuncionario(id);
            
            // Atualiza o estado local removendo o item
            setFuncionarios(prev => prev.filter(f => f.id !== id));
            return true; // Sucesso
        } catch (err: any) {
            console.error(`Erro ao deletar funcionário ${id}:`, err);
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.error 
                ? err.response.data.error 
                : 'Erro ao deletar funcionário.';
            setError(errorMessage);
            
             // ✅ Trata 401 também no delete
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                alert("Sua sessão expirou. Por favor, faça login novamente.");
                logout();
            }
            return false; // Falha
        } finally {
            setLoading(false);
        }
    };

    // Retorna os dados e as funções
    return { 
        funcionarios, 
        loading, 
        error, 
        submitFuncionario, // Assinatura atualizada
        removeFuncionario, 
        fetchFuncionarios 
    };
};