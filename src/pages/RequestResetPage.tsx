// src/pages/ForgotPasswordPage.tsx (PRIMEIRA ETAPA: Solicitar E-mail)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../theme/colors';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AppLogo from '../components/common/AppLogo'; 
import { useRequestReset } from '../hooks/useRequestReset';

const RequestResetPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const { requestReset, loading, error } = useRequestReset();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !email.includes('@')) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        const success = await requestReset({ email });

        if (success) {
            alert('Código de recuperação enviado! Verifique seu e-mail.');
            // ✅ REDIRECIONAMENTO: Vai para a SEGUNDA ETAPA (onde se usa o token)
            navigate('/reset-password'); 
        }
        // O erro é exibido pelo JSX.
    };

    const handleNavigateBack = () => {
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <Card>
                <AppLogo />
                
                <h2 style={styles.title}>Esqueceu a Senha?</h2>
                <p style={styles.subtitle}>Digite seu e-mail para receber o código de redefinição.</p>
                
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

                    <Button 
                        title={loading ? 'Enviando Token...' : 'Enviar Token'} 
                        type="submit" 
                        variant="primary" 
                        loading={loading}
                        style={styles.actionButton}
                    />
                    
                    <button type="button" style={styles.backToLoginButton} onClick={handleNavigateBack}>
                        Voltar para o Login
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
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '16px',
        color: Colors.text,
        marginBottom: '20px',
        textAlign: 'center',
    },
    form: {
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    actionButton: {
        marginTop: '20px',
    },
    backToLoginButton: {
        background: 'none',
        border: 'none',
        color: Colors.primary,
        cursor: 'pointer',
        marginTop: '15px',
        fontSize: '14px',
        textDecoration: 'underline',
    }
};

export default RequestResetPage;