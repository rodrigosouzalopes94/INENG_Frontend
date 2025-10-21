import api from './client';
import type { Equipamento, TipoMovimento } from '../models/Equipamento';

// Interface para os dados do formulário de movimento (JSON)
interface MovimentoData {
  equipamentoId: number;
  tipo: TipoMovimento;
  quantidade: number;
  motivo?: string;
}

export const EquipamentoService = {
  
  /**
   * Busca todos os equipamentos.
   */
  getAllEquipamentos: async (): Promise<Equipamento[]> => {
    const response = await api.get<Equipamento[]>('/equipamentos');
    return response.data;
  },

  /**
   * Busca um equipamento por ID (incluindo seu histórico).
   */
  getEquipamentoById: async (id: number): Promise<Equipamento> => {
    const response = await api.get<Equipamento>(`/equipamentos/${id}`);
    return response.data;
  },

  /**
   * Cria um novo equipamento. Requer FormData por causa da foto.
   */
  createEquipamento: async (formData: FormData): Promise<Equipamento> => {
    const response = await api.post<Equipamento>('/equipamentos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Atualiza um equipamento. Requer FormData se houver nova foto.
   */
  updateEquipamento: async (id: number, formData: FormData): Promise<Equipamento> => {
    const response = await api.put<Equipamento>(`/equipamentos/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Deleta um equipamento.
   */
  deleteEquipamento: async (id: number): Promise<void> => {
    await api.delete(`/equipamentos/${id}`);
  },

  /**
   * Registra uma entrada ou saída de estoque. (JSON)
   */
  registrarMovimento: async (data: MovimentoData): Promise<Equipamento> => {
    const response = await api.post<Equipamento>('/equipamentos/movimento', data);
    return response.data;
  },
};