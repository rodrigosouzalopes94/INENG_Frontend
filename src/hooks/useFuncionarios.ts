import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Importa axios para checagem de erro
import { FuncionarioService } from '../api/FuncionarioService'; // Service de Funcionário
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
     * Usado pelo FuncionarioForm.
     */
    const submitFuncionario = async (data: FuncionarioPayload, id?: number): Promise<boolean> => {
        setLoading(true); // Usa o loading principal do hook
        setError(null);
        try {
            // Lógica idêntica ao useClientes:
            id 
                ? await FuncionarioService.updateFuncionario(id, data)
                : await FuncionarioService.createFuncionario(data);
            
            // Recarrega a lista após o sucesso (idêntico ao useClientes)
            await fetchFuncionarios(); 
            return true; // Sucesso
        } catch (err) {
            console.error("Erro na submissão de funcionário:", err);
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
     */
    const removeFuncionario = async (id: number): Promise<boolean> => { // Retorna boolean para feedback
        // Confirmação (idêntica ao useClientes)
        // O window.confirm foi movido para a Page, mas se quiser manter no hook:
        // if (!window.confirm("Tem certeza que deseja deletar este funcionário?")) return false;

        setLoading(true); // Indica que uma ação está ocorrendo
        setError(null);
        try {
            await FuncionarioService.deleteFuncionario(id);
            
            // Atualiza o estado local removendo o item (idêntico ao useClientes)
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
        submitFuncionario, 
        removeFuncionario, 
        fetchFuncionarios 
    };
};