import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import styled from 'styled-components';
import { Colors } from '../../theme/colors';
import type { Equipamento } from '../../models/Equipamento'; 
import type { EquipamentoPayload } from '../../models/Funcionario';// Importa Payload
import { useEquipamentos } from '../../hooks/useEquipamentos'; // Importa o Hook
import Input from '../ui/Input';
import Button from '../ui/Button';

// --- Interfaces ---
interface EquipamentoFormProps {
  equipamento?: Equipamento | null;
  onSaved: () => void;
  onCancel: () => void;
}

// Estado inicial para o formulário (baseado no Payload)
const INITIAL_FORM: Partial<EquipamentoPayload> = {
  patrimonio: '',
  equipamento: '',
  nf: '',
  marca: '',
  quantidade: '0', // Quantidade inicial
};

// --- Styled Components (Reutilizando padrões) ---

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px; /* Espaço entre os campos */
  padding: 10px 5px; /* Padding interno leve */
  width: 100%;
  box-sizing: border-box;
`;

// Estilos de Input/Label (Reutilizados de ObraForm)
const StyledLabel = styled.label`
  font-weight: bold;
  margin-bottom: 4px;
  color: ${Colors.text};
  font-size: 0.9em;
  display: block;
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

const EquipamentoForm: React.FC<EquipamentoFormProps> = ({ equipamento, onSaved, onCancel }) => {
  // Pega funções, loading e erro do hook
  const { submitEquipamento, loading, error: apiError } = useEquipamentos();

  const [formData, setFormData] = useState<Partial<EquipamentoPayload>>(INITIAL_FORM);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof EquipamentoPayload, string>>>({});

  const isEditing = !!equipamento;

  // Carrega dados para edição ou reseta para criação
  useEffect(() => {
    if (equipamento) {
      setFormData({
        patrimonio: equipamento.patrimonio || '',
        equipamento: equipamento.equipamento || '',
        nf: equipamento.nf || '',
        marca: equipamento.marca || '',
        // 'quantidade' não é editável aqui, é controlada por Movimentos
        // Se precisar editar, adicione ao form. Por ora, omitido.
      });
    } else {
      setFormData(INITIAL_FORM); // Reseta para criação
    }
    setFotoFile(null); // Limpa o arquivo selecionado
    setErrors({}); // Limpa erros
  }, [equipamento]); // Roda quando 'equipamento' (prop) muda

  // Handler genérico para inputs de texto
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Sanitização (ex: 'quantidade' só aceita números)
    let valueToSet = value;
    if (name === 'quantidade') {
        valueToSet = value.replace(/\D/g, ''); // Remove não-dígitos
    }

    setFormData(prev => ({ ...prev, [name]: valueToSet }));
    
    // Limpa erro do campo ao digitar
    if (errors[name as keyof EquipamentoPayload]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  // Handler para o input de arquivo (foto/pdf)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setFotoFile(e.target.files[0]);
      } else {
          setFotoFile(null);
      }
  };

  // Validação
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EquipamentoPayload, string>> = {};
    if (!formData.patrimonio?.trim()) newErrors.patrimonio = 'Nº de Patrimônio é obrigatório.';
    if (!formData.equipamento?.trim()) newErrors.equipamento = 'Nome do Equipamento é obrigatório.';
    if (!formData.marca?.trim()) newErrors.marca = 'Marca é obrigatória.';
    if (!formData.nf?.trim()) newErrors.nf = 'Nota Fiscal (NF) é obrigatória.';
    
    // Valida quantidade apenas na criação
    if (!isEditing) {
        const qtd = parseInt(formData.quantidade || '0', 10);
        if (isNaN(qtd) || qtd < 0) {
             newErrors.quantidade = 'Quantidade inicial deve ser um número (0 ou mais).';
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão (Atualizada para usar o hook)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Prepara o payload de dados de texto
    // (O Service espera 'quantidade' como string, pois vem de FormData)
    const payload: EquipamentoPayload | Partial<EquipamentoPayload> = isEditing 
      ? { // Em edição, não enviamos quantidade
          patrimonio: formData.patrimonio!,
          equipamento: formData.equipamento!,
          nf: formData.nf!,
          marca: formData.marca!,
        }
      : { // Na criação, enviamos tudo
          patrimonio: formData.patrimonio!,
          equipamento: formData.equipamento!,
          nf: formData.nf!,
          marca: formData.marca!,
          quantidade: formData.quantidade || '0', // Garante que 'quantidade' seja string
        };

    // Chama o hook 'submitEquipamento', passando dados e o arquivo
    const success = await submitEquipamento(payload, fotoFile, equipamento?.id);

    if (success) {
      onSaved(); // Fecha o modal
    }
    // O 'apiError' do hook será exibido automaticamente
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* Exibe erro retornado pela API */}
      {apiError && <ErrorMessage>{apiError}</ErrorMessage>}

      <Input
        label="Nº Patrimônio *"
        name="patrimonio"
        value={formData.patrimonio || ''}
        onChange={handleChange}
        error={errors.patrimonio}
        disabled={loading}
        required
      />
      
      <Input
        label="Nome do Equipamento *"
        name="equipamento"
        value={formData.equipamento || ''}
        onChange={handleChange}
        error={errors.equipamento}
        disabled={loading}
        required
      />

      <Input
        label="Marca *"
        name="marca"
        value={formData.marca || ''}
        onChange={handleChange}
        error={errors.marca}
        disabled={loading}
        required
      />

      <Input
        label="Nota Fiscal (NF) *"
        name="nf"
        value={formData.nf || ''}
        onChange={handleChange}
        error={errors.nf}
        disabled={loading}
        required
      />

      {/* Campo de quantidade só aparece na CRIAÇÃO */}
      {!isEditing && (
        <Input
            label="Quantidade Inicial *"
            name="quantidade"
            type="number" // Input HTML tipo número
            value={formData.quantidade || '0'}
            onChange={handleChange} // Handler já remove não-dígitos
            error={errors.quantidade}
            disabled={loading}
            min="0"
            inputMode="numeric" // Teclado mobile
        />
      )}

      {/* Campo de Foto/PDF */}
      <div>
          <StyledLabel htmlFor="foto">Foto ou Documento (PDF/JPEG)</StyledLabel>
          {/* Exibe foto/link atual se estiver editando */}
          {isEditing && equipamento?.fotoUrl && (
             <div style={{ fontSize: '0.8em', marginBottom: '5px' }}>
                <a href={equipamento.fotoUrl} target="_blank" rel="noopener noreferrer">Ver arquivo atual</a>
                <p style={{ margin: '0', color: Colors.secondary }}>(Enviar um novo arquivo substituirá o atual)</p>
             </div>
          )}
          <StyledFileInput
            id="foto"
            name="foto"
            accept=".jpg, .jpeg, .png, .pdf" // Aceita formatos do backend
            onChange={handleFileChange}
            disabled={loading}
          />
          {/* Mostra nome do arquivo selecionado */}
          {fotoFile && (
            <div style={{ fontSize: '0.8em', marginTop: '5px', color: Colors.secondary }}>
                Arquivo selecionado: {fotoFile.name}
            </div>
          )}
      </div>
      
      <ButtonContainer>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          title="Cancelar"
          disabled={loading}
        />
        <Button
          type="submit"
          variant="accent" // Laranja
          loading={loading}
          title={isEditing ? 'Atualizar Equipamento' : 'Cadastrar Equipamento'}
        />
      </ButtonContainer>
    </FormContainer>
  );
};

export default EquipamentoForm;