// src/hooks/useObraForm.ts

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ObraService } from '../api/ObraService.ts'; // Serviço de Obra
import { ClienteService } from '../api/ClienteService.ts'; // Serviço para buscar clientes
import type { ObraPayload, ObraFormData } from '../models/Obra';
import type { Cliente } from '../models/Cliente';

export const useObraForm = () => {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [clientes, setClientes] = useState<Cliente[]>([]); // Lista de Clientes para o Select

    // 1. Busca de Clientes (CRÍTICO: Dependência do formulário)
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                setLoading(true);
                const clientesData = await ClienteService.listClientes();
                setClientes(clientesData);
            } catch (err) {
                console.error("Erro ao carregar clientes:", err);
                setApiError('Não foi possível carregar a lista de clientes.'); 
            } finally {
                setLoading(false);
            }
        };
        fetchClientes();
    }, []); 

    // 2. Submissão (Criação do FormData)
    const submitObra = async (data: ObraFormData): Promise<boolean> => {
        setLoading(true);
        setApiError(null);

        try {
            const form = new FormData();
            
            // Anexa campos de texto (CNPJ/CNO/Descricao são opcionais/condicionais)
            form.append('nomeObra', data.nomeObra);
            form.append('tipoObra', data.tipoObra.toUpperCase());
            form.append('clienteId', String(data.clienteId));
            form.append('enderecoCompleto', data.enderecoCompleto);
            form.append('dataInicio', data.dataInicio);
            form.append('previsaoEntrega', data.previsaoEntrega);

            if (data.cno) form.append('cno', data.cno);
            if (data.descricao) form.append('descricao', data.descricao);

            // Anexa os arquivos (Chave 'fotos' - Multer)
            if (data.fotos) {
                for (let i = 0; i < data.fotos.length; i++) {
                    form.append('fotos', data.fotos[i]); 
                }
            }
            
            // Faz a chamada final
            await ObraService.createObra(form); 
            return true;
            
        } catch (err) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.error 
                ? err.response.data.error 
                : 'Erro ao criar obra. Verifique o console.';
            setApiError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };
    
    return { submitObra, loading, apiError, clientes, setClientes };
};