// src/components/ui/ObraForm.tsx

import React, { useState, useEffect } from 'react';
import type { Obra } from '../../models/Obra';
import type { Cliente } from '../../models/Cliente';
import { ObraService } from '../../api/ObraService';

interface ObraFormProps {
  clientes: Cliente[];
  obra?: Obra; // se passado, o form é de edição
  onClose?: () => void; // para cancelar
  onSaved?: (obra: Obra) => void; // callback após salvar
}

const ObraForm: React.FC<ObraFormProps> = ({ clientes, obra, onClose, onSaved }) => {
  const [nomeObra, setNomeObra] = useState(obra?.nomeObra || '');
  const [tipoObra, setTipoObra] = useState<Obra['tipoObra']>(obra?.tipoObra || 'CONSTRUCAO');
  const [descricao, setDescricao] = useState(obra?.descricao || '');
  const [enderecoCompleto, setEnderecoCompleto] = useState(obra?.enderecoCompleto || '');
  const [dataInicio, setDataInicio] = useState(obra ? obra.dataInicio.split('T')[0] : '');
  const [previsaoEntrega, setPrevisaoEntrega] = useState(obra ? obra.previsaoEntrega.split('T')[0] : '');
  const [cno, setCno] = useState(obra?.cno || '');
  const [clienteId, setClienteId] = useState(obra?.clienteId?.toString() || '');
  const [fotos, setFotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle envio
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) {
      setError('Selecione um cliente.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('nomeObra', nomeObra);
      formData.append('tipoObra', tipoObra);
      formData.append('descricao', descricao);
      formData.append('enderecoCompleto', enderecoCompleto);
      formData.append('dataInicio', dataInicio);
      formData.append('previsaoEntrega', previsaoEntrega);
      if (tipoObra === 'CONSTRUCAO') formData.append('cno', cno);
      formData.append('clienteId', clienteId);

      fotos.forEach(file => formData.append('fotos', file));

      let savedObra: Obra;
      if (obra?.id) {
        savedObra = await ObraService.updateObra(obra.id, {
          nomeObra,
          tipoObra,
          descricao,
          enderecoCompleto,
          dataInicio,
          previsaoEntrega,
          cno: tipoObra === 'CONSTRUCAO' ? cno : undefined,
          clienteId: Number(clienteId),
        });
      } else {
        savedObra = await ObraService.createObra(formData);
      }

      onSaved?.(savedObra);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || err.message || 'Erro ao salvar obra.');
    } finally {
      setLoading(false);
    }
  };

  // Fotos
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotos(Array.from(e.target.files));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <p style={styles.error}>{error}</p>}

      {/* Select Cliente no topo */}
      <label style={styles.label}>Cliente:</label>
      <select
        style={styles.input}
        value={clienteId}
        onChange={e => setClienteId(e.target.value)}
        required
      >
        <option value="">Selecione um cliente</option>
        {clientes.map(c => (
          <option key={c.id} value={c.id}>
            {c.nomeOuRazao} ({c.tipoPessoa})
          </option>
        ))}
      </select>

      <label style={styles.label}>Nome da Obra:</label>
      <input
        style={styles.input}
        type="text"
        value={nomeObra}
        onChange={e => setNomeObra(e.target.value)}
        required
      />

      <label style={styles.label}>Tipo de Obra:</label>
      <select
        style={styles.input}
        value={tipoObra}
        onChange={e => setTipoObra(e.target.value as Obra['tipoObra'])}
      >
        <option value="CONSTRUCAO">Construção</option>
        <option value="REFORMA">Reforma</option>
      </select>

      {tipoObra === 'CONSTRUCAO' && (
        <>
          <label style={styles.label}>CNO:</label>
          <input
            style={styles.input}
            type="text"
            value={cno}
            onChange={e => setCno(e.target.value)}
            required={tipoObra === 'CONSTRUCAO'}
          />
        </>
      )}

      <label style={styles.label}>Descrição:</label>
      <textarea
        style={styles.textarea}
        value={descricao}
        onChange={e => setDescricao(e.target.value)}
      />

      <label style={styles.label}>Endereço Completo:</label>
      <input
        style={styles.input}
        type="text"
        value={enderecoCompleto}
        onChange={e => setEnderecoCompleto(e.target.value)}
        required
      />

      <label style={styles.label}>Data de Início:</label>
      <input
        style={styles.input}
        type="date"
        value={dataInicio}
        onChange={e => setDataInicio(e.target.value)}
        required
      />

      <label style={styles.label}>Previsão de Entrega:</label>
      <input
        style={styles.input}
        type="date"
        value={previsaoEntrega}
        onChange={e => setPrevisaoEntrega(e.target.value)}
        required
      />

      <label style={styles.label}>Fotos:</label>
      <input
        type="file"
        multiple
        onChange={handleFilesChange}
        style={{ marginBottom: 15 }}
      />

      <div style={styles.buttonContainer}>
        <button type="submit" disabled={loading} style={styles.submitButton}>
          {obra?.id ? 'Editar Obra' : 'Cadastrar Obra'}
        </button>
        <button
          type="button"
          onClick={onClose}
          style={styles.cancelButton}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 20,
    width: '100%',
    maxWidth: 500,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    padding: 8,
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  textarea: {
    padding: 8,
    borderRadius: 5,
    border: '1px solid #ccc',
    minHeight: 60,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: 10,
    marginTop: 10,
  },
  submitButton: {
    padding: '8px 15px',
    backgroundColor: '#2f80ed',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '8px 15px',
    backgroundColor: '#aaa',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
};

export default ObraForm;
