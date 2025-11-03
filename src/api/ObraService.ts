// Frontend/src/api/ObraService.ts
import api from './client';
import type { Obra, ObraPayload, Foto } from '../models/Obra';

/**
 * [HELPER] Constrói o FormData para Obras (aceita múltiplos arquivos)
 */
const buildObraFormData = (
    data: ObraPayload | Partial<ObraPayload>,
    fotos?: File[] | null // Aceita Array de Files
): FormData => {
    
    const formData = new FormData();

    // 1. Adiciona os arquivos (o backend espera 'fotos')
    if (fotos && fotos.length > 0) {
        Array.from(fotos).forEach((file, index) => {
            formData.append('fotos', file, file.name);
        });
    }

    // 2. Adiciona os dados de texto
    (Object.keys(data) as Array<keyof typeof data>).forEach(key => {
        const value = data[key];
        if (value !== null && value !== undefined) {
            formData.append(key, String(value)); // Converte tudo (inclusive clienteId) para string
        }
    });

    return formData;
};

export const ObraService = {

  /**
   * [POST - REFATORADO] Cria Obra
   */
  createObra: async (data: ObraPayload, fotos: File[] | null): Promise<Obra> => {
    const formData = buildObraFormData(data, fotos);
    // O backend retorna { message: '...', obra: {...} }
    // Precisamos pegar o 'obra' de dentro
    const response = await api.post<{ message: string, obra: Obra }>('/obras', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.obra; // Retorna o objeto Obra
  },

  /**
   * [GET-ALL] Lista Obras
   */
  listObras: async (): Promise<Obra[]> => {
    const params = { _: new Date().getTime() };
    const response = await api.get<Obra[]>('/obras', { params });
    return response.data;
  },

  /**
   * [GET-ONE] Busca Obra por ID
   */
  getObraById: async (id: number): Promise<Obra> => {
    const response = await api.get<Obra>(`/obras/${id}`);
    return response.data;
  },

  /**
   * [PUT - REFATORADO] Atualiza Obra
   */
  updateObra: async (id: number, data: Partial<ObraPayload>, fotos: File[] | null): Promise<Obra> => {
    const formData = buildObraFormData(data, fotos);
    
    // (A lógica de 'fotosExistentes' precisa ser tratada no backend ou enviada no FormData)
    
    const response = await api.put<{ message: string, obra: Obra }>(`/obras/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.obra; // Retorna o objeto Obra
  },

  /**
   * [DELETE] Deleta Obra
   */
  deleteObra: async (id: number | string): Promise<void> => {
    await api.delete(`/obras/${Number(id)}`);
  },
};