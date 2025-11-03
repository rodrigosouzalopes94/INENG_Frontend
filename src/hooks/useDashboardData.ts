import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ClienteService } from '../api/ClienteService';
import { ObraService } from '../api/ObraService';
import { FuncionarioService } from '../api/FuncionarioService'; // Mantém Funcionários
// REMOVIDO: Importações de Equipamento
import type { Cliente } from '../models/Cliente';
import type { Obra } from '../models/Obra';
import type { Funcionario } from '../models/Funcionario';
import { useAuthContext } from '../context/AuthContext';

export const useDashboardData = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuthContext();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Busca apenas os 3 necessários
      const [
        clientesData,
        obrasData,
        funcionariosData
      ] = await Promise.all([
        ClienteService.listClientes(),
        ObraService.listObras(),
        FuncionarioService.listFuncionarios()
        // REMOVIDO: EquipamentoService.getAllEquipamentos()
      ]);

      setClientes(clientesData);
      setObras(obrasData);
      setFuncionarios(funcionariosData);

    } catch (err: any) {
      console.error("Erro ao carregar dados do dashboard:", err);
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'Falha ao carregar dados do dashboard.';
      setError(errorMessage);

      if (axios.isAxiosError(err) && err.response?.status === 401) {
        alert("Sua sessão expirou. Por favor, faça login novamente.");
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Retorna os 3 tipos de dados
  return {
    clientes,
    obras,
    funcionarios,
    loading,
    error,
    fetchData
  };
};