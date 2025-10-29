// src/components/ui/ObraForm.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import styled from 'styled-components';
import type { Obra } from '../../models/Obra';
import type { Cliente } from '../../models/Cliente';
import { Colors } from '../../theme/colors';
import Button from './Button';
import { useObraForm } from '../../hooks/useObraForm';

interface ObraFormProps {
  clientes: Cliente[];
  obra?: Obra;
  onClose?: () => void;
  onSaved?: () => void;
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  margin-bottom: 4px;
  color: ${Colors.text};
`;

const inputStyles = `
  padding: 10px;
  border-radius: 6px;
  border: 1px solid ${Colors.secondary};
  width: 100%;
  box-sizing: border-box;
  font-size: 1em;
  &:focus { outline: none; border-color: ${Colors.accent}; }
`;

const StyledInput = styled.input`${inputStyles}`;
const StyledSelect = styled.select`${inputStyles}`;
const StyledTextarea = styled.textarea`${inputStyles}`;
const StyledFileInput = styled.input.attrs({ type: 'file' })`${inputStyles}`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const ObraForm: React.FC<ObraFormProps> = ({ clientes, obra, onClose, onSaved }) => {
  const { submitObra, loading, apiError } = useObraForm();
  const [nomeObra, setNomeObra] = useState('');
  const [tipoObra, setTipoObra] = useState<Obra['tipoObra']>('CONSTRUCAO');
  const [descricao, setDescricao] = useState('');
  const [enderecoCompleto, setEnderecoCompleto] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [previsaoEntrega, setPrevisaoEntrega] = useState('');
  const [cno, setCno] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [fotos, setFotos] = useState<File[]>([]);
  const [fotosExistentes, setFotosExistentes] = useState<{id: number, url: string}[]>([]);

  useEffect(() => {
    if (obra) {
      setNomeObra(obra.nomeObra || '');
      setTipoObra(obra.tipoObra || 'CONSTRUCAO');
      setDescricao(obra.descricao || '');
      setEnderecoCompleto(obra.enderecoCompleto || '');
      setDataInicio(obra.dataInicio?.split('T')[0] || '');
      setPrevisaoEntrega(obra.previsaoEntrega?.split('T')[0] || '');
      setCno(obra.cno || '');
      setClienteId(obra.clienteId?.toString() || '');
      setFotosExistentes(obra.fotos || []);
      setFotos([]);
    } else {
      setNomeObra(''); setTipoObra('CONSTRUCAO'); setDescricao('');
      setEnderecoCompleto(''); setDataInicio(''); setPrevisaoEntrega('');
      setCno(''); setClienteId(''); setFotos([]); setFotosExistentes([]);
    }
  }, [obra]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submitObra({
      nomeObra,
      tipoObra,
      descricao,
      enderecoCompleto,
      dataInicio,
      previsaoEntrega,
      cno,
      clienteId: Number(clienteId),
      fotos: fotos.length > 0 ? fotos : null,
      fotosExistentes,
    }, obra?.id);

    onSaved?.();
  };

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFotos(Array.from(e.target.files));
  };

  const removeFotoExistente = (id: number) => {
    setFotosExistentes(prev => prev.filter(f => f.id !== id));
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {apiError && <p style={{color: Colors.danger}}>{apiError}</p>}

      <StyledLabel>Cliente *</StyledLabel>
      <StyledSelect value={clienteId} onChange={e => setClienteId(e.target.value)} required>
        <option value="">Selecione</option>
        {clientes.map(c => <option key={c.id} value={c.id}>{c.nomeOuRazao}</option>)}
      </StyledSelect>

      <StyledLabel>Nome da Obra *</StyledLabel>
      <StyledInput type="text" value={nomeObra} onChange={e => setNomeObra(e.target.value)} required />

      <StyledLabel>Tipo de Obra *</StyledLabel>
      <StyledSelect value={tipoObra} onChange={e => setTipoObra(e.target.value as Obra['tipoObra'])}>
        <option value="CONSTRUCAO">Construção</option>
        <option value="REFORMA">Reforma</option>
      </StyledSelect>

      {tipoObra === 'CONSTRUCAO' && (
        <>
          <StyledLabel>CNO *</StyledLabel>
          <StyledInput type="text" value={cno} onChange={e => setCno(e.target.value)} required />
        </>
      )}

      <StyledLabel>Descrição</StyledLabel>
      <StyledTextarea value={descricao} onChange={e => setDescricao(e.target.value)} />

      <StyledLabel>Endereço *</StyledLabel>
      <StyledInput type="text" value={enderecoCompleto} onChange={e => setEnderecoCompleto(e.target.value)} required />

      <StyledLabel>Data de Início *</StyledLabel>
      <StyledInput type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} required />

      <StyledLabel>Previsão de Entrega *</StyledLabel>
      <StyledInput type="date" value={previsaoEntrega} onChange={e => setPrevisaoEntrega(e.target.value)} required />

      <StyledLabel>Fotos Existentes</StyledLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {fotosExistentes.map(f => (
          <div key={f.id} style={{ position: 'relative' }}>
            <img src={f.url} alt="obra" width={80} height={80} style={{ objectFit: 'cover', borderRadius: '4px' }} />
            <button type="button" onClick={() => removeFotoExistente(f.id)}
              style={{
                position: 'absolute', top: 0, right: 0, background: 'red', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer'
              }}>×</button>
          </div>
        ))}
      </div>

      <StyledLabel>Adicionar Novas Fotos</StyledLabel>
      <StyledFileInput multiple onChange={handleFilesChange} />

      <ButtonContainer>
        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="accent" loading={loading}>{obra?.id ? 'Atualizar' : 'Cadastrar'}</Button>
      </ButtonContainer>
    </FormContainer>
  );
};

export default ObraForm;
