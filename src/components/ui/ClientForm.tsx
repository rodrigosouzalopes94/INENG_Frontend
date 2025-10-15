// src/components/forms/ClienteForm.tsx

import { useState, useEffect } from 'react';
// Não importamos Card, pois ele será renderizado pelo componente Modal na ClientPage
import Input from '../ui/Input'; 
import Button from '../ui/Button';
import { useClientes } from '../../hooks/useClientes';
import type { Cliente, ClientePayload, TipoPessoa } from '../../models/Cliente';
import { maskCPF, maskCNPJ } from '../../utils/formatters'; 
import { Colors } from '../../theme/colors';

interface ClienteFormProps {
    clienteInicial?: Cliente | null;
    onSave: () => void;
}

const INITIAL_FORM: ClientePayload = {
    tipoPessoa: 'JURIDICA',
    nomeOuRazao: '',
    cep: '',
    enderecoCompleto: '',
    cpf: '', 
    cnpj: '',
};

const ClienteForm: React.FC<ClienteFormProps> = ({ clienteInicial, onSave }) => {
    const [formData, setFormData] = useState<ClientePayload>(INITIAL_FORM as ClientePayload);
    const [errors, setErrors] = useState<Partial<Record<keyof ClientePayload, string>>>({});
    
    // Puxa a lógica de submissão, loading e erro do hook de clientes
    const { submitCliente, loading, error } = useClientes(); 
    
    const isEditing = !!clienteInicial;
    const isPJ = formData.tipoPessoa === 'JURIDICA';

    // Lógica para carregar dados se for edição (UseEffect)
    useEffect(() => {
        if (clienteInicial) {
            setFormData({
                ...clienteInicial,
                cpf: clienteInicial.cpf || '',
                cnpj: clienteInicial.cnpj || '',
                tipoPessoa: clienteInicial.tipoPessoa as TipoPessoa, 
            });
        } else {
            setFormData(INITIAL_FORM as ClientePayload);
        }
    }, [clienteInicial]);
    
    // Manipuladores e Validação (Omitidos para brevidade, mas estão no código)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === 'cpf' || name === 'cnpj') {
            const rawValue = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [name]: rawValue }));
            if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleTogglePessoa = (type: TipoPessoa) => {
        setFormData(prev => ({ 
            ...prev, 
            tipoPessoa: type,
            cpf: type === 'JURIDICA' ? '' : prev.cpf,
            cnpj: type === 'FISICA' ? '' : prev.cnpj,
        }));
        setErrors({}); 
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof ClientePayload, string>> = {};
        if (!formData.nomeOuRazao) newErrors.nomeOuRazao = 'Nome/Razão Social é obrigatório.';
        if (!formData.cep) newErrors.cep = 'CEP é obrigatório.';

        const doc = isPJ ? formData.cnpj : formData.cpf;
        const requiredLength = isPJ ? 14 : 11;
        const docName = isPJ ? 'CNPJ' : 'CPF';
        
        if (!doc || doc.replace(/\D/g, '').length !== requiredLength) {
            newErrors[isPJ ? 'cnpj' : 'cpf'] = `${docName} deve ter ${requiredLength} dígitos.`;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) return;
        
        const payload: ClientePayload = {
            ...formData,
            tipoPessoa: isPJ ? 'JURIDICA' : 'FISICA', 
            cpf: isPJ ? null : formData.cpf, 
            cnpj: isPJ ? null : formData.cnpj,
        } as ClientePayload;

        const success = await submitCliente(payload, clienteInicial?.id);

        if (success) {
            onSave(); 
        } 
    };


    return (
        // ✅ CORREÇÃO 1: Wrapper sem Card (para evitar borda dupla)
        <div style={styles.formWrapper}> 
            <form onSubmit={handleSubmit} style={styles.formContainer}>
                
                {/* Mensagem de Erro Geral da API */}
                {error && <p style={styles.apiErrorText}>Falha na API: {error}</p>}
                
                {/* Título Condicional */}
                <h3 style={styles.formTitle}>{isEditing ? 'Editar Cliente Existente' : 'Novo Cliente'}</h3>
                
                {/* Seleção de Tipo de Pessoa (PF/PJ) */}
                <div style={styles.toggleContainer}>
                    <p style={styles.toggleLabel}>Tipo de Cadastro *</p>
                    <div style={styles.toggleButtonGroup}>
                        <Button 
                            title="Pessoa Jurídica" 
                            type="button" 
                            variant={isPJ ? 'primary' : 'secondary'}
                            onClick={() => handleTogglePessoa('JURIDICA')}
                            style={styles.toggleButton}
                        />
                         <Button 
                            title="Pessoa Física" 
                            type="button" 
                            variant={!isPJ ? 'primary' : 'secondary'}
                            onClick={() => handleTogglePessoa('FISICA')}
                            style={styles.toggleButton}
                        />
                    </div>
                </div>

                {/* CAMPOS DE INPUT */}
                <Input
                    label={isPJ ? 'CNPJ *' : 'CPF *'}
                    name={isPJ ? 'cnpj' : 'cpf'}
                    value={isPJ ? maskCNPJ(formData.cnpj || '') : maskCPF(formData.cpf || '')} 
                    onChange={handleChange}
                    maxLength={isPJ ? 18 : 14} 
                    error={errors.cpf || errors.cnpj}
                    required
                />
                <Input
                    label={isPJ ? 'Razão Social *' : 'Nome Completo *'}
                    name="nomeOuRazao"
                    value={formData.nomeOuRazao}
                    onChange={handleChange}
                    error={errors.nomeOuRazao}
                    required
                />
                
                {/* Endereço */}
                <Input
                    label="CEP *"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    error={errors.cep}
                    required
                />
                <Input
                    label="Endereço Completo *"
                    name="enderecoCompleto"
                    value={formData.enderecoCompleto}
                    onChange={handleChange}
                    error={errors.enderecoCompleto}
                    required
                />

                {/* Botão de Submissão */}
                <Button 
                    title={isEditing ? 'Salvar Alterações' : 'Cadastrar Cliente'} 
                    type="submit" 
                    variant="primary" 
                    loading={loading} 
                    style={styles.submitButton}
                />
            </form>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    formWrapper: {
        width: '100%',
        maxWidth: '550px',
        margin: '0 auto',
        padding: '10px', 
    },
    formTitle: {
        color: Colors.primary,
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '25px',
        textAlign: 'center',
        width: '100%',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '100%',
        alignItems: 'center',
    },
    toggleContainer: {
        width: '100%',
        marginBottom: '15px',
        textAlign: 'center',
    },
    toggleLabel: {
        color: Colors.text,
        fontWeight: 'bold',
        marginBottom: '8px',
        fontSize: '14px',
    },
    toggleButtonGroup: {
        display: 'flex', 
        gap: '10px', 
        width: '100%',
    },
    toggleButton: {
        width: 'calc(50% - 5px)', // Garante que os dois botões caibam lado a lado
        padding: '10px 0',
    },
    submitButton: {
        marginTop: '20px',
        width: '100%',
    },
    apiErrorText: {
        color: Colors.danger,
        padding: '10px',
        border: `1px solid ${Colors.danger}`,
        borderRadius: '5px',
        width: '100%',
        textAlign: 'center',
        fontSize: '14px',
    }
};

export default ClienteForm;