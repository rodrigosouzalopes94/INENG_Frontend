import React, { useState, type ChangeEvent, type FormEvent } from 'react'; // Import types
import styled from 'styled-components'; // Import styled
import type { Obra } from '../../models/Obra';
import type { Cliente } from '../../models/Cliente';
import { ObraService } from '../../api/ObraService';
import { Colors } from '../../theme/colors';
import Button from './Button'; // Import Button refatorado

// --- Interfaces (SEM ALTERAÇÕES) ---
interface ObraFormProps {
  clientes: Cliente[];
  obra?: Obra;
  onClose?: () => void;
  onSaved?: (obra: Obra) => void;
}

// --- Styled Components ---

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px; /* Ajuste no espaçamento */
  padding: 20px;
  width: 100%;
  max-width: 500px;
  box-sizing: border-box; /* Garante que padding não estoure */
`;

const StyledLabel = styled.label`
  font-weight: bold;
  margin-bottom: 3px; /* Reduzido */
  color: ${Colors.text};
  font-size: 0.9em;
`;

// Estilo base para inputs e selects
const inputStyles = `
  padding: 10px 12px; /* Ajuste no padding */
  border-radius: 6px; /* Leve ajuste */
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
    box-shadow: 0 0 0 2px rgba(230, 126, 34, 0.2);
  }

  &:disabled {
    background-color: ${Colors.background};
    cursor: not-allowed;
  }
`;

const StyledInput = styled.input`
  ${inputStyles}
`;

const StyledSelect = styled.select`
  ${inputStyles}
  appearance: none; /* Remove estilo padrão do S.O. */
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23${Colors.secondary.substring(1)}%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.6-3.6%205.4-7.9%205.4-12.9%200-5-1.9-9.2-5.5-12.7z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 12px top 50%;
  background-size: 0.65em auto;
  padding-right: 30px; /* Espaço para a seta */
`;

const StyledTextarea = styled.textarea`
  ${inputStyles}
  min-height: 80px; /* Aumenta altura mínima */
  resize: vertical; /* Permite redimensionar verticalmente */
`;

const FileInputLabel = styled(StyledLabel)`
  /* Estilos específicos se necessário, ou manter igual */
`;

const StyledFileInput = styled.input.attrs({ type: 'file' })`
  margin-bottom: 15px;
  font-size: 0.9em;
  color: ${Colors.text};

  /* Estilização básica do input file (varia entre navegadores) */
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
        background-color: #dfe6e9; // Cor de hover leve
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start; /* Mantém botões à esquerda */
  gap: 10px;
  margin-top: 15px; /* Aumenta espaço acima */
`;

// Usa o componente Button refatorado
const SubmitButton = styled(Button)``; // Pode adicionar estilos específicos aqui se precisar
const CancelButton = styled(Button)``;

const ErrorMessage = styled.p`
  color: ${Colors.danger};
  font-weight: bold;
  font-size: 0.9em;
  margin: 5px 0 10px 0; /* Ajuste na margem */
  text-align: center;
`;

// --- Componente React (Lógica SEM ALTERAÇÕES) ---

const ObraForm: React.FC<ObraFormProps> = ({ clientes, obra, onClose, onSaved }) => {
  const [nomeObra, setNomeObra] = useState(obra?.nomeObra || '');
  const [tipoObra, setTipoObra] = useState<Obra['tipoObra']>(obra?.tipoObra || 'CONSTRUCAO');
  const [descricao, setDescricao] = useState(obra?.descricao || '');
  const [enderecoCompleto, setEnderecoCompleto] = useState(obra?.enderecoCompleto || '');
  const [dataInicio, setDataInicio] = useState(obra ? (obra.dataInicio ? new Date(obra.dataInicio).toISOString().split('T')[0] : '') : ''); // Tratamento data
  const [previsaoEntrega, setPrevisaoEntrega] = useState(obra ? (obra.previsaoEntrega ? new Date(obra.previsaoEntrega).toISOString().split('T')[0] : '') : ''); // Tratamento data
  const [cno, setCno] = useState(obra?.cno || '');
  const [clienteId, setClienteId] = useState(obra?.clienteId?.toString() || '');
  const [fotos, setFotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega dados iniciais na montagem ou quando 'obra' mudar
  useEffect(() => {
    if (obra) {
      setNomeObra(obra.nomeObra || '');
      setTipoObra(obra.tipoObra || 'CONSTRUCAO');
      setDescricao(obra.descricao || '');
      setEnderecoCompleto(obra.enderecoCompleto || '');
      // Converte data ISO string para yyyy-mm-dd para o input type="date"
      setDataInicio(obra.dataInicio ? new Date(obra.dataInicio).toISOString().split('T')[0] : '');
      setPrevisaoEntrega(obra.previsaoEntrega ? new Date(obra.previsaoEntrega).toISOString().split('T')[0] : '');
      setCno(obra.cno || '');
      setClienteId(obra.clienteId?.toString() || '');
    } else {
        // Reseta o formulário se não houver 'obra' (modo criação)
        setNomeObra(''); setTipoObra('CONSTRUCAO'); setDescricao('');
        setEnderecoCompleto(''); setDataInicio(''); setPrevisaoEntrega('');
        setCno(''); setClienteId(''); setFotos([]);
    }
     setError(null); // Limpa erros ao carregar/resetar
  }, [obra]);


  // Handle envio (ajustado para usar ObraService com FormData como estava)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!clienteId) {
      setError('Selecione um cliente.');
      return;
    }
    setLoading(true);
    setError(null);

    // Cria FormData para enviar ao backend (mantendo sua lógica original)
    const formData = new FormData();
    formData.append('nomeObra', nomeObra);
    formData.append('tipoObra', tipoObra);
    formData.append('descricao', descricao);
    formData.append('enderecoCompleto', enderecoCompleto);
    formData.append('dataInicio', dataInicio);
    formData.append('previsaoEntrega', previsaoEntrega);
    if (tipoObra === 'CONSTRUCAO' && cno) formData.append('cno', cno); // Só adiciona CNO se existir
    formData.append('clienteId', clienteId);
    fotos.forEach(file => formData.append('fotos', file));

    try {
      let savedObra: Obra;
      if (obra?.id) {
         // ATENÇÃO: Seu ObraService.updateObra espera um objeto, não FormData.
         // Precisamos ajustar ou a chamada ou o service.
         // Ajustando a chamada para enviar objeto (sem fotos por enquanto):
         savedObra = await ObraService.updateObra(obra.id, {
             nomeObra, tipoObra, descricao, enderecoCompleto, dataInicio, previsaoEntrega,
             cno: tipoObra === 'CONSTRUCAO' ? cno : undefined,
             clienteId: Number(clienteId),
             // TODO: Adicionar lógica para enviar/remover fotos no update se necessário
         });

         // --- OU ---
         // Se o backend espera FormData no update E lida com fotos:
         // savedObra = await ObraService.updateObraFormData(obra.id, formData); // (Função hipotética)

      } else {
        savedObra = await ObraService.createObra(formData); // createObra espera FormData
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

      <StyledLabel htmlFor="clienteId">Cliente:</StyledLabel>
      <StyledSelect
        id="clienteId"
        value={clienteId}
        onChange={e => setClienteId(e.target.value)}
        required
      >
        <option value="">Selecione um cliente</option>
        {clientes.map(c => (
          <option key={c.id} value={c.id}>
             {/* CORREÇÃO: Usar tipoPessoa do cliente, não tipoObra */}
            {c.nomeOuRazao} ({c.tipoPessoa})
          </option>
        ))}
      </StyledSelect>

      <StyledLabel htmlFor="nomeObra">Nome da Obra:</StyledLabel>
      <StyledInput
        id="nomeObra"
        type="text"
        value={nomeObra}
        onChange={e => setNomeObra(e.target.value)}
        required
      />

      <StyledLabel htmlFor="tipoObra">Tipo de Obra:</StyledLabel>
      <StyledSelect
        id="tipoObra"
        value={tipoObra}
        onChange={e => setTipoObra(e.target.value as Obra['tipoObra'])}
      >
        <option value="CONSTRUCAO">Construção</option>
        <option value="REFORMA">Reforma</option>
      </StyledSelect>

      {tipoObra === 'CONSTRUCAO' && (
        <>
          <StyledLabel htmlFor="cno">CNO:</StyledLabel>
          <StyledInput
            id="cno"
            type="text"
            value={cno}
            onChange={e => setCno(e.target.value)}
            required={tipoObra === 'CONSTRUCAO'}
          />
        </>
      )}

      <StyledLabel htmlFor="descricao">Descrição:</StyledLabel>
      <StyledTextarea
        id="descricao"
        value={descricao}
        onChange={e => setDescricao(e.target.value)}
      />

      <StyledLabel htmlFor="enderecoCompleto">Endereço Completo:</StyledLabel>
      <StyledInput
        id="enderecoCompleto"
        type="text"
        value={enderecoCompleto}
        onChange={e => setEnderecoCompleto(e.target.value)}
        required
      />

      <StyledLabel htmlFor="dataInicio">Data de Início:</StyledLabel>
      <StyledInput
        id="dataInicio"
        type="date"
        value={dataInicio}
        onChange={e => setDataInicio(e.target.value)}
        required
      />

      <StyledLabel htmlFor="previsaoEntrega">Previsão de Entrega:</StyledLabel>
      <StyledInput
        id="previsaoEntrega"
        type="date"
        value={previsaoEntrega}
        onChange={e => setPrevisaoEntrega(e.target.value)}
        required
      />

      <FileInputLabel htmlFor="fotos">Fotos:</FileInputLabel>
      <StyledFileInput
        id="fotos"
        multiple
        onChange={handleFilesChange}
      />

      <ButtonContainer>
        <SubmitButton
            type="submit"
            variant="accent" // Usando accent (laranja) como primário aqui
            loading={loading}
            title={obra?.id ? 'Atualizar Obra' : 'Cadastrar Obra'}
         />
        <CancelButton
            type="button"
            variant="secondary" // Usando secondary (cinza/chumbo) para cancelar
            onClick={onClose}
            title="Cancelar"
         />
      </ButtonContainer>
    </FormContainer>
  );
};

export default ObraForm;