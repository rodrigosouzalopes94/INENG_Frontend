// src/hooks/useDashboardData.ts
import { useQuery } from '@tanstack/react-query';
import { ClienteService } from '../api/ClienteService';
import { ObraService } from '../api/ObraService';
// ADICIONADO: Importações de Equipamento
import { EquipamentoService } from '../api/EquipamentoService';
import type { Equipamento } from '../models/Equipamento';

import type { Cliente } from '../models/Cliente';
import type { Obra } from '../models/Obra';


export const useDashboardData = () => {
  const clientesQuery = useQuery<Cliente[], Error>({
    queryKey: ['clientes'],
    // Assumindo que seu service tem 'listClientes'
    queryFn: () => ClienteService.listClientes(), 
  });

  const obrasQuery = useQuery<Obra[], Error>({
    queryKey: ['obras'],
    // Assumindo que seu service tem 'listObras'
    queryFn: () => ObraService.listObras(),
  });

  // ADICIONADO: Query para buscar equipamentos
  const equipamentosQuery = useQuery<Equipamento[], Error>({
    queryKey: ['equipamentos'],
    queryFn: () => EquipamentoService.getAllEquipamentos(),
  });

  return {
    // ATUALIZADO: Retorna os dados
    clientes: clientesQuery.data || [],
    obras: obrasQuery.data || [],
    equipamentos: equipamentosQuery.data || [],
    
    // ATUALIZADO: Loading considera as três queries
    loading: 
      clientesQuery.isLoading || 
      obrasQuery.isLoading || 
      equipamentosQuery.isLoading,
      
    // ATUALIZADO: Error considera as três queries
    error: 
      clientesQuery.error || 
      obrasQuery.error || 
      equipamentosQuery.error,
  };
};