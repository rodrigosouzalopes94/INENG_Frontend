// src/hooks/useDashboardData.ts
import { useQuery } from '@tanstack/react-query';
import { ClienteService } from '../api/ClienteService';
import { ObraService } from '../api/ObraService';
import { EquipamentoService } from '../api/EquipamentoService';
import { FuncionarioService } from '../api/FuncionarioService'; // <-- 1. IMPORTAR

import type { Equipamento } from '../models/Equipamento';
import type { Cliente } from '../models/Cliente';
import type { Obra } from '../models/Obra';
import type { Funcionario } from '../models/Funcionario'; // <-- 2. IMPORTAR

export const useDashboardData = () => {
  const clientesQuery = useQuery<Cliente[], Error>({
    queryKey: ['clientes'],
    queryFn: () => ClienteService.listClientes(), 
  });

  const obrasQuery = useQuery<Obra[], Error>({
    queryKey: ['obras'],
    queryFn: () => ObraService.listObras(),
  });

  const equipamentosQuery = useQuery<Equipamento[], Error>({
    queryKey: ['equipamentos'],
    queryFn: () => EquipamentoService.getAllEquipamentos(),
  });

  // 3. ADICIONADO: Query para buscar funcionários
  const funcionariosQuery = useQuery<Funcionario[], Error>({
    queryKey: ['funcionarios'],
    queryFn: () => FuncionarioService.listFuncionarios(), // Assume que o service tem listFuncionarios
  });

  return {
    // 4. ATUALIZADO: Retorna os dados
    clientes: clientesQuery.data || [],
    obras: obrasQuery.data || [],
    equipamentos: equipamentosQuery.data || [],
    funcionarios: funcionariosQuery.data || [], // <-- ADICIONADO
    
    // 5. ATUALIZADO: Loading considera as quatro queries
    loading: 
      clientesQuery.isLoading || 
      obrasQuery.isLoading || 
      equipamentosQuery.isLoading ||
      funcionariosQuery.isLoading, // <-- ADICIONADO
      
    // 6. ATUALIZADO: Error considera as quatro queries
    error: 
      clientesQuery.error || 
      obrasQuery.error || 
      equipamentosQuery.error ||
      funcionariosQuery.error, // <-- ADICIONADO
  };
};