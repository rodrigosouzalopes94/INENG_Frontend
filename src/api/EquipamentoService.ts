import api from './client';
// IMPORTANTE: Adicione 'EquipamentoPayload' ao seu arquivo models/Equipamento.ts
import type { Equipamento, TipoMovimento } from '../models/Equipamento';
import type { EquipamentoPayload } from '../models/Funcionario';

// Interface para os dados do formulário de movimento (JSON)
interface MovimentoData {
  equipamentoId: number;
  tipo: TipoMovimento;
  quantidade: number;
  motivo?: string;
}

/**
 * [HELPER] Função auxiliar interna para construir o FormData.
 * Lida com os campos de texto do equipamento e o arquivo.
 */
const buildFormData = (
    data: EquipamentoPayload | Partial<EquipamentoPayload>, 
    foto?: File | null
): FormData => {
    
    const formData = new FormData();

    // Adiciona o arquivo (Foto/PDF) se ele existir
    if (foto) {
        formData.append('foto', foto, foto.name);
    }

    // Adiciona os campos de texto
    (Object.keys(data) as Array<keyof typeof data>).forEach(key => {
        const value = data[key];
        if (value !== null && value !== undefined) {
             formData.append(key, value as string);
        }
    });

    return formData;
};


export const EquipamentoService = {
  
  /**
   * [GET] Busca todos os equipamentos.
   */
  getAllEquipamentos: async (): Promise<Equipamento[]> => {
    const params = { _: new Date().getTime() }; // Evita cache
    const response = await api.get<Equipamento[]>('/equipamentos', { params });
    return response.data;
  },

  /**
   * [GET] Busca um equipamento por ID.
   */
  getEquipamentoById: async (id: number): Promise<Equipamento> => {
    const response = await api.get<Equipamento>(`/equipamentos/${id}`);
    return response.data;
  },

  /**
   * [POST - REFATORADO] Cria um novo equipamento.
   * Aceita dados de texto e arquivo, e constrói o FormData internamente.
   */
  createEquipamento: async (data: EquipamentoPayload, foto: File | null): Promise<Equipamento> => {
    const formData = buildFormData(data, foto);
    
    const response = await api.post<Equipamento>('/equipamentos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * [PUT - REFATORADO] Atualiza um equipamento.
   * Aceita dados de texto e arquivo, e constrói o FormData internamente.
   */
  updateEquipamento: async (id: number, data: Partial<EquipamentoPayload>, foto: File | null): Promise<Equipamento> => {
    const formData = buildFormData(data, foto);
    
    const response = await api.put<Equipamento>(`/equipamentos/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * [DELETE] Deleta um equipamento.
   */
  deleteEquipamento: async (id: number): Promise<void> => {
    await api.delete(`/equipamentos/${id}`);
  },

  /**
   * [POST] Registra uma entrada ou saída de estoque. (JSON)
   */
  registrarMovimento: async (data: MovimentoData): Promise<Equipamento> => {
    const response = await api.post<Equipamento>('/equipamentos/movimento', data);
    return response.data;
  },
};