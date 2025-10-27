import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'; // <-- IMPORTANTE: Adicionado useEffect
import styled from 'styled-components';
import type { Obra } from '../../models/Obra';
import type { Cliente } from '../../models/Cliente';
import { ObraService } from '../../api/ObraService';
import { Colors } from '../../theme/colors';
import Button from './Button'; // Importa Button refatorado

// --- Interfaces (SEM ALTERAÇÕES) ---
interface ObraFormProps {
  clientes: Cliente[];
  obra?: Obra; // undefined se for criação
  onClose?: () => void;
  onSaved?: (obra: Obra) => void;
}

// --- Styled Components ---

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px; /* Aumenta um pouco o gap entre elementos */
  padding: 5px; /* Reduz padding interno, modal já tem padding */
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  margin-bottom: 4px; /* Aumenta um pouco */
  color: ${Colors.text};
  font-size: 0.9em;
  display: block; /* Garante que ocupe a linha */
`;

// Estilo base compartilhado
const inputStyles = `
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid ${Colors.secondary};
  width: 100%;
  box-sizing: border-box;
  font-size: 1em;
  color: ${Colors.text};
  background-color: ${Colors.white};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${Colors.accent};
    box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.2); /* Sombra um pouco maior */
  }

  &:disabled {
    background-color: ${Colors.background};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const StyledInput = styled.input`
  ${inputStyles}
`;

const StyledSelect = styled.select`
  ${inputStyles}
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23${Colors.secondary.substring(1)}%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.6-3.6%205.4-7.9%205.4-12.9%200-5-1.9-9.2-5.5-12.7z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 12px top 50%;
  background-size: 0.65em auto;
  padding-right: 30px;
`;

const StyledTextarea = styled.textarea`
  ${inputStyles}
  min-height: 80px;
  resize: vertical;
`;

// Agrupa Label + Input de arquivo para espaçamento
const FileInputWrapper = styled.div`
    margin-bottom: 10px; /* Adiciona espaço abaixo */
`;

const StyledFileInput = styled.input.attrs({ type: 'file' })`
  /* margin-bottom: 15px; Removido, controlado pelo wrapper */
  font-size: 0.9em;
  color: ${Colors.text};
  width: 100%; // Ocupa espaço
  margin-top: 5px; // Espaço após label

  &::file-selector-button {
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid ${Colors.secondary};
    background-color: ${Colors.background};
    color: ${Colors.text};
    cursor: pointer;
    transition: background-color 0.2s;
    margin-right: 10px;

    &:hover {
        background-color: #dfe6e9;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Alinha botões à direita */
  gap: 10px;
  margin-top: 20px; /* Aumenta espaço acima */
  padding-top: 15px; /* Adiciona padding acima */
  border-top: 1px solid ${Colors.background}; /* Linha separadora */
`;

// Usa o componente Button refatorado
const SubmitButton = styled(Button)`
    /* Estilos adicionais se necessário */
`;
const CancelButton = styled(Button)`
    /* Estilos adicionais se necessário */
`;

const ErrorMessage = styled.p`
  color: ${Colors.danger};
  font-weight: bold;
  font-size: 0.9em;
  margin: 0 0 10px 0; /* Ajuste margem */
  text-align: left; /* Alinha erro à esquerda */
  width: 100%;
`;

// --- Componente React ---

const ObraForm: React.FC<ObraFormProps> = ({ clientes, obra, onClose, onSaved }) => {
  // --- State Hooks ---
  const [nomeObra, setNomeObra] = useState('');
  const [tipoObra, setTipoObra] = useState<Obra['tipoObra']>('CONSTRUCAO');
  const [descricao, setDescricao] = useState('');
  const [enderecoCompleto, setEnderecoCompleto] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [previsaoEntrega, setPrevisaoEntrega] = useState('');
  const [cno, setCno] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [fotos, setFotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- useEffect para carregar/resetar dados ---
  useEffect(() => {
    if (obra) {
      setNomeObra(obra.nomeObra || '');
      setTipoObra(obra.tipoObra || 'CONSTRUCAO');
      setDescricao(obra.descricao || '');
      setEnderecoCompleto(obra.enderecoCompleto || '');
      // Converte data ISO string para yyyy-mm-dd
      setDataInicio(obra.dataInicio ? new Date(obra.dataInicio).toISOString().split('T')[0] : '');
      setPrevisaoEntrega(obra.previsaoEntrega ? new Date(obra.previsaoEntrega).toISOString().split('T')[0] : '');
      setCno(obra.cno || '');
      setClienteId(obra.clienteId?.toString() || '');
      setFotos([]); // Limpa seleção de fotos ao editar
    } else {
      // Reseta o formulário
      setNomeObra(''); setTipoObra('CONSTRUCAO'); setDescricao('');
      setEnderecoCompleto(''); setDataInicio(''); setPrevisaoEntrega('');
      setCno(''); setClienteId(''); setFotos([]);
    }
     setError(null);
  }, [obra]); // Dependência: 'obra'


  // --- Handlers ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!clienteId) {
      setError('Selecione um cliente.');
      return;
    }
    if (tipoObra === 'CONSTRUCAO' && !cno?.trim()) { // Validação CNO
         setError('CNO é obrigatório para Construção.');
         return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('nomeObra', nomeObra);
    formData.append('tipoObra', tipoObra);
    formData.append('descricao', descricao);
    formData.append('enderecoCompleto', enderecoCompleto);
    formData.append('dataInicio', dataInicio);
    formData.append('previsaoEntrega', previsaoEntrega);
    if (tipoObra === 'CONSTRUCAO' && cno) formData.append('cno', cno);
    formData.append('clienteId', clienteId);
    fotos.forEach(file => formData.append('fotos', file));

    try {
      let savedObra: Obra;
      if (obra?.id) {
           // Usando a versão que envia Objeto (ajuste se seu backend mudou)
           savedObra = await ObraService.updateObra(obra.id, {
             nomeObra, tipoObra, descricao, enderecoCompleto, dataInicio, previsaoEntrega,
             cno: tipoObra === 'CONSTRUCAO' ? cno : undefined,
             clienteId: Number(clienteId),
             // Lógica de update de fotos não inclusa aqui
           });
      } else {
        savedObra = await ObraService.createObra(formData);
      }
      onSaved?.(savedObra);
    } catch (err: any) {
      console.error("Erro no handleSubmit ObraForm:", err);
      setError(err?.response?.data?.error || err.message || 'Erro ao salvar obra.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotos(Array.from(e.target.files));
    }
  };

  // --- JSX com Styled Components ---
  return (
    <FormContainer onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Bloco Cliente */}
      <div>
          <StyledLabel htmlFor="clienteId">Cliente *</StyledLabel>
          <StyledSelect
            id="clienteId"
            value={clienteId}
            onChange={e => setClienteId(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Selecione um cliente</option>
            {(clientes || []).map(c => ( // Garante que clientes seja um array
              <option key={c.id} value={c.id}>
                {c.nomeOuRazao} ({c.tipoPessoa})
              </option>
            ))}
          </StyledSelect>
      </div>

       {/* Bloco Nome da Obra */}
      <div>
          <StyledLabel htmlFor="nomeObra">Nome da Obra *</StyledLabel>
          <StyledInput
            id="nomeObra"
            type="text"
            value={nomeObra}
            onChange={e => setNomeObra(e.target.value)}
            required
            disabled={loading}
          />
      </div>

       {/* Bloco Tipo de Obra */}
      <div>
          <StyledLabel htmlFor="tipoObra">Tipo de Obra *</StyledLabel>
          <StyledSelect
            id="tipoObra"
            value={tipoObra}
            onChange={e => setTipoObra(e.target.value as Obra['tipoObra'])}
            disabled={loading}
          >
            <option value="CONSTRUCAO">Construção</option>
            <option value="REFORMA">Reforma</option>
          </StyledSelect>
      </div>

      {/* Bloco CNO (Condicional) */}
      {tipoObra === 'CONSTRUCAO' && (
        <div>
          <StyledLabel htmlFor="cno">CNO *</StyledLabel>
          <StyledInput
            id="cno"
            type="text"
            value={cno}
            onChange={e => setCno(e.target.value)}
            required={tipoObra === 'CONSTRUCAO'}
            disabled={loading}
          />
        </div>
      )}

      {/* Bloco Descrição */}
      <div>
          <StyledLabel htmlFor="descricao">Descrição</StyledLabel>
          <StyledTextarea
            id="descricao"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            disabled={loading}
          />
      </div>

      {/* Bloco Endereço */}
      <div>
          <StyledLabel htmlFor="enderecoCompleto">Endereço Completo *</StyledLabel>
          <StyledInput
            id="enderecoCompleto"
            type="text"
            value={enderecoCompleto}
            onChange={e => setEnderecoCompleto(e.target.value)}
            required
            disabled={loading}
          />
      </div>

      {/* Bloco Datas */}
      <div style={{ display: 'flex', gap: '15px' }}> {/* Agrupa datas lado a lado */}
          <div style={{ flex: 1 }}>
              <StyledLabel htmlFor="dataInicio">Data de Início *</StyledLabel>
              <StyledInput
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={e => setDataInicio(e.target.value)}
                required
                disabled={loading}
              />
          </div>
          <div style={{ flex: 1 }}>
              <StyledLabel htmlFor="previsaoEntrega">Previsão de Entrega *</StyledLabel>
              <StyledInput
                id="previsaoEntrega"
                type="date"
                value={previsaoEntrega}
                onChange={e => setPrevisaoEntrega(e.target.value)}
                required
                disabled={loading}
              />
          </div>
      </div>


      {/* Bloco Fotos */}
      <FileInputWrapper>
          <StyledLabel htmlFor="fotos">Fotos (multiplas)</StyledLabel>
          <StyledFileInput
            id="fotos"
            multiple
            onChange={handleFilesChange}
            disabled={loading}
          />
          {/* Opcional: Mostrar nomes dos arquivos selecionados */}
          {fotos.length > 0 && (
            <div style={{ fontSize: '0.8em', marginTop: '5px', color: Colors.secondary }}>
                {fotos.length} arquivo(s) selecionado(s): {fotos.map(f => f.name).join(', ')}
            </div>
          )}
      </FileInputWrapper>


      {/* Bloco Botões */}
      <ButtonContainer>
        <CancelButton
            type="button"
            variant="secondary"
            onClick={onClose}
            title="Cancelar"
            disabled={loading} // Desabilita enquanto salva
         />
        <SubmitButton
            type="submit"
            variant="accent"
            loading={loading}
            title={obra?.id ? 'Atualizar Obra' : 'Cadastrar Obra'}
         />
      </ButtonContainer>
    </FormContainer>
  );
};

export default ObraForm;