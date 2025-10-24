import React, { useState, FormEvent, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Lembre-se: idealmente usar sua instância 'api'
import { Colors } from '../theme/colors';
import CardComponent from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AppLogo from '../components/common/AppLogo';
import { useAuthContext } from '../context/AuthContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

// --- Styled Components ---

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${Colors.background}, #f8fafc);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const LoginCard = styled(CardComponent)`
  width: 100%;
  max-width: 480px;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
  background-color: ${Colors.white};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 600px) {
    padding: 30px 20px;
    max-width: 95%;
  }
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: ${Colors.primary};
  margin: 20px 0 30px;

  @media (max-width: 600px) {
    font-size: 20px;
    margin-bottom: 25px;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Alinha inputs para ocupar largura */
  gap: 18px;
  width: 85%;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

// O Input já tem width 100% por padrão, controlado pelo LoginForm
// const FormInput = styled(Input)``; // Não é necessário

const SubmitButton = styled(Button)`
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 16px;
  border-radius: 10px;
  width: 100%;
  margin-top: 10px;
`;

const BaseLinkButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  font-size: 14px;
  text-align: center;
  width: 100%;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const ForgotPasswordLink = styled(BaseLinkButton)`
  color: ${Colors.primary};
  margin-top: 15px;
`;

const RegisterLink = styled(BaseLinkButton)`
  color: ${Colors.accent};
  margin-top: 8px;
  font-weight: bold;
`;

// --- Componente React ---

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuthContext();
    // Use sua instância 'api' configurada aqui para consistência
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    // Função para alternar visibilidade da senha
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    // Validação
    const validate = (): boolean => {
        const newErrors: typeof errors = {};
        if (!email.trim()) newErrors.email = 'O email é obrigatório.';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Formato de email inválido.';
        if (!password.trim()) newErrors.password = 'A senha é obrigatória.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle Login
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setErrors({});
        try {
            const payload = { email: email.trim(), password: password.trim() };
            // Lembrete: Substituir axios.post por sua instância 'api'
            const res = await axios.post(`${API_URL}/auth/login`, payload);
            const { token, user } = res.data;
            login(user, token);
            navigate('/dashboard');
        } catch (err: any) {
            const apiError = err.response?.data?.error || 'Erro no login. Verifique suas credenciais.';
            // Exibe o erro no campo email e limpa a senha visualmente (ou adiciona ' ' em password)
            setErrors({ email: apiError /* , password: ' ' */ });
            console.error("Erro de login:", apiError);
        } finally {
            setLoading(false);
        }
    };

    // --- JSX com Styled Components ---
    return (
        <PageContainer>
            <LoginCard>
                <AppLogo />
                <Title>Portal de Gestão - INENG</Title>

                <LoginForm onSubmit={handleLogin}>
                    <Input // Usa o Input diretamente
                        label="Email *"
                        type="email"
                        name="email"
                        value={email}
                        // Limpa o erro do email ao digitar, mas mantém o da senha se houver
                        onChange={(e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                        required
                        disabled={loading}
                        error={errors.email}
                        autoComplete="email"
                    />

                    <Input // Usa o Input diretamente
                        label="Senha *"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                         // Limpa o erro da senha ao digitar, mas mantém o do email se houver
                        onChange={(e: ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
                        required
                        disabled={loading}
                        error={errors.password} // Passa erro para o Input
                        autoComplete="current-password"
                        iconEnd={ // Passa o ícone clicável
                          <span onClick={togglePasswordVisibility} style={{ cursor: 'pointer', display: 'flex' }}> {/* display:flex ajuda alinhamento do ícone */}
                            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                          </span>
                        }
                    />

                    <SubmitButton
                        title={loading ? 'Entrando...' : 'Entrar'}
                        type="submit"
                        variant="primary"
                        loading={loading}
                    />

                    <ForgotPasswordLink type="button" onClick={() => navigate('/request-reset')}>
                        Esqueceu sua senha?
                    </ForgotPasswordLink>

                    <RegisterLink type="button" onClick={() => navigate('/register-user')}>
                        Não tem acesso? Cadastre-se
                    </RegisterLink>
                </LoginForm>
            </LoginCard>
        </PageContainer>
    );
};

export default LoginPage;