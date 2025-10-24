import React, { useState, type FormEvent, type ChangeEvent, useEffect } from 'react'; // Import types e useEffect
import styled from 'styled-components'; // Import styled
import { useNavigate, useSearchParams } from 'react-router-dom'; // Import useSearchParams
import { Colors } from '../theme/colors';
import CardComponent from '../components/ui/Card'; // Renomeia Card
import Input from '../components/ui/Input';       // Importa Input refatorado
import Button from '../components/ui/Button';     // Importa Button refatorado
import AppLogo from '../components/common/AppLogo';
import { useResetPassword } from '../hooks/useResetPassword';
import type { ResetPasswordPayload } from '../models/User';

// --- Constantes ---
const MIN_PASSWORD_LENGTH = 8;

// --- Styled Components (Reutilizados/Adaptados de RequestResetPage e LoginPage) ---

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
  max-width: 480px; /* Um pouco maior para mais campos */
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
  margin: 20px 0 10px;
`;

const Subtitle = styled.p`
  font-size: 1em;
  color: ${Colors.text};
  margin-bottom: 25px;
  text-align: center;
  max-width: 380px; /* Ajusta largura */
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
  max-width: 400px; /* Mantém largura do form */
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Faz Input/Button ocuparem a largura */
  gap: 15px; /* Reduz gap entre inputs */
`;

// Botão principal de ação
const ActionButton = styled(Button)`
  margin-top: 15px; /* Reduz espaço acima */
  padding: 12px;
  font-size: 1em;
`;

// Botão/Link para voltar
const BackLink = styled(Button)`
  margin-top: 20px;
  font-size: 0.9em;
  text-decoration: underline;
  padding: 5px;
`;


// --- Componente React ---

const ResetPasswordPage: React.FC = () => {
    // Busca token e email da URL (se existirem)
    const [searchParams] = useSearchParams();
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');

    // Estados do formulário, inicializados com valores da URL se disponíveis
    const [email, setEmail] = useState(urlEmail || '');
    const [token, setToken] = useState(urlToken || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ResetPasswordPayload | 'confirmPassword', string>>>({});


    const { resetPassword, loading, error: apiError, success } = useResetPassword(); // Assume que hook retorna success
    const navigate = useNavigate();

    // Sincroniza estado com URL se ela mudar (pouco provável, mas seguro)
    useEffect(() => {
        const urlToken = searchParams.get('token');
        const urlEmail = searchParams.get('email');
        if (urlToken && !token) setToken(urlToken);
        if (urlEmail && !email) setEmail(urlEmail);
    }, [searchParams, token, email]);


    // Validação com feedback nos campos
    const validate = (): boolean => {
        const newErrors: typeof fieldErrors = {};
        if (!email || !email.includes('@')) {
             newErrors.email = 'E-mail inválido.';
        }
        if (!token) {
             newErrors.token = 'Código obrigatório.';
        }
        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            newErrors.newPassword = `Mínimo ${MIN_PASSWORD_LENGTH} caracteres.`;
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem.';
        }
        setFieldErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFieldErrors({}); // Limpa erros antigos

        if (!validate()) return;

        const payload: ResetPasswordPayload = { email, token, newPassword };
        const success = await resetPassword(payload); // Chama o hook

        if (success) {
            alert('Senha redefinida com sucesso! Você será redirecionado para o login.');
            navigate('/'); // Volta para o login
        }
        // O erro da API (apiError) será exibido pelo JSX
    };

    const handleNavigateToLogin = () => {
        navigate('/');
    };

     // Limpa erro do campo ao digitar
     const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: keyof typeof fieldErrors) => (e: ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if (fieldErrors[fieldName]) {
            setFieldErrors(prev => {
                const updatedErrors = { ...prev };
                delete updatedErrors[fieldName];
                return updatedErrors;
            });
        }
     };

    return (
        <PageContainer>
            <FormCard paddingSize="large"> {/* Usa Card estilizado */}
                <AppLogo />

                <Title>Redefinir Senha</Title>
                <Subtitle>Confirme seu e-mail, insira o código recebido e defina sua nova senha.</Subtitle>

                {/* Mostra erro da API */}
                {apiError && <ErrorDisplay>Erro: {apiError}</ErrorDisplay>}

                <Form onSubmit={handleSubmit}>

                    <Input
                        label="E-mail de Cadastro *"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={handleInputChange(setEmail, 'email')}
                        error={fieldErrors.email}
                        required
                        disabled={loading}
                        autoComplete="email"
                    />

                    <Input
                        label="Código de Recuperação (Token) *"
                        name="token"
                        type="text"
                        placeholder="Cole o código recebido por e-mail"
                        value={token}
                        onChange={handleInputChange(setToken, 'token')}
                        error={fieldErrors.token}
                        required
                        disabled={loading}
                    />

                    <Input
                        label={`Nova Senha (Mínimo ${MIN_PASSWORD_LENGTH} caracteres) *`}
                        name="newPassword"
                        type="password"
                        placeholder="********"
                        value={newPassword}
                        onChange={handleInputChange(setNewPassword, 'newPassword')}
                        error={fieldErrors.newPassword}
                        required
                        disabled={loading}
                        autoComplete="new-password"
                    />

                    <Input
                        label="Confirme a Nova Senha *"
                        name="confirmPassword"
                        type="password"
                        placeholder="********"
                        value={confirmPassword}
                        onChange={handleInputChange(setConfirmPassword, 'confirmPassword')}
                        error={fieldErrors.confirmPassword}
                        required
                        disabled={loading}
                        autoComplete="new-password"
                    />

                    <ActionButton
                        title={loading ? 'Redefinindo...' : 'Redefinir Senha'}
                        type="submit"
                        variant="primary"
                        loading={loading}
                    />

                    <BackLink
                        title="Lembrei a senha / Voltar para Login"
                        type="button"
                        variant="ghost"
                        onClick={handleNavigateToLogin}
                        disabled={loading}
                    />

                </Form>
            </FormCard>
        </PageContainer>
    );
};

export default ResetPasswordPage;