import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Importa axios para checagem de erro
import { EquipamentoService } from '../api/EquipamentoService'; // Service refatorado
// Importa os modelos, incluindo o Payload
import type { Equipamento, EquipamentoPayload } from '../models/Equipamento'; 
import { useAuthContext } from '../context/AuthContext'; // Para logout em caso de 401

export const useEquipamentos = () => {
    // Seus estados originais
    const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Pega a função logout do contexto
    const { logout } = useAuthContext(); 

    /**
     * [GET] Busca a lista de equipamentos.
     * ATUALIZADO: Com tratamento de erro 401.
     */
    const fetchEquipamentos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await EquipamentoService.getAllEquipamentos();
            setEquipamentos(data);
        } catch (err) {
            console.error("Erro ao carregar equipamentos:", err);
            // Mensagem de erro genérica (como no seu original)
            setError('Falha ao carregar equipamentos.'); 
            
            // ✅ IMPORTANTE: Adiciona a verificação de 401 (Autenticação)
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                alert("Sua sessão expirou. Por favor, faça login novamente.");
                logout(); 
            }
        } finally {
            setLoading(false);
        }
    }, [logout]); // Adiciona logout como dependência

    // Busca inicial (sem alteração)
    useEffect(() => {
        fetchEquipamentos();
    }, [fetchEquipamentos]);

    /**
     * [NOVO - CREATE/UPDATE]
     * Submete (cria ou atualiza) um equipamento.
     * Aceita 'data' (payload) e 'foto' (arquivo) separadamente.
     */
    const submitEquipamento = async (
        data: EquipamentoPayload | Partial<EquipamentoPayload>, 
        foto: File | null, 
        id?: number
    ): Promise<boolean> => {
        
        setLoading(true); // Usa o loading principal do hook
        setError(null);
        
        try {
            if (id) {
                // MODO UPDATE: Chama o service refatorado
                await EquipamentoService.updateEquipamento(id, data, foto);
            } else {
                // MODO CREATE: Chama o service refatorado
                await EquipamentoService.createEquipamento(data as EquipamentoPayload, foto);
            }
            
            await fetchEquipamentos(); // Recarrega a lista após o sucesso
            return true; // Sucesso
        } catch (err) {
            console.error("Erro na submissão de equipamento:", err);
            // Mensagem de erro genérica
            setError('Erro ao salvar equipamento.'); 
            
            // ✅ Adiciona a verificação de 401 (Autenticação)
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
     * [NOVO - DELETE] Remove um equipamento.
     */
    const removeEquipamento = async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await EquipamentoService.deleteEquipamento(id);
            
            // Atualiza o estado local removendo o item
            setEquipamentos(prev => prev.filter(e => e.id !== id));
            return true; // Sucesso
        } catch (err: any) {
            console.error(`Erro ao deletar equipamento ${id}:`, err);
            // Mensagem de erro genérica
            setError('Erro ao deletar equipamento.'); 
            
            // ✅ Adiciona a verificação de 401 (Autenticação)
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                alert("Sua sessão expirou. Por favor, faça login novamente.");
                logout();
            }
            return false; // Falha
        } finally {
            setLoading(false);
        }
    };

    // Retorna os dados e as novas funções
    return { 
        equipamentos, 
        loading, 
        error, 
        fetchEquipamentos, // Função original (agora com 401)
        submitEquipamento, // ✅ NOVA FUNÇÃO ADICIONADA
        removeEquipamento  // ✅ NOVA FUNÇÃO ADICIONADA
    };
};