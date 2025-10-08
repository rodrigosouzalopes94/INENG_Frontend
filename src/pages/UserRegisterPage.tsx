import { useState } from 'react';
import { Colors } from '../theme/colors';
import type { UserRole, RegisterUserPayload } from '../models/User';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AppLogo from '../components/common/AppLogo'; 
import { useRegisterUser } from '../hooks/useRegisterUser'; 
import { maskCPF } from '../utils/formatters';

const BASE_FORM: RegisterUserPayload = {
    name: '',
    email: '',
    password: '',
    cpf: '',
    role: 'GESTOR', 
};

const UserRegisterPage: React.FC = () => {
    const [formData, setFormData] = useState<RegisterUserPayload>(BASE_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterUserPayload, string>>>({});

    // Hook real conectado ao backend
    const { registerUser, loading, error } = useRegisterUser();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const key = name as keyof RegisterUserPayload; // <-- correção de tipagem

        if (key === 'cpf') {
            const rawCpf = value.replace(/\D/g, '');
            if (rawCpf.length <= 11) {
                setFormData(prev => ({ ...prev, [key]: rawCpf }));
            }
            return;
        }

        setFormData(prev => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
    };

    const handleRoleChange = (role: UserRole) => {
        setFormData(prev => ({ ...prev, role }));
    };

    const validate = (): boolean => {
        const newErrors: typeof errors = {};
        if (!formData.name) newErrors.name = 'O nome é obrigatório.';
        if (formData.cpf.length !== 11) newErrors.cpf = 'O CPF deve ter 11 dígitos.';
        if (!formData.email) newErrors.email = 'O email é obrigatório.';
        if (!formData.password) newErrors.password = 'A senha é obrigatória.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const result = await registerUser(formData);

        if (result.success) {
            alert(`Gestor ${formData.name} cadastrado com sucesso!`);
            setFormData(BASE_FORM); 
        } else {
            alert(`Falha no cadastro: ${result.message}`);
        }
    };

    const isUserAdmin = formData.role === 'ADMIN';

    return (
        <div style={styles.container}>
            <Card>
                <AppLogo />
                
                <h2 style={styles.title}>Cadastro de Gestores</h2>
                
                {/* Erro geral do backend */}
                {error && <div style={{ color: Colors.danger, marginBottom: '15px' }}>Erro Geral: {error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Seleção de role */}
                    <div style={styles.roleContainer}>
                        <p style={{ color: Colors.text, fontWeight: 'bold', marginBottom: '10px' }}>Nível de Acesso:</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => handleRoleChange('GESTOR')}
                                disabled={loading}
                                style={{ ...styles.roleButton, backgroundColor: !isUserAdmin ? Colors.accent : Colors.secondary }}
                            >
                                Usuário GESTOR
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRoleChange('ADMIN')}
                                disabled={loading}
                                style={{ ...styles.roleButton, backgroundColor: isUserAdmin ? Colors.accent : Colors.secondary }}
                            >
                                Administrador
                            </button>
                        </div>
                    </div>
                    
                    {/* Campos */}
                    <Input label="Nome Completo" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
                    <Input label="CPF" name="cpf" value={maskCPF(formData.cpf || '')} onChange={handleChange} maxLength={14} error={errors.cpf} required />
                    <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
                    <Input label="Senha Provisória" name="password" type="password" value={formData.password || ''} onChange={handleChange} error={errors.password} required />
                    
                    {/* Exibição da role */}
                    <div style={styles.roleDisplay}>
                        Acesso: 
                        <span style={{ fontWeight: 'bold', color: isUserAdmin ? Colors.danger : Colors.primary, marginLeft: '5px' }}>
                            {isUserAdmin ? 'ADMINISTRADOR TOTAL' : 'GESTOR COMUM'}
                        </span>
                    </div>

                    {/* Botão de submit */}
                    <Button 
                        title={loading ? 'Cadastrando...' : 'Finalizar Cadastro'} 
                        type="submit" 
                        variant="primary" 
                        loading={loading}
                    />
                </form>
            </Card>
        </div>
    );
};

// Estilos
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
    roleContainer: {
        width: '100%',
        marginBottom: '20px',
        textAlign: 'center',
    },
    roleButton: {
        padding: '8px 15px',
        borderRadius: '5px',
        border: 'none',
        color: Colors.white,
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    roleDisplay: {
        fontSize: '14px',
        color: Colors.secondary,
        marginTop: '10px',
        marginBottom: '10px',
        textAlign: 'center',
    }
};

export default UserRegisterPage;
