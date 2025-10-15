// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Colors } from '../theme/colors';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AppLogo from '../components/common/AppLogo';
import { useAuthContext } from '../context/AuthContext'; // ✅ NOVO: Usa o contexto

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const navigate = useNavigate();
    // ✅ Pega o login do contexto
    const { login } = useAuthContext(); 
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    // Validação mínima antes de enviar
    const validate = (): boolean => {
        const newErrors: typeof errors = {};
        if (!email.trim()) newErrors.email = 'O email é obrigatório.';
        if (!password.trim()) newErrors.password = 'A senha é obrigatória.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                email: email.trim(),
                password: password.trim(),
            };
            const res = await axios.post(`${API_URL}/auth/login`, payload);
            const { token, user } = res.data;
            login(user, token);
            navigate('/dashboard');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Erro no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <Card style={styles.card}>
                <AppLogo />
                <h2 style={styles.title}>Portal de Gestão - INENG</h2>

                <form onSubmit={handleLogin} style={styles.form}>
                    {/* ✅ ESTRUTURA ORIGINAL RESTAURADA */}
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                            required
                            disabled={loading}
                            style={styles.input}
                        />
                        {errors.email && <span style={{ color: Colors.danger, fontSize: 12 }}>{errors.email}</span>}
                    </div>

                    {/* ✅ ESTRUTURA ORIGINAL RESTAURADA */}
                    <div style={styles.field}>
                        <label style={styles.label}>Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
                            required
                            disabled={loading}
                            style={styles.input}
                        />
                        {errors.password && <span style={{ color: Colors.danger, fontSize: 12 }}>{errors.password}</span>}
                    </div>

                    <Button
                        title={loading ? 'Entrando...' : 'Entrar'}
                        type="submit"
                        variant="primary"
                        loading={loading}
                        style={styles.button}
                    />

                    <button type="button" style={styles.linkButton} onClick={() => navigate('/request-reset')}>
                        Esqueceu sua senha?
                    </button>

                    <button
                        type="button"
                        style={styles.registerButton}
                        onClick={() => navigate('/register-user')}
                    >
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
        background: `linear-gradient(135deg, ${Colors.background}, #f8fafc)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 520,
        padding: '48px 36px',
        borderRadius: 18,
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        margin: '20px 0 32px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
    },
    field: {
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    label: {
        color: Colors.text,
        fontWeight: 'bold',
        marginBottom: 6,
        fontSize: 14,
    },
    input: {
        width: '100%',
        padding: '10px 14px',
        borderRadius: 8,
        border: `1px solid ${Colors.secondary}`,
        fontSize: 14,
        outline: 'none',
    },
    button: {
        width: '80%',
        padding: '12px',
        fontSize: 16,
        borderRadius: 10,
    },
    linkButton: {
        background: 'none',
        border: 'none',
        color: Colors.primary,
        cursor: 'pointer',
        marginTop: 10,
        fontSize: 14,
    },
    registerButton: {
        background: 'none',
        border: 'none',
        color: Colors.accent,
        cursor: 'pointer',
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
        textDecoration: 'underline',
    },
};

export default LoginPage;