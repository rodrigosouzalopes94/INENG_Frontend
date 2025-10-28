import api from './client'; // Sua instância Axios configurada (api/client.ts)
import type { Funcionario, FuncionarioPayload } from '../models/Funcionario';

/**
 * [HELPER] Função auxiliar interna para construir o FormData.
 * Ela lida com os campos de texto e o arquivo (foto/pdf).
 */
const buildFormData = (
    data: FuncionarioPayload | Partial<FuncionarioPayload>, 
    foto?: File | null // O arquivo (File object)
): FormData => {
    
    const formData = new FormData();

    // 1. Adiciona o arquivo (PDF/JPEG) se ele existir
    if (foto) {
        // O backend espera o campo 'foto' (definido no multer)
        formData.append('foto', foto, foto.name);
    }

    // 2. Adiciona todos os campos de texto do payload
    (Object.keys(data) as Array<keyof typeof data>).forEach(key => {
        const value = data[key];
        
        // Verifica se o valor não é nulo ou indefinido antes de adicionar
        // O FormData converte tudo para string, o que o backend (Express) espera
        if (value !== null && value !== undefined) {
             // Garante que valores (como TipoContrato) sejam convertidos para string
             formData.append(key, value.toString());
        }
    });

    return formData;
};

export const FuncionarioService = {

  /**
   * [GET] /api/v1/funcionarios
   * Lista todos os funcionários.
   */
  listFuncionarios: async (): Promise<Funcionario[]> => {
    const params = { _: new Date().getTime() }; // Evita cache
    const response = await api.get<Funcionario[]>('/funcionarios', { params });
    return response.data;
  },

  /**
   * [GET] /api/v1/funcionarios/:id
   * Busca um funcionário específico.
   */
  getFuncionarioById: async (id: number): Promise<Funcionario> => {
    const response = await api.get<Funcionario>(`/funcionarios/${id}`);
    return response.data;
  },

  /**
   * [POST] /api/v1/funcionarios
   * Cria um novo funcionário.
   * ATUALIZADO: Aceita 'data' (texto) e 'foto' (arquivo) e envia como FormData.
   */
  createFuncionario: async (data: FuncionarioPayload, foto: File | null): Promise<Funcionario> => {
    // Usa o helper para construir o FormData
    const formData = buildFormData(data, foto);
    
    const response = await api.post<Funcionario>('/funcionarios', formData, {
      // Define o header como multipart/form-data
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * [PUT] /api/v1/funcionarios/:id
   * Atualiza um funcionário existente.
   * ATUALIZADO: Aceita 'data' (texto) e 'foto' (arquivo) e envia como FormData.
   */
  updateFuncionario: async (id: number, data: Partial<FuncionarioPayload>, foto: File | null): Promise<Funcionario> => {
    // Usa o helper para construir o FormData
    // O helper já ignora campos undefined (Partial)
    const formData = buildFormData(data, foto);
    
    const response = await api.put<Funcionario>(`/funcionarios/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * [DELETE] /api/v1/funcionarios/:id
   * Deleta um funcionário.
   * (Sem mudanças aqui)
   */
  deleteFuncionario: async (id: number): Promise<void> => {
    await api.delete(`/funcionarios/${id}`);
  },
};