import { useState, useEffect } from 'react';
import axios from 'axios';
import { ObraService } from '../api/ObraService.ts';
import { ClienteService } from '../api/ClienteService.ts';
import type { ObraPayload, ObraFormData, Obra } from '../models/Obra';
import type { Cliente } from '../models/Cliente';

export const useObraForm = (obraInicial?: Obra) => {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    
    // 1️⃣ Carrega a lista de clientes
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

    // 2️⃣ Função para criar ou atualizar obra
    const submitObra = async (data: ObraFormData, obraId?: number): Promise<boolean> => {
        setLoading(true);
        setApiError(null);

        try {
            const form = new FormData();

            form.append('nomeObra', data.nomeObra);
            form.append('tipoObra', data.tipoObra.toUpperCase());
            form.append('clienteId', String(data.clienteId));
            form.append('enderecoCompleto', data.enderecoCompleto);
            form.append('dataInicio', data.dataInicio);
            form.append('previsaoEntrega', data.previsaoEntrega);

            if (data.cno) form.append('cno', data.cno);
            if (data.descricao) form.append('descricao', data.descricao);

            if (data.fotos) {
                for (let i = 0; i < data.fotos.length; i++) {
                    form.append('fotos', data.fotos[i]);
                }
            }

            // ✅ Se obraId existe → Update, senão → Create
            if (obraId) {
                await ObraService.updateObra(obraId, form);
            } else {
                await ObraService.createObra(form);
            }

            return true;
        } catch (err: any) {
            const errorMessage =
                axios.isAxiosError(err) && err.response?.data?.error
                    ? err.response.data.error
                    : 'Erro ao enviar obra. Verifique o console.';
            console.error("Erro ao enviar obra:", err);
            setApiError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        submitObra,
        loading,
        apiError,
        clientes,
        setClientes,
    };
};
