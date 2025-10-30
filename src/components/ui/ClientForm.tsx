import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'; // Import React explicitamente e tipos
import styled from 'styled-components'; // Importa styled-components
import Input from '../ui/Input'; // Importa Input refatorado
import Button from '../ui/Button'; // Importa Button refatorado
import { useClientes } from '../../hooks/useClientes';
import type { Cliente, ClientePayload, TipoPessoa } from '../../models/Cliente';
import { maskCPF, maskCNPJ, maskCEP } from '../../utils/formatters';
import { Colors } from '../../theme/colors';

// --- Interfaces e Constantes (SEM ALTERAÇÕES) ---
interface ClienteFormProps {
    clienteInicial?: Cliente | null;
    onSave: () => void;
}

const INITIAL_FORM: Partial<ClientePayload> = {
    tipoPessoa: 'JURIDICA',
    nomeOuRazao: '',
    cep: '',
    enderecoCompleto: '',
    cpf: '',
    cnpj: '',
};

// --- Styled Components ---
const FormWrapper = styled.div`
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  padding: 10px;

  /* Barra de rolagem */
  max-height: 90vh;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: ${Colors.primary} #f0f0f0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${Colors.primary};
    border-radius: 4px;
    border: 2px solid #f0f0f0;
  }
`;

const FormTitle = styled.h3`
  color: ${Colors.primary};
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 25px;
  text-align: center;
  width: 100%;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px; 
  width: 100%;
  align-items: center;
`;

const ToggleContainer = styled.div`
  width: 100%;
  margin-bottom: 15px;
  text-align: center;
`;

const ToggleLabel = styled.p`
  color: ${Colors.text};
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 0.9em;
`;

const ToggleButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const ToggleButton = styled(Button)`
  flex: 1; 
  padding-top: 10px;
  padding-bottom: 10px;

  @media (max-width: 400px) {
    font-size: 0.85em;
    padding: 8px 5px;
  }
`;

const SubmitButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
`;

const ApiErrorText = styled.p`
  color: ${Colors.danger};
  background-color: #fff4f4;
  padding: 10px 15px;
  border: 1px solid ${Colors.danger};
  border-radius: 5px;
  width: 100%;
  text-align: center;
  font-size: 0.9em;
  box-sizing: border-box;
  margin-bottom: 15px;
