import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import styled from 'styled-components';
import { Colors } from '../../theme/colors';
import { TipoContrato, type Funcionario, type FuncionarioPayload } from '../../models/Funcionario';
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
  tipoContrato: TipoContrato.REGISTRADO,
  salario: '', // Adiciona novos campos
  sindicato: '',
  cbo: '',
};

// --- Styled Components (Reutilizando padrões) ---

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px 5px;
  width: 100%;
  box-sizing: border-box;
`;

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  
  & > * {
    flex: 1;
  }

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

const StyledSelect = styled.select`
  ${inputStyles}
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23${Colors.secondary.substring(1)}%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.6-3.6%205.4-7.9%205.4-12.9%200-5-1.9-9.2-5.5-12.7z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 12px top 50%;
  background-size: 0.65em auto;
  padding-right: 30px;
`;

// NOVO: Estilo para o input de arquivo (copiado de ObraForm)
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

const FuncionarioForm: React.FC<FuncionarioFormProps> = ({ funcionarioInicial, onSave, onCancel }) => {
  // Pega funções, loading e erro do hook
  const { submitFuncionario, loading, error: apiError } = useFuncionarios();

  const [formData, setFormData] = useState<Partial<FuncionarioPayload>>(INITIAL_FORM);
  // NOVO: Estado para armazenar o arquivo selecionado
  const [fotoFile, setFotoFile] = useState<File | null>(null);
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
        // Adiciona novos campos
        salario: funcionarioInicial.salario?.toString() || '', // Converte Decimal/number para string
        sindicato: funcionarioInicial.sindicato || '',
        cbo: funcionarioInicial.cbo || '',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setFotoFile(null); // Limpa o arquivo selecionado
    setErrors({}); // Limpa erros
  }, [funcionarioInicial]);

  // Handler genérico para inputs de texto
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let valueToSet = value;

    if (name === 'cpf') {
      valueToSet = value.replace(/\D/g, '').substring(0, 11);
    }
    if (name === 'salario') {
      // Permite apenas números e uma vírgula (que será tratada como ponto)
      valueToSet = value.replace(/[^0-9,]/g, '').replace(',', '.');
    }
    // Adicionar sanitização para RG, CBO se necessário

    setFormData(prev => ({ ...prev, [name]: valueToSet }));
    if (errors[name as keyof FuncionarioPayload]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  // NOVO: Handler para o input de arquivo (foto/pdf)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setFotoFile(e.target.files[0]);
      } else {
          setFotoFile(null);
      }
  };

  // Handler para o Select
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as TipoContrato }));
  };

  // Validação (atualizada)
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
    
    // Validação CBO (Ex: 1234-56 ou 123456)
    if (formData.cbo && !/^\d{4,6}(-\d{2})?$/.test(formData.cbo)) {
        newErrors.cbo = 'CBO inválido. Use XXXXXX ou XXXX-XX.';
    }
    // Validação Salário (se preenchido, deve ser numérico)
    if (formData.salario && isNaN(parseFloat(formData.salario))) {
        newErrors.salario = 'Salário deve ser um número.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão (Atualizada para enviar o arquivo)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Garante que o payload de texto está completo
    const payload: FuncionarioPayload = {
      nome: formData.nome!,
      rg: formData.rg!,
      cpf: formData.cpf!,
      endereco: formData.endereco!,
      tipoProfissao: formData.tipoProfissao!,
      tipoContrato: formData.tipoContrato!,
      // Novos campos opcionais
      salario: formData.salario || undefined, // Envia undefined se vazio
      sindicato: formData.sindicato || undefined,
      cbo: formData.cbo || undefined,
    };

    // Chama o hook 'submitFuncionario' atualizado, passando os dados E o arquivo
    const success = await submitFuncionario(payload, fotoFile, funcionarioInicial?.id);

    if (success) {
      onSave(); // Fecha o modal
    }
    // 'apiError' do hook será exibido
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
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
      
      <FormRow>
          <Input
            label="CPF *"
            name="cpf"
            value={maskCPF(formData.cpf || '')}
            onChange={handleChange}
            error={errors.cpf}
            disabled={loading}
            maxLength={14}
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
            maxLength={20}
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
          <div>
              <StyledLabel htmlFor="tipoContrato">Tipo de Contrato *</StyledLabel>
              <StyledSelect
                id="tipoContrato"
                name="tipoContrato"
                value={formData.tipoContrato}
                onChange={handleSelectChange}
                disabled={loading}
                required
              >
                  {Object.values(TipoContrato).map(tipo => (
                      <option key={tipo} value={tipo}>{tipo.charAt(0) + tipo.slice(1).toLowerCase()}</option>
                  ))}
              </StyledSelect>
          </div>
      </FormRow>

      {/* --- NOVOS CAMPOS --- */}
      <FormRow>
          <Input
            label="Salário (R$)"
            name="salario"
            value={formData.salario || ''} // Controla o valor
            onChange={handleChange} // Usa o handler que filtra
            error={errors.salario}
            disabled={loading}
            placeholder="Ex: 2500.00"
            inputMode="decimal" // Teclado numérico em mobile
          />
          <Input
            label="CBO (XXXX-XX)"
            name="cbo"
            value={formData.cbo || ''}
            onChange={handleChange}
            error={errors.cbo}
            disabled={loading}
            maxLength={7} // 6 dígitos + hífen
            placeholder="Ex: 7152-10"
          />
      </FormRow>
      
      <Input
        label="Sindicato"
        name="sindicato"
        value={formData.sindicato || ''}
        onChange={handleChange}
        error={errors.sindicato}
        disabled={loading}
        placeholder="Ex: Sindicato dos Trabalhadores"
      />

      {/* NOVO: CAMPO DE FOTO/PDF */}
      <div>
          <StyledLabel htmlFor="foto">Foto ou Documento (PDF/JPEG)</StyledLabel>
          {/* Exibe foto/link atual se estiver editando */}
          {isEditing && funcionarioInicial?.fotoUrl && (
             <div style={{ fontSize: '0.8em', marginBottom: '5px' }}>
                <a href={funcionarioInicial.fotoUrl} target="_blank" rel="noopener noreferrer">Ver arquivo atual</a>
                <p style={{ margin: '0', color: Colors.secondary }}>(Enviar um novo arquivo substituirá o atual)</p>
             </div>
          )}
          <StyledFileInput
            id="foto"
            name="foto"
            accept=".jpg, .jpeg, .png, .pdf" // Aceita formatos
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
          variant="accent"
          loading={loading}
          title={isEditing ? 'Atualizar Funcionário' : 'Cadastrar Funcionário'}
        />
      </ButtonContainer>
    </FormContainer>
  );
};

export default FuncionarioForm;