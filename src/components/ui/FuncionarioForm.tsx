import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import styled from 'styled-components';
import { Colors } from '../../theme/colors';
import { type Funcionario, type FuncionarioPayload, TipoContrato } from '../../models/Funcionario';
import { useFuncionarios } from '../../hooks/useFuncionarios';
import { maskCPF } from '../../utils/formatters';
import Input from '../ui/Input';
import Button from '../ui/Button';

// --- Interfaces ---
interface FuncionarioFormProps {
  funcionarioInicial?: Funcionario | null;
  onSave: () => void;
  onCancel: () => void;
}

// Estado inicial para o formulário
const INITIAL_FORM: Partial<FuncionarioPayload> = {
  nome: '',
  rg: '',
  cpf: '',
  endereco: '',
  tipoProfissao: '',
  tipoContrato: TipoContrato.REGISTRADO, // Define um padrão
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

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  
  /* Faz os inputs dentro da linha ocuparem espaço igual */
  & > * {
    flex: 1;
  }

  @media (max-width: 600px) {
    flex-direction: column; /* Empilha campos em telas pequenas */
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

// Estilo base compartilhado (copiado de ObraForm)
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

const StyledSelect = styled.select`
  ${inputStyles}
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23${Colors.secondary.substring(1)}%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.6-3.6%205.4-7.9%205.4-12.9%200-5-1.9-9.2-5.5-12.7z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 12px top 50%;
  background-size: 0.65em auto;
  padding-right: 30px;
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

const FuncionarioForm: React.FC<FuncionarioFormProps> = ({ funcionarioInicial, onSave, onCancel }) => {
  // Pega funções, loading e erro do hook
  const { submitFuncionario, loading, error: apiError } = useFuncionarios();

  const [formData, setFormData] = useState<Partial<FuncionarioPayload>>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FuncionarioPayload, string>>>({});

  const isEditing = !!funcionarioInicial;

  // Carrega dados para edição ou reseta para criação
  useEffect(() => {
    if (funcionarioInicial) {
      setFormData({
        nome: funcionarioInicial.nome || '',
        rg: funcionarioInicial.rg || '',
        cpf: funcionarioInicial.cpf || '',
        endereco: funcionarioInicial.endereco || '',
        tipoProfissao: funcionarioInicial.tipoProfissao || '',
        tipoContrato: funcionarioInicial.tipoContrato || TipoContrato.REGISTRADO,
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({}); // Limpa erros ao mudar
  }, [funcionarioInicial]);

  // Handler genérico para inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let valueToSet = value;

    if (name === 'cpf') {
      valueToSet = value.replace(/\D/g, '').substring(0, 11); // Remove máscara e limita
    }
    // Adicionar sanitização para RG se necessário
    // if (name === 'rg') { ... }

    setFormData(prev => ({ ...prev, [name]: valueToSet }));
    // Limpa erro do campo ao digitar
    if (errors[name as keyof FuncionarioPayload]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handler para o Select
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as TipoContrato }));
  };

  // Validação
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FuncionarioPayload, string>> = {};
    if (!formData.nome?.trim()) newErrors.nome = 'Nome é obrigatório.';
    if (!formData.cpf?.replace(/\D/g, '') || formData.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos.';
    }
    if (!formData.rg?.trim()) newErrors.rg = 'RG é obrigatório.';
    if (!formData.endereco?.trim()) newErrors.endereco = 'Endereço é obrigatório.';
    if (!formData.tipoProfissao?.trim()) newErrors.tipoProfissao = 'Profissão é obrigatória.';
    if (!formData.tipoContrato) newErrors.tipoContrato = 'Tipo de contrato é obrigatório.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Garante que o payload é do tipo completo (não parcial)
    const payload: FuncionarioPayload = {
      nome: formData.nome!,
      rg: formData.rg!,
      cpf: formData.cpf!,
      endereco: formData.endereco!,
      tipoProfissao: formData.tipoProfissao!,
      tipoContrato: formData.tipoContrato!,
    };

    const success = await submitFuncionario(payload, funcionarioInicial?.id);

    if (success) {
      onSave(); // Fecha o modal e atualiza a lista (controlado pela Page)
    }
    // O 'apiError' do hook será exibido automaticamente
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* Exibe erro retornado pela API */}
      {apiError && <ErrorMessage>{apiError}</ErrorMessage>}

      <Input
        label="Nome Completo *"
        name="nome"
        value={formData.nome || ''}
        onChange={handleChange}
        error={errors.nome}
        disabled={loading}
        maxLength={100}
        required
      />
      
      {/* CPF e RG lado a lado */}
      <FormRow>
          <Input
            label="CPF *"
            name="cpf"
            value={maskCPF(formData.cpf || '')} // Aplica máscara
            onChange={handleChange}
            error={errors.cpf}
            disabled={loading}
            maxLength={14} // 11 dígitos + máscara
            required
            inputMode="numeric"
          />
          <Input
            label="RG *"
            name="rg"
            value={formData.rg || ''}
            onChange={handleChange}
            error={errors.rg}
            disabled={loading}
            maxLength={20} // Limite genérico para RG
            required
          />
      </FormRow>

      <Input
        label="Endereço Completo *"
        name="endereco"
        value={formData.endereco || ''}
        onChange={handleChange}
        error={errors.endereco}
        disabled={loading}
        required
      />

      {/* Profissão e Contrato lado a lado */}
      <FormRow>
          <Input
            label="Profissão *"
            name="tipoProfissao"
            value={formData.tipoProfissao || ''}
            onChange={handleChange}
            error={errors.tipoProfissao}
            disabled={loading}
            required
            placeholder="Ex: Pedreiro"
          />
          <div> {/* Wrapper para o Select + Label */}
              <StyledLabel htmlFor="tipoContrato">Tipo de Contrato *</StyledLabel>
              <StyledSelect
                id="tipoContrato"
                name="tipoContrato"
                value={formData.tipoContrato}
                onChange={handleSelectChange}
                disabled={loading}
                required
              >
                  {/* Itera sobre as chaves do Enum */}
                  {Object.values(TipoContrato).map(tipo => (
                      <option key={tipo} value={tipo}>{tipo.charAt(0) + tipo.slice(1).toLowerCase()}</option>
                  ))}
              </StyledSelect>
          </div>
      </FormRow>
      
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
          variant="accent" // Laranja para ação principal
          loading={loading}
          title={isEditing ? 'Atualizar' : 'Cadastrar'}
        />
      </ButtonContainer>
    </FormContainer>
  );
};

export default FuncionarioForm;