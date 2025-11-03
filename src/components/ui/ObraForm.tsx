// src/components/ui/ObraForm.tsx

// 1. IMPORTA useEffect
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import styled from 'styled-components';
// 2. IMPORTA O HOOK CORRETO (useObrasList)
import { useObrasList } from '../../hooks/useObrasList';
import type { Obra, ObraPayload, TipoObra, Foto } from '../../models/Obra'; // Importa todos os tipos necessários
import type { Cliente } from '../../models/Cliente';
import { Colors } from '../../theme/colors';
import Button from './Button';
// Importa o Input refatorado
import Input from './Input'; 

// --- Interfaces (SEM ALTERAÇÕES) ---
interface ObraFormProps {
  clientes: Cliente[];
  obra?: Obra; // undefined se for criação
  onClose?: () => void;
  onSaved?: () => void;
}

// Estado inicial (Payload de texto)
const INITIAL_FORM: Partial<ObraPayload> = {
    nomeObra: '',
    tipoObra: 'CONSTRUCAO',
    descricao: '',
    enderecoCompleto: '',
    dataInicio: '',
    previsaoEntrega: '',
    cno: '',
    clienteId: 0,
};

// --- Styled Components (Corrigidos com 'div' wrappers para layout) ---

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px; /* Espaço entre os grupos (divs) */
  padding: 10px 5px;
  width: 100%;
  box-sizing: border-box;