`;

// --- Componente React ---
const ClienteForm: React.FC<ClienteFormProps> = ({ clienteInicial, onSave }) => {
    const [formData, setFormData] = useState<Partial<ClientePayload>>(INITIAL_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof ClientePayload, string>>>({});
    const { submitCliente, loading, error: apiError } = useClientes();
    const isEditing = !!clienteInicial;
    const isPJ = formData.tipoPessoa === 'JURIDICA';

    useEffect(() => {
        if (clienteInicial) {
            const initialData: Partial<ClientePayload> = {
                ...INITIAL_FORM,
                ...clienteInicial,
                cpf: clienteInicial.cpf || '',
                cnpj: clienteInicial.cnpj || '',
            };
            setFormData(initialData);
        } else {
            setFormData(INITIAL_FORM);
        }
        setErrors({});
    }, [clienteInicial]);

     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let valueToSet = value;

        if (name === 'cpf' || name === 'cnpj' || name === 'cep') {
            const rawValue = value.replace(/\D/g, '');
            if (name === 'cep') valueToSet = rawValue.substring(0, 8);
            else if (name === 'cpf') valueToSet = rawValue.substring(0, 11);
            else if (name === 'cnpj') valueToSet = rawValue.substring(0, 14);
        }

        setFormData(prev => ({ ...prev, [name]: valueToSet }));

        if (errors[name as keyof ClientePayload]) {
             setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof ClientePayload];
                return newErrors;
             });
        }
    };

    const handleTogglePessoa = (type: TipoPessoa) => {
        setFormData(prev => ({
            ...INITIAL_FORM,
            nomeOuRazao: prev.nomeOuRazao,
            cep: prev.cep,
            enderecoCompleto: prev.enderecoCompleto,
            tipoPessoa: type,
        }));
        setErrors({});
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof ClientePayload, string>> = {};
        if (!formData.nomeOuRazao?.trim()) newErrors.nomeOuRazao = 'Nome/Razão Social é obrigatório.';
        if (!formData.cep || formData.cep.replace(/\D/g, '').length !== 8) newErrors.cep = 'CEP deve ter 8 dígitos.';

        const doc = isPJ ? formData.cnpj : formData.cpf;
        const requiredLength = isPJ ? 14 : 11;
        const docName = isPJ ? 'CNPJ' : 'CPF';
        if (!doc || doc.replace(/\D/g, '').length !== requiredLength) {
            newErrors[isPJ ? 'cnpj' : 'cpf'] = `${docName} deve ter ${requiredLength} dígitos.`;
        }
        if (!formData.enderecoCompleto?.trim()) newErrors.enderecoCompleto = 'Endereço completo é obrigatório.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload: ClientePayload = {
            tipoPessoa: formData.tipoPessoa || 'JURIDICA',
            nomeOuRazao: formData.nomeOuRazao?.trim() || '',
            cep: (formData.cep || '').replace(/\D/g, ''),
            enderecoCompleto: formData.enderecoCompleto?.trim() || '',
            cpf: !isPJ ? (formData.cpf || '').replace(/\D/g, '') : null,
            cnpj: isPJ ? (formData.cnpj || '').replace(/\D/g, '') : null,
        };

        const success = await submitCliente(payload, clienteInicial?.id);
        if (success) {
            onSave();
        }
    };

    return (
        <FormWrapper>
            <FormContainer onSubmit={handleSubmit}>

                {apiError && <ApiErrorText>Falha: {apiError}</ApiErrorText>}

                <FormTitle>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</FormTitle>

                <ToggleContainer>
                    <ToggleLabel>Tipo de Cadastro *</ToggleLabel>
                    <ToggleButtonGroup>
                        <ToggleButton
                            title="Pessoa Jurídica"
                            type="button"
                            variant={isPJ ? 'primary' : 'secondary'}
                            onClick={() => handleTogglePessoa('JURIDICA')}
                        />
                        <ToggleButton
                            title="Pessoa Física"
                            type="button"
                            variant={!isPJ ? 'primary' : 'secondary'}
                            onClick={() => handleTogglePessoa('FISICA')}
                        />
                    </ToggleButtonGroup>
                </ToggleContainer>

                <Input
                    label={isPJ ? 'CNPJ *' : 'CPF *'}
                    name={isPJ ? 'cnpj' : 'cpf'}
                    value={isPJ ? maskCNPJ(formData.cnpj || '') : maskCPF(formData.cpf || '')}
                    onChange={handleChange}
                    maxLength={isPJ ? 18 : 14}
                    error={errors.cnpj || errors.cpf}
                    required
                />

                <Input
                    label={isPJ ? 'Razão Social *' : 'Nome Completo *'}
                    name="nomeOuRazao"
                    value={formData.nomeOuRazao || ''}
                    onChange={handleChange}
                    error={errors.nomeOuRazao}
                    required
                />

                <Input
                    label="CEP *"
                    name="cep"
                    value={maskCEP(formData.cep || '')}
                    onChange={handleChange}
                    maxLength={10}
                    error={errors.cep}
                    required
                />
                <Input
                    label="Endereço Completo *"
                    name="enderecoCompleto"
                    value={formData.enderecoCompleto || ''}
                    onChange={handleChange}
                    error={errors.enderecoCompleto}
                    required
                />

                <SubmitButton
                    title={isEditing ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                    type="submit"
                    variant="primary"
                    loading={loading}
                />
            </FormContainer>
        </FormWrapper>
    );
};

export default ClienteForm;
