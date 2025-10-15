// src/pages/ResetPasswordPage.tsx (Pede o Token e a Nova Senha)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../theme/colors';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AppLogo from '../components/common/AppLogo';
import { useResetPassword } from '../hooks/useResetPassword';
import type { ResetPasswordPayload } from '../models/User';

const MIN_PASSWORD_LENGTH = 8;

const ResetPasswordPage: React.FC = () => {
    // Campos da segunda etapa
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { resetPassword, loading, error } = useResetPassword();
    const navigate = useNavigate();

    const validate = (): boolean => {
        if (!email || !email.includes('@')) {
            alert('Por favor, insira seu e-mail.');
            return false;
        }
        if (!token) {
            alert('O código de recuperação é obrigatório.');
            return false;
        }
        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            alert(`A nova senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`);
            return false;
        }
        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const payload: ResetPasswordPayload = { email, token, newPassword };

        const success = await resetPassword(payload);

        if (success) {
            alert('Senha redefinida com sucesso! Redirecionando para o login.');
            navigate('/'); // Volta para o login
        }
    };

    const handleNavigateToLogin = () => {
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <Card>
                <AppLogo />

                <h2 style={styles.title}>Redefinir Senha</h2>
                <p style={styles.subtitle}>Confirme seu e-mail, código e defina a nova senha.</p>

                {error && <div style={{ color: Colors.danger, marginBottom: '15px' }}>Erro: {error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>

                    <Input
                        label="E-mail de Cadastro"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        label="Código de Recuperação (Token)"
                        name="token"
                        type="text"
                        placeholder="Ex: 1a2b3c4d"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                    />

                    <Input
                        label={`Nova Senha (Mínimo ${MIN_PASSWORD_LENGTH} caracteres)`}
                        name="newPassword"
                        type="password"
                        placeholder="********"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    <Input
                        label="Confirme a Nova Senha"
                        name="confirmPassword"
                        type="password"
                        placeholder="********"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <Button
                        title={loading ? 'Redefinindo...' : 'Redefinir Senha'}
                        type="submit"
                        variant="primary"
                        loading={loading}
                        style={styles.actionButton}
                    />

                    <button type="button" style={styles.backToLoginButton} onClick={handleNavigateToLogin}>
                        Lembrei a senha / Voltar
                    </button>

                </form>
            </Card>
        </div>
    );
};

// ... (Styles)
const styles: { [key: string]: React.CSSProperties } = {
    container: { minHeight: '100vh', backgroundColor: Colors.background, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
    title: { fontSize: '24px', fontWeight: 'bold', color: Colors.primary, marginBottom: '10px' },
    subtitle: { fontSize: '16px', color: Colors.text, marginBottom: '20px', textAlign: 'center' },
    form: { width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    actionButton: { marginTop: '20px' },
    backToLoginButton: { background: 'none', border: 'none', color: Colors.primary, cursor: 'pointer', marginTop: '15px', fontSize: '14px', textDecoration: 'underline' }
};

export default ResetPasswordPage;