// src/hooks/useDashboardData.ts
import { useQuery } from '@tanstack/react-query';
import { ClienteService } from '../api/ClienteService';
import { ObraService } from '../api/ObraService';
import type { Cliente } from '../models/Cliente';
import type { Obra } from '../models/Obra';

export const useDashboardData = () => {
  const clientesQuery = useQuery<Cliente[], Error>({
    queryKey: ['clientes'],
    queryFn: () => ClienteService.listClientes(),
  });

  const obrasQuery = useQuery<Obra[], Error>({
    queryKey: ['obras'],
    queryFn: () => ObraService.listObras(),
  });

  return {
    clientes: clientesQuery.data || [],
    obras: obrasQuery.data || [],
    loading: clientesQuery.isLoading || obrasQuery.isLoading,
    error: clientesQuery.error || obrasQuery.error,
  };
};
