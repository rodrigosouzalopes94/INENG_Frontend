import { useState, useEffect, useCallback } from 'react';
import { EquipamentoService } from '../api/EquipamentoService';
import type { Equipamento } from '../models/Equipamento';

export const useEquipamentos = () => {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipamentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EquipamentoService.getAllEquipamentos();
      setEquipamentos(data);
    } catch (err) {
      setError('Falha ao carregar equipamentos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipamentos();
  }, [fetchEquipamentos]);

  return {
    equipamentos,
    loading,
    error,
    fetchEquipamentos, // Retorna para permitir re-fetch manual
  };
};