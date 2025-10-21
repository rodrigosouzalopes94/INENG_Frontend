import React, { useState } from 'react';
import { EquipamentoService } from '../../api/EquipamentoService';
import { TipoMovimento } from '../../models/Equipamento';
import { Colors } from '../../theme/colors';

interface MovimentoFormProps {
  equipamentoId: number;
  onSaved: () => void;
  onCancel: () => void;
}

const EquipamentoMovimentoForm: React.FC<MovimentoFormProps> = ({ equipamentoId, onSaved, onCancel }) => {
  const [tipo, setTipo] = useState<TipoMovimento>(TipoMovimento.SAIDA);
  const [quantidade, setQuantidade] = useState('1');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await EquipamentoService.registrarMovimento({
        equipamentoId,
        tipo,
        quantidade: Number(quantidade),
        motivo,
      });
      onSaved();
    } catch (err: any) {
      console.error(err);
      // Erro comum do backend
      setError(err?.response?.data?.error || 'Erro ao registrar movimento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <p style={styles.error}>{error}</p>}
      
      <label style={styles.label}>Tipo de Movimento:</label>
      <select 
        style={styles.input} 
        value={tipo} 
        onChange={(e) => setTipo(e.target.value as TipoMovimento)}
      >
        <option value={TipoMovimento.SAIDA}>Saída (Alocação)</option>
        <option value={TipoMovimento.ENTRADA}>Entrada (Devolução/Compra)</option>
      </select>
      
      <label style={styles.label}>Quantidade:</label>
      <input
        style={styles.input}
        type="number"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
        min="1"
        required
      />

      <label style={styles.label}>Motivo / Obra de Destino:</label>
      <input
        style={styles.input}
        type="text"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        placeholder={tipo === 'SAIDA' ? 'Ex: Obra Inova Engenharia' : 'Ex: Compra NF 987'}
      />

      <div style={styles.buttonContainer}>
        <button type="submit" disabled={loading} style={styles.submitButton}>
          {loading ? 'Registrando...' : 'Registrar Movimento'}
        </button>
        <button type="button" onClick={onCancel} style={styles.cancelButton}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

// Estilos (reutilizados do ObraForm)
const styles: { [key: string]: React.CSSProperties } = {
  form: {
    display: 'flex', flexDirection: 'column', gap: 10, padding: 20,
    width: '100%', maxWidth: 450,
  },
  label: { fontWeight: 'bold', marginBottom: 5, color: Colors.text },
  input: { padding: 8, borderRadius: 5, border: `1px solid ${Colors.secondary}` },
  buttonContainer: { display: 'flex', justifyContent: 'flex-start', gap: 10, marginTop: 10 },
  submitButton: {
    padding: '8px 15px', backgroundColor: Colors.accent, color: Colors.white,
    border: 'none', borderRadius: 5, cursor: 'pointer',
  },
  cancelButton: {
    padding: '8px 15px', backgroundColor: Colors.secondary, color: Colors.white,
    border: 'none', borderRadius: 5, cursor: 'pointer',
  },
  error: { color: Colors.danger, fontWeight: 'bold' },
};

export default EquipamentoMovimentoForm;