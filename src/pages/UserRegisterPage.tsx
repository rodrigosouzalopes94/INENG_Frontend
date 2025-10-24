import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import styled from 'styled-components';
import { Colors } from '../theme/colors';
import type { UserRole, RegisterUserPayload } from '../models/User';
import CardComponent from '../components/ui/Card'; // Renomeado Card
import Input from '../components/ui/Input';       // Importa Input refatorado
import Button from '../components/ui/Button';     // Importa Button refatorado
import AppLogo from '../components/common/AppLogo';
import { useRegisterUser } from '../hooks/useRegisterUser'; // Hook para API
import { maskCPF } from '../utils/formatters';

// --- Constantes e Interfaces ---
const BASE_FORM: RegisterUserPayload = {
    name: '',
    email: '',
    password: '',
    cpf: '',
    role: 'GESTOR',
};

// --- Styled Components ---

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${Colors.background}, #f8fafc);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const FormCard = styled(CardComponent)`
  width: 100%;
  max-width: 500px;
  padding: 35px 30px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
  background-color: ${Colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 600px) {
    padding: 30px 20px;
    max-width: 95%;
  }
`;

const Title = styled.h2`
  font-size: 1.5em;
  font-weight: bold;
  color: ${Colors.primary};
  margin: 20px 0 25px;
`;

const ErrorDisplay = styled.div`
  color: ${Colors.danger};
  background-color: #fff4f4;
  border: 1px solid ${Colors.danger};
  border-radius: 5px;
  padding: 10px 15px;
  margin-bottom: 20px;
  font-size: 0.9em;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 15px;
`;

const RoleContainer = styled.div`
  width: 100%;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RoleLabel = styled.p`
  color: ${Colors.text};
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 0.9em;
`;

const RoleButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 100%;
  max-width: 400px;
`;

// CORREÇÃO 1: Usa '$isActive' (transient prop) na definição e no uso
const RoleButton = styled(Button)<{ $isActive: boolean }>`
  flex: 1;
  padding: 8px 15px;
  font-weight: bold;
  background-color: ${props => props.$isActive ? Colors.accent : Colors.secondary};
  &:hover {
     opacity: ${props => props.$isActive ? 0.9 : 0.8};
  }
`;

// CORREÇÃO 2: Usa '$isAdmin' (transient prop) na definição e no uso para o span
const RoleDisplay = styled.div<{ $isAdmin: boolean }>`
  font-size: 0.9em;
  color: ${Colors.secondary};
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: center;

  span {
    font-weight: bold;
    margin-left: 5px;
    color: ${props => props.$isAdmin ? Colors.danger : Colors.primary};
  }
`;

const SubmitButton = styled(Button)`
  margin-top: 15px;
  padding: 12px;
  font-size: 1em;
`;

// --- Componente React ---

const UserRegisterPage: React.FC = () => {
    // --- State e Hooks (SEM ALTERAÇÕES) ---
    const [formData, setFormData] = useState<RegisterUserPayload>(BASE_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterUserPayload, string>>>({});
    const { registerUser, loading, error: apiError } = useRegisterUser();
    const isUserAdmin = formData.role === 'ADMIN';

    // --- Handlers (Lógica SEM ALTERAÇÕES) ---
     const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const key = name as keyof RegisterUserPayload;
        let valueToSet = value;

        if (key === 'cpf') {
            const rawCpf = value.replace(/\D/g, '');
            // Permite digitar até 11 dígitos
            valueToSet = rawCpf.substring(0, 11);
        }

        setFormData(prev => ({ ...prev, [key]: valueToSet }));
        // Limpa erro ao digitar
        if (errors[key]) {
             setErrors(prev => {
                 const newErrors = { ...prev };
                 delete newErrors[key];
                 return newErrors;
             });
        }
    };

    const handleRoleChange = (role: UserRole) => {
        setFormData(prev => ({ ...prev, role }));
    };

    const validate = (): boolean => {
        const newErrors: typeof errors = {};
        if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório.';
        if (!formData.email.trim()) newErrors.email = 'O email é obrigatório.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Formato de email inválido.';
        if (!formData.password.trim()) newErrors.password = 'A senha é obrigatória.';
        else if (formData.password.length < 6) newErrors.password = 'Senha deve ter no mínimo 6 caracteres.';
        if (!formData.cpf || formData.cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = 'O CPF deve ter 11 dígitos.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

     const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        if (!validate()) return;

        const payload: RegisterUserPayload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
            cpf: formData.cpf.replace(/\D/g, ''),
            role: formData.role,
        };

        console.log('Payload enviado:', payload);

        try {
            await registerUser(payload);
            alert(`Usuário ${payload.name} cadastrado com sucesso!`);
            setFormData(BASE_FORM);
        } catch (err: any) {
             console.error("Erro no registro:", err);
             // Erro já deve ser exibido pelo ErrorDisplay via 'apiError'
        }
    };


    // --- JSX com Styled Components (AJUSTES) ---
    return (
        <PageContainer>
            <FormCard paddingSize="large">
                <AppLogo />
                <Title>Cadastro de Novo Usuário</Title>

                {apiError && <ErrorDisplay>Erro: {apiError}</ErrorDisplay>}

                <Form onSubmit={handleSubmit}>
                    <RoleContainer>
                        <RoleLabel>Nível de Acesso:</RoleLabel>
                        <RoleButtonGroup>
                            {/* CORREÇÃO 3: Passa '$isActive' para o RoleButton */}
                            <RoleButton
                                type="button"
                                onClick={() => handleRoleChange('GESTOR')}
                                disabled={loading}
                                $isActive={!isUserAdmin} // Usa '$isActive'
                                title="Usuário GESTOR"
                            />
                            <RoleButton
                                type="button"
                                onClick={() => handleRoleChange('ADMIN')}
                                disabled={loading}
                                $isActive={isUserAdmin} // Usa '$isActive'
                                title="Administrador"
                            />
                        </RoleButtonGroup>
                    </RoleContainer>

                    {/* Inputs */}
                    <Input
                        label="Nome Completo *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                        disabled={loading}
                    />
                    <Input
                        label="CPF *"
                        name="cpf"
                        value={maskCPF(formData.cpf || '')} // Aplica máscara
                        onChange={handleChange}
                        maxLength={14} // Máscara + dígitos
                        error={errors.cpf}
                        required
                        disabled={loading}
                        inputMode="numeric"
                    />
                    <Input
                        label="Email *"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                        disabled={loading}
                    />
                    <Input
                        label="Senha Provisória *"
                        name="password"
                        type="password"
                        value={formData.password || ''}
                        onChange={handleChange}
                        error={errors.password}
                        required
                        disabled={loading}
                        minLength={6}
                    />

                    {/* CORREÇÃO 4: Passa '$isAdmin' para RoleDisplay */}
                    <RoleDisplay $isAdmin={isUserAdmin}>
                        Acesso Selecionado:
                        <span> {/* O span interno agora é estilizado pelo pai */}
                            {isUserAdmin ? 'ADMINISTRADOR TOTAL' : 'GESTOR PADRÃO'}
                        </span>
                    </RoleDisplay>

                    <SubmitButton
                        title={loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                        type="submit"
                        variant="primary"
                        loading={loading}
                    />
                </Form>
            </FormCard>
        </PageContainer>
    );
};

export default UserRegisterPage;