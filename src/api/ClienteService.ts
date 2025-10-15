// src/api/ClienteService.ts

import api from './client';
import type { Cliente, ClientePayload } from '../models/Cliente';

/**
 * Serviço que encapsula todas as chamadas CRUD relacionadas a Clientes.
 */
export const ClienteService = {
  
  // Rota: GET /clientes
  async listClientes(): Promise<Cliente[]> {
    const response = await api.get('/clientes');
    return response.data;
  },

  // Rota: POST /clientes
  async createCliente(data: ClientePayload): Promise<Cliente> {
    const response = await api.post('/clientes', data);
    return response.data.cliente; // O backend retorna { message, cliente }
  },

  // Rota: PUT /clientes/:id
  async updateCliente(id: number, data: ClientePayload): Promise<Cliente> {
    const response = await api.put(`/clientes/${id}`, data);
    return response.data.cliente;
  },

  // Rota: DELETE /clientes/:id
  async deleteCliente(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`);
  },
};