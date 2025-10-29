// src/hooks/useObraForm.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ObraService } from '../api/ObraService';
import { ClienteService } from '../api/ClienteService';
import type { Obra, ObraFormData } from '../models/Obra';
import type { Cliente } from '../models/Cliente';

export const useObraForm = (obraInicial?: Obra) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  
  // Carrega clientes
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

  // Submissão do formulário (cadastro/edição)
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

      // Fotos novas
      if (data.fotos && data.fotos.length > 0) {
        Array.from(data.fotos).forEach(file => form.append('fotos', file));
      }

      // Fotos existentes (para edição)
      if (data.fotosExistentes && data.fotosExistentes.length > 0) {
        form.append('fotosExistentes', JSON.stringify(data.fotosExistentes));
      }

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
