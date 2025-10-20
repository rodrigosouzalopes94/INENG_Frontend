// src/tests/hooks_tests/useClientes.test.ts

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useClientes } from '../../hooks/useClientes';
import { ClienteService } from '../../api/ClienteService'; 
import { useAuthContext } from '../../context/AuthContext';
import type { Cliente, ClientePayload } from '../../models/Cliente';
import axios from 'axios';

// ==========================================================
// ✅ HELPER: Geração de Token Temporário e Único
// ==========================================================
// (Este helper não é usado neste arquivo, mas mantém consistência no projeto)
const generateMockToken = () => `MOCK_TOKEN_${Math.random().toString(36).substring(2, 10)}`;


// ==========================================================
// MOCKS DE DEPENDÊNCIAS
// ==========================================================

// 1. Mock do ClienteService (Simula as respostas da API)
const mockListClientes = vi.spyOn(ClienteService, 'listClientes');
const mockCreateCliente = vi.spyOn(ClienteService, 'createCliente');
const mockDeleteCliente = vi.spyOn(ClienteService, 'deleteCliente');

// 2. Mock do AuthContext (Simula o logout)
const mockLogout = vi.fn();
vi.mock('../../context/AuthContext', () => ({
    useAuthContext: () => ({
        logout: mockLogout,
    }),
}));

// Dados mock
const mockClientesList: Cliente[] = [
    { id: 1, nomeOuRazao: 'Cliente A', tipoPessoa: 'FISICA', cpf: '123', cep: '888', enderecoCompleto: 'Rua X' } as Cliente,
    { id: 2, nomeOuRazao: 'Cliente B', tipoPessoa: 'JURIDICA', cnpj: '999', cep: '889', enderecoCompleto: 'Rua Y' } as Cliente,
];
const mockNewClienteData: ClientePayload = { 
    nomeOuRazao: 'Novo Cliente C', tipoPessoa: 'FISICA', cpf: '000', cep: '777', enderecoCompleto: 'Av Z' 
} as ClientePayload;


describe('useClientes Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockListClientes.mockResolvedValue(mockClientesList); 
        vi.useFakeTimers(); 
    });
    
    afterEach(() => {
        vi.useRealTimers(); 
    });


    // -------------------------------------------------------------
    // TESTES DE INICIALIZAÇÃO E CARREGAMENTO (R)
    // -------------------------------------------------------------

    it('deve carregar a lista de clientes e setar loading para false', async () => {
        const { result } = renderHook(() => useClientes());
        
        expect(result.current.loading).toBe(true);

        await act(async () => {
            vi.advanceTimersByTime(10); 
        });
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false); 
        });

        expect(mockListClientes).toHaveBeenCalledTimes(1);
        expect(result.current.clientes).toEqual(mockClientesList);
        expect(result.current.error).toBeNull();
    });

    it('deve chamar logout e setar erro se o fetch falhar com 401', async () => {
        const mockError = { response: { status: 401, data: { error: 'Token expirado' } } } as axios.AxiosError;
        mockListClientes.mockRejectedValue(mockError);
        
        const { result } = renderHook(() => useClientes());

        await act(async () => {
            vi.advanceTimersByTime(10); 
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(mockLogout).toHaveBeenCalledTimes(1);
        expect(result.current.error).toBe('Token expirado'); 
    });

    // -------------------------------------------------------------
    // TESTES DE CRIAÇÃO (C)
    // -------------------------------------------------------------

    it('deve criar um novo cliente, recarregar a lista e retornar sucesso', async () => {
        const { result } = renderHook(() => useClientes());
        
        mockCreateCliente.mockResolvedValue({ id: 3, ...mockNewClienteData });
        mockListClientes.mockResolvedValueOnce([...mockClientesList, { id: 3, ...mockNewClienteData } as Cliente]); 

        await waitFor(() => expect(result.current.loading).toBe(false));

        let success = false;
        await act(async () => {
            success = await result.current.submitCliente(mockNewClienteData, undefined);
        });
        
        expect(success).toBe(true);
        expect(mockCreateCliente).toHaveBeenCalledTimes(1);
        expect(mockListClientes).toHaveBeenCalledTimes(2); 
        expect(result.current.clientes.length).toBe(3); 
    });
    
    // -------------------------------------------------------------
    // TESTES DE DELEÇÃO (D)
    // -------------------------------------------------------------
    
    it('deve deletar um cliente e remover da lista sem recarregar', async () => {
        const { result } = renderHook(() => useClientes());
        
        mockDeleteCliente.mockResolvedValue(undefined);
        window.confirm = vi.fn(() => true); 

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.clientes.length).toBe(2);

        await act(async () => {
            await result.current.removeCliente(1);
        });
        
        expect(mockDeleteCliente).toHaveBeenCalledWith(1);
        expect(result.current.clientes.length).toBe(1); 
        expect(result.current.clientes[0].id).toBe(2);
    });
});