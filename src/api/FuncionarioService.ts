import api from './client'; // Sua instância Axios configurada (api/client.ts)
import type { Funcionario, FuncionarioPayload } from '../models/Funcionario';

export const FuncionarioService = {

  /**
   * [GET] /api/v1/funcionarios
   * Lista todos os funcionários (baseado na permissão do usuário logado).
   */
  listFuncionarios: async (): Promise<Funcionario[]> => {
    // Adiciona um timestamp para evitar cache em requisições GET
    const params = { _: new Date().getTime() };
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
   */
  createFuncionario: async (data: FuncionarioPayload): Promise<Funcionario> => {
    const response = await api.post<Funcionario>('/funcionarios', data);
    return response.data;
  },

  /**
   * [PUT] /api/v1/funcionarios/:id
   * Atualiza um funcionário existente.
   * Usamos Partial<FuncionarioPayload> para permitir atualizações parciais.
   */
  updateFuncionario: async (id: number, data: Partial<FuncionarioPayload>): Promise<Funcionario> => {
    const response = await api.put<Funcionario>(`/funcionarios/${id}`, data);
    return response.data;
  },

  /**
   * [DELETE] /api/v1/funcionarios/:id
   * Deleta um funcionário.
   */
  deleteFuncionario: async (id: number): Promise<void> => {
    await api.delete(`/funcionarios/${id}`);
  },
};