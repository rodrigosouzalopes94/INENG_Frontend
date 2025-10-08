
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook de navegação
import { Colors } from '../theme/colors';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AppLogo from '../components/common/AppLogo';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simulação de chamada de API e autenticação
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);

        // ✅ REDIRECIONAMENTO CRÍTICO:
        // Se o login for de sucesso (admin, por exemplo), navega para o cadastro de gestores
        if (email === 'admin@ineng.com' && password === '123456') {
            alert('Login de Administrador realizado com sucesso!');
            // Redireciona para a rota de cadastro de usuário
            navigate('/register-user');
        } else {
            alert('Erro: Email ou senha inválidos.');
        }
    };

     // ✅ FUNÇÃO ADICIONADA: Navegar para a tela de registro
    const handleNavigateToRegister = () => {
        navigate('/register');
    };
    
    // ✅ FUNÇÃO ADICIONADA: Simulação de recuperação de senha
    const handleForgotPassword = () => {
        alert('Redirecionando para recuperação de senha...');
        // Futuramente: navigate('/forgot-password');
    };


    return (
        <div style={styles.container}>
            <Card>
                <AppLogo />

                <h2 style={styles.title}>Acesso ao Portal de Gestão</h2>

                <form onSubmit={handleLogin} style={styles.form}>

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="admin@ineng.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <Input
                        label="Senha"
                        name="password"
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    {/* Botão de Login principal */}
                    <Button
                        title={loading ? 'Entrando...' : 'Entrar'}
                        type="submit"
                        variant="primary"
                        loading={loading}
                    />

                    {/* BOTÃO 1: Esqueceu a senha (mantido como botão de link) */}
                    <button type="button" style={styles.linkButton} onClick={handleForgotPassword}>
                        Esqueceu sua senha?
                    </button>

                    {/* BOTÃO 2: Cadastre-se (novo gestor) */}
                    <button type="button" style={styles.registerButton} onClick={handleNavigateToRegister}>
                        Não tem acesso? Cadastre-se
                    </button>

                </form>
            </Card>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        backgroundColor: Colors.background,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: '20px',
    },
    form: {
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    linkButton: {
        background: 'none',
        border: 'none',
        color: Colors.primary,
        cursor: 'pointer',
        marginTop: '15px',
        fontSize: '14px',
    },

    registerButton: {
        background: 'none',
        border: 'none',
        color: Colors.accent, // Laranja (destaque para cadastro)
        cursor: 'pointer',
        marginTop: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        textDecoration: 'underline',
    }
};

export default LoginPage;