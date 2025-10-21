import React, { useState } from 'react';
import { EquipamentoService } from '../../api/EquipamentoService';
import type { Equipamento } from '../../models/Equipamento';
import { Colors } from '../../theme/colors';

interface EquipamentoFormProps {
  equipamento?: Equipamento | null;
  onSaved: () => void;
  onCancel: () => void;
}

const EquipamentoForm: React.FC<EquipamentoFormProps> = ({ equipamento, onSaved, onCancel }) => {
  const [patrimonio, setPatrimonio] = useState(equipamento?.patrimonio || '');
  const [nome, setNome] = useState(equipamento?.equipamento || '');
  const [nf, setNf] = useState(equipamento?.nf || '');
  const [marca, setMarca] = useState(equipamento?.marca || '');
  
  // Quantidade só é definida na criação
  const [quantidadeInicial, setQuantidadeInicial] = useState('0');
  
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('patrimonio', patrimonio);
    formData.append('equipamento', nome);
    formData.append('nf', nf);
    formData.append('marca', marca);

    if (foto) {
      formData.append('foto', foto);
    }

    try {
      if (equipamento?.id) {
        // Atualização: Não enviamos 'quantidade'
        await EquipamentoService.updateEquipamento(equipamento.id, formData);
      } else {
        // Criação: Enviamos a quantidade inicial
        formData.append('quantidade', quantidadeInicial);
        await EquipamentoService.createEquipamento(formData);
      }
      onSaved();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || err.message || 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <p style={styles.error}>{error}</p>}
      
      <label style={styles.label}>Nº Patrimônio:</label>
      <input
        style={styles.input}
        type="text"
        value={patrimonio}
        onChange={(e) => setPatrimonio(e.target.value)}
        required
      />

      <label style={styles.label}>Nome do Equipamento:</label>
      <input
        style={styles.input}
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />

      <label style={styles.label}>Marca:</label>
      <input
        style={styles.input}
        type="text"
        value={marca}
        onChange={(e) => setMarca(e.target.value)}
        required
      />

      <label style={styles.label}>Nota Fiscal (NF):</label>
      <input
        style={styles.input}
        type="text"
        value={nf}
        onChange={(e) => setNf(e.target.value)}
        required
      />

      {/* Campo de quantidade só aparece na CRIAÇÃO */}
      {!equipamento?.id && (
        <>
          <label style={styles.label}>Quantidade Inicial:</label>
          <input
            style={styles.input}
            type="number"
            value={quantidadeInicial}
            onChange={(e) => setQuantidadeInicial(e.target.value)}
            min="0"
          />
        </>
      )}

      <label style={styles.label}>Foto (Opcional):</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFoto(e.target.files ? e.target.files[0] : null)}
      />

      <div style={styles.buttonContainer}>
        <button type="submit" disabled={loading} style={styles.submitButton}>
          {loading ? 'Salvando...' : (equipamento ? 'Atualizar' : 'Cadastrar')}
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
    width: '100%', maxWidth: 500,
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

export default EquipamentoForm;