`;

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  & > * { flex: 1; }
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const StyledLabel = styled.label`
  font-weight: bold;
  margin-bottom: 4px;
  color: ${Colors.text};
  font-size: 0.9em;
  display: block;
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
    box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.2);
  }
  &:disabled {
    background-color: ${Colors.background};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

// O Componente Input refatorado já usa styled-components,
// então não precisamos de 'StyledInput' aqui, a menos que queiramos sobrescrever
// const StyledInput = styled.input`${inputStyles}`; // Removido - Usaremos o Componente Input

const StyledSelect = styled.select`
  ${inputStyles}
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%2D...%3E'); /* URL da seta (abreviada) */
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

const FileInputWrapper = styled.div`
    /* Wrapper para o input de arquivo e preview */
`;

const StyledFileInput = styled.input.attrs({ type: 'file' })`
  font-size: 0.9em;
  color: ${Colors.text};
  width: 100%;
  margin-top: 5px;

  &::file-selector-button {
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid ${Colors.secondary};
    background-color: ${Colors.background};
    color: ${Colors.text};
    cursor: pointer;
    transition: background-color 0.2s;
    margin-right: 10px;
    &:hover { background-color: #dfe6e9; }
  }
`;

const ImagePreview = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid ${Colors.secondary + '40'};
`;

const FotoExistenteWrapper = styled.div`
    position: relative;
    width: 80px;
    height: 80px;
`;

const RemoveFotoButton = styled.button`
    position: absolute;
    top: -5px;
    right: -5px;
    background: ${Colors.danger};
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    font-size: 0.8em;
    font-weight: bold;
    line-height: 20px;
    text-align: center;
    padding: 0;
    
    &:hover {
        background: #c0392b; // Danger mais escuro
    }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid ${Colors.background};
`;

const ErrorMessage = styled.p`
  color: ${Colors.danger};
  font-weight: bold;
  font-size: 0.9em;
  margin: 0 0 10px 0;
  text-align: left;
  width: 100%;
`;


// --- Componente React ---

const ObraForm: React.FC<ObraFormProps> = ({ clientes, obra, onClose, onSaved }) => {
  
  // 3. USA O HOOK CORRETO (useObrasList)
  // Este hook agora fornece 'submitObra', 'loading' e 'apiError'
  const { submitObra, loading, error: apiError } = useObrasList();

  // Estados do formulário (texto)
  const [formData, setFormData] = useState<Partial<ObraPayload>>(INITIAL_FORM);
  // Estado APENAS para novos arquivos selecionados
  const [fotosNovas, setFotosNovas] = useState<File[]>([]); 
  // Estado para controlar as fotos que já existem (na edição)
  const [fotosExistentes, setFotosExistentes] = useState<Foto[]>([]); 

  const isEditing = !!obra;

  // Carrega dados para edição ou reseta para criação
  useEffect(() => {
    if (obra) {
      setFormData({
        nomeObra: obra.nomeObra || '',
        tipoObra: obra.tipoObra || 'CONSTRUCAO',
        descricao: obra.descricao || '',
        enderecoCompleto: obra.enderecoCompleto || '',
        dataInicio: obra.dataInicio?.split('T')[0] || '',
        previsaoEntrega: obra.previsaoEntrega?.split('T')[0] || '',
        cno: obra.cno || '',
        clienteId: obra.clienteId || 0,
      });
      setFotosExistentes(obra.fotos || []);
    } else {
      setFormData(INITIAL_FORM);
      setFotosExistentes([]);
    }
    setFotosNovas([]); // Limpa seleção de novos arquivos
    // setApiError(null); // O hook deve limpar o erro, não o form
  }, [obra]); // Dependência: 'obra'


  // --- Handlers ---

  // Handler genérico para inputs de texto
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler para o Select
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as TipoObra }));
  };
  
  // Handler para o input de arquivo (fotos novas)
  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotosNovas(Array.from(e.target.files)); // Converte FileList para File[]
    }
  };

  // Handler para remover fotos existentes (APENAS na UI por enquanto)
  const removeFotoExistente = (id: number) => {
    // TODO: Implementar lógica no backend para deletar fotos individuais
    alert("Remoção de fotos existentes na edição ainda não implementada.");
    // setFotosExistentes(prev => prev.filter(f => f.id !== id));
  };

  // Validação (Simples - pode ser melhorada com Zod)
  const validate = (): boolean => {
     if (!formData.clienteId || formData.clienteId === 0) {
         alert("Selecione um cliente.");
         return false;
     }
     if (!formData.nomeObra?.trim()) {
         alert("Nome da Obra é obrigatório.");
         return false;
     }
     if (formData.tipoObra === 'CONSTRUCAO' && !formData.cno?.trim()) {
         alert("CNO é obrigatório para Construção.");
         return false;
     }
     // Adicionar outras validações...
     return true;
  };

  // Submissão
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // 4. Prepara o Payload de TEXTO (ObraPayload)
    const payload: ObraPayload | Partial<ObraPayload> = {
      ...formData,
      clienteId: Number(formData.clienteId),
      // Garante que campos opcionais vazios sejam undefined/null
      descricao: formData.descricao || undefined,
      cno: formData.cno || undefined,
    };
    
    // 5. Chama o 'submitObra' do hook (que agora espera 'data' e 'files')
    const success = await submitObra(payload, fotosNovas, obra?.id);

    if (success && onSaved) {
      onSaved(); // Fecha o modal
    }
    // O 'apiError' do hook já será exibido
  };

  // --- JSX (Com wrappers 'div' para layout) ---
  return (
    <FormContainer onSubmit={handleSubmit}>
      {apiError && <ErrorMessage>{apiError}</ErrorMessage>}

      {/* Bloco Cliente */}
      <div>
          <StyledLabel htmlFor="clienteId">Cliente *</StyledLabel>
          <StyledSelect
            id="clienteId"
            name="clienteId" // Adiciona name
            value={formData.clienteId}
            onChange={handleSelectChange} // Usa handler de select
            required
            disabled={loading}
          >
            <option value="">Selecione um cliente</option>
            {(clientes || []).map(c => (
              <option key={c.id} value={c.id}>
                {c.nomeOuRazao} ({c.tipoPessoa})
              </option>
            ))}
          </StyledSelect>
      </div>

       {/* Bloco Nome da Obra */}
      <div>
          <StyledLabel htmlFor="nomeObra">Nome da Obra *</StyledLabel>
          <Input // Usa o componente Input
            id="nomeObra"
            name="nomeObra"
            type="text"
            value={formData.nomeObra || ''}
            onChange={handleChange}
            required
            disabled={loading}
          />
      </div>

       {/* Bloco Tipo de Obra */}
      <div>
          <StyledLabel htmlFor="tipoObra">Tipo de Obra *</StyledLabel>
          <StyledSelect
            id="tipoObra"
            name="tipoObra"
            value={formData.tipoObra}
            onChange={handleSelectChange}
            disabled={loading}
          >
            <option value="CONSTRUCAO">Construção</option>
            <option value="REFORMA">Reforma</option>
          </StyledSelect>
      </div>

      {/* Bloco CNO (Condicional) */}
      {formData.tipoObra === 'CONSTRUCAO' && (
        <div>
          <StyledLabel htmlFor="cno">CNO *</StyledLabel>
          <Input
            id="cno"
            name="cno"
            type="text"
            value={formData.cno || ''}
            onChange={handleChange}
            required={formData.tipoObra === 'CONSTRUCAO'}
            disabled={loading}
          />
        </div>
      )}

      {/* Bloco Descrição */}
      <div>
          <StyledLabel htmlFor="descricao">Descrição</StyledLabel>
          <StyledTextarea // Usa textarea estilizado
            id="descricao"
            name="descricao"
            value={formData.descricao || ''}
            onChange={handleChange} // Handler genérico funciona
            disabled={loading}
          />
      </div>

      {/* Bloco Endereço */}
      <div>
          <StyledLabel htmlFor="enderecoCompleto">Endereço Completo *</StyledLabel>
          <Input
            id="enderecoCompleto"
            name="enderecoCompleto"
            type="text"
            value={formData.enderecoCompleto || ''}
            onChange={handleChange}
            required
            disabled={loading}
          />
      </div>

      {/* Bloco Datas */}
      <FormRow> {/* Coloca datas lado a lado */}
          <div>
              <StyledLabel htmlFor="dataInicio">Data de Início *</StyledLabel>
              <Input
                id="dataInicio"
                name="dataInicio"
                type="date"
                value={formData.dataInicio || ''}
                onChange={handleChange}
                required
                disabled={loading}
              />
          </div>
          <div>
              <StyledLabel htmlFor="previsaoEntrega">Previsão de Entrega *</StyledLabel>
              <Input
                id="previsaoEntrega"
                name="previsaoEntrega"
                type="date"
                value={formData.previsaoEntrega || ''}
                onChange={handleChange}
                required
                disabled={loading}
              />
          </div>
      </FormRow>

      {/* Lógica para fotos existentes */}
      {isEditing && fotosExistentes.length > 0 && (
         <FileInputWrapper>
            <StyledLabel>Fotos Existentes (Clique X para remover)</StyledLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {fotosExistentes.map(f => (
                <FotoExistenteWrapper key={f.id}>
                    <ImagePreview src={f.url} alt="Foto da obra" />
                    <RemoveFotoButton type="button" onClick={() => removeFotoExistente(f.id)}>
                        ×
                    </RemoveFotoButton>
                </FotoExistenteWrapper>
                ))}
            </div>
         </FileInputWrapper>
      )}
      
      {/* Input de novas fotos */}
      <FileInputWrapper>
        <StyledLabel htmlFor="fotos">{isEditing ? "Adicionar Novas Fotos" : "Fotos"} (PDF/JPEG)</StyledLabel>
        <StyledFileInput
            id="fotos"
            name="fotos" // Nome do campo
            multiple // Permite múltiplos
            onChange={handleFilesChange}
            disabled={loading}
            accept="image/jpeg,image/png,image/webp,application/pdf"
        />
        {fotosNovas.length > 0 && <p style={{fontSize: '0.8em', color: Colors.secondary, margin: '5px 0 0 0'}}>{fotosNovas.length} novo(s) arquivo(s) selecionado(s).</p>}
      </FileInputWrapper>

      <ButtonContainer>
        <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            title="Cancelar" // Passa 'title' para o Button
         />
        <Button
            type="submit"
            variant="accent"
            loading={loading}
            title={obra?.id ? 'Atualizar Obra' : 'Cadastrar Obra'} // Passa 'title'
         />
      </ButtonContainer>
    </FormContainer>
  );
};

export default ObraForm;