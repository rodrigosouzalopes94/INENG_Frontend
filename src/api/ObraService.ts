import api from './client';
import type { Obra } from '../models/Obra';

const BASE_ENDPOINT = '/obras';

export const ObraService = {

  async createObra(formData: FormData): Promise<Obra> {
    const response = await api.post<Obra>(BASE_ENDPOINT, formData);
    return response.data;
  },

  async listObras(): Promise<Obra[]> {
    const response = await api.get<Obra[]>(BASE_ENDPOINT);
    return response.data;
  },

  async getObraById(id: number): Promise<Obra> {
    const response = await api.get<Obra>(`${BASE_ENDPOINT}/${id}`);
    return response.data;
  },

  // ✅ Atualizado para aceitar FormData
  async updateObra(id: number, formData: FormData): Promise<Obra> {
    const response = await api.put<Obra>(
      `${BASE_ENDPOINT}/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  async deleteObra(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`${BASE_ENDPOINT}/${id}`);
    return response.data;
  },
};
