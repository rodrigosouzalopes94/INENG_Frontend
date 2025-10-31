import { useState, useEffect } from 'react';
import axios from 'axios';
import { ObraService } from '../api/ObraService'; // Service refatorado
import { ClienteService } from '../api/ClienteService';
// Importa ObraPayload e Foto, mas ObraFormData (com FileList) não é mais necessária no hook
import type { Obra, ObraPayload, Foto } from '../models/Obra'; 
import type { Cliente } from '../models/Cliente';
import { useAuthContext } from '../context/AuthContext'; // Para logout

// Interface para os dados que o *Formulário* envia para este hook
interface SubmitData {
  nomeObra: string;
  tipoObra: Obra['tipoObra'];
  clienteId: number;
  enderecoCompleto: string;
  dataInicio: string;
  previsaoEntrega: string;
  cno?: string;
  descricao?: string;
  fotos?: File[] | null; // O formulário envia um Array de Files
  fotosExistentes?: Foto[]; // O formulário envia fotos antigas (para lógica futura)
}


export const useObraForm = (obraInicial?: Obra) => { // Mantém o nome do hook
  const [loading, setLoading] = useState(false); // Loading para Clientes E Submissão
  const [apiError, setApiError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const { logout } = useAuthContext(); // Pega o logout
  
  // Carrega clientes (lógica mantida)
  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      try {
        const clientesData = await ClienteService.listClientes();
        setClientes(clientesData);
      } catch (err) {
        console.error("Erro ao carregar clientes:", err);
        setApiError('Não foi possível carregar a lista de clientes.');
        // Adiciona checagem 401
        if (axios.isAxiosError(err) && err.response?.status === 401) {
            logout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, [logout]); // Adiciona logout

  // --- SUBMISSÃO (A LÓGICA REFATORADA) ---
  const submitObra = async (data: SubmitData, obraId?: number): Promise<boolean> => {
    setLoading(true);
    setApiError(null);

    try {
      // 1. Separa os arquivos (File) dos dados de texto (Payload)
      const { fotos, fotosExistentes, ...payloadDeTexto } = data;
      // (fotosExistentes não é usado pelo service ainda, mas o separamos)

      // 2. Converte clienteId para string (se o backend/service esperar assim no form-data)
      //    ou mantém como número se o payload for ObraPayload (que espera number)
      //    O nosso ObraService (frontend) espera ObraPayload.
      const payloadFinal: ObraPayload | Partial<ObraPayload> = {
          ...payloadDeTexto,
          clienteId: Number(payloadDeTexto.clienteId), // Garante que é número
          // Remove campos vazios que não são opcionais no backend (ex: cno)
          cno: data.cno || undefined, 
          descricao: data.descricao || undefined,
      };

      // 3. Chama o ObraService refatorado, passando dados e arquivos separados
      if (obraId) {
        // Modo Update
        await ObraService.updateObra(obraId, payloadFinal, fotos || null);
      } else {
        // Modo Create
        await ObraService.createObra(payloadFinal as ObraPayload, fotos || null);
      }

      return true; // Sucesso

    } catch (err: any) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'Erro ao enviar obra. Verifique o console.';
      console.error("Erro ao enviar obra (useObraForm):", err);
      setApiError(errorMessage);
      
      // Adiciona checagem 401
      if (axios.isAxiosError(err) && err.response?.status === 401) {
          logout();
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitObra, // Função de submissão corrigida
    loading,
    apiError,
    clientes,
    // setClientes, // Removido, o hook gerencia isso
  };
};