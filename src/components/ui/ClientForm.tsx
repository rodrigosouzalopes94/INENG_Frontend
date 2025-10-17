// src/components/forms/ClienteForm.tsx

import { useState, useEffect } from 'react';
import Input from '../ui/Input'; 
import Button from '../ui/Button';
import { useClientes } from '../../hooks/useClientes'; 
import type { Cliente, ClientePayload, TipoPessoa } from '../../models/Cliente';
import { maskCPF, maskCNPJ, maskCEP } from '../../utils/formatters'; 
import { Colors } from '../../theme/colors';

interface ClienteFormProps {
    clienteInicial?: Cliente | null;
    onSave: () => void; // Função para fechar o modal e atualizar a lista
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
    const { submitCliente, loading, error: apiError } = useClientes(); 
    
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
        setErrors({}); 
    }, [clienteInicial]);
    
    // Manipuladores
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Lógica de sanitização em tempo real (apenas números no estado)
        if (name === 'cpf' || name === 'cnpj' || name === 'cep') {
            const rawValue = value.replace(/\D/g, '');
            let limitedValue = rawValue;

            if (name === 'cep') limitedValue = rawValue.substring(0, 8); 
            else if (name === 'cpf') limitedValue = rawValue.substring(0, 11);
            else if (name === 'cnpj') limitedValue = rawValue.substring(0, 14);

            setFormData(prev => ({ ...prev, [name]: limitedValue }));
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
            cpf: '', 
            cnpj: '', 
        }));
        setErrors({}); 
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof ClientePayload, string>> = {};
        
        if (!formData.nomeOuRazao) newErrors.nomeOuRazao = 'Nome/Razão Social é obrigatório.';
        
        // Validação de CEP
        if (formData.cep.replace(/\D/g, '').length !== 8) newErrors.cep = 'CEP deve ter 8 dígitos.';

        // Validação de CPF/CNPJ
        const doc = isPJ ? formData.cnpj : formData.cpf;
        const requiredLength = isPJ ? 14 : 11;
        const docName = isPJ ? 'CNPJ' : 'CPF';
        
        if (!doc || doc.replace(/\D/g, '').length !== requiredLength) {
            newErrors[isPJ ? 'cnpj' : 'cpf'] = `${docName} deve ter ${requiredLength} dígitos.`;
        }
        if (!formData.enderecoCompleto) newErrors.enderecoCompleto = 'Endereço completo é obrigatório.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Submissão (Usa o Hook de API)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) return;
        
        // Sanitização Crítica no Payload
        const cleanCnpj = formData.cnpj ? formData.cnpj.replace(/\D/g, '') : null;
        const cleanCpf = formData.cpf ? formData.cpf.replace(/\D/g, '') : null;

        const payload: ClientePayload = {
            ...formData,
            tipoPessoa: isPJ ? 'JURIDICA' : 'FISICA', 
            cep: formData.cep.replace(/\D/g, ''), 
            // Garante que o campo irrelevante seja NULL e o relevante seja a string limpa
            cnpj: isPJ ? cleanCnpj : null,
            cpf: isPJ ? null : cleanCpf,
            enderecoCompleto: formData.enderecoCompleto,
        } as ClientePayload;

        const success = await submitCliente(payload, clienteInicial?.id); 

        if (success) {
            const action = clienteInicial ? 'alterado' : 'cadastrado';
            alert(`Cliente ${payload.nomeOuRazao} ${action} com sucesso!`);
            onSave(); 
        } 
    };


    return (
        <div style={styles.formWrapper}> 
            <form onSubmit={handleSubmit} style={styles.formContainer}>
                
                {/* Mensagem de Erro Geral da API */}
                {apiError && <p style={styles.apiErrorText}>Falha na API: {apiError}</p>}
                
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

                {/* Documento Condicional (CPF ou CNPJ) */}
                <Input
                    label={isPJ ? 'CNPJ *' : 'CPF *'}
                    name={isPJ ? 'cnpj' : 'cpf'}
                    value={isPJ ? maskCNPJ(formData.cnpj || '') : maskCPF(formData.cpf || '')} 
                    onChange={handleChange}
                    maxLength={isPJ ? 18 : 14} 
                    error={errors.cpf || errors.cnpj}
                    required
                />
                
                {/* Nome / Razão Social */}
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
                    value={maskCEP(formData.cep || '')}
                    onChange={handleChange}
                    maxLength={10} 
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

// Estilos formatados e completos
const styles: { [key: string]: React.CSSProperties } = {
    formWrapper: { width: '100%', maxWidth: '550px', margin: '0 auto', padding: '10px' },
    formTitle: { color: Colors.primary, fontSize: '20px', fontWeight: 'bold', marginBottom: '25px', textAlign: 'center', width: '100%' },
    formContainer: { display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', alignItems: 'center' },
    toggleContainer: { width: '100%', marginBottom: '15px', textAlign: 'center' },
    toggleLabel: { color: Colors.text, fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' },
    toggleButtonGroup: { display: 'flex', gap: '10px', width: '100%' },
    toggleButton: { width: 'calc(50% - 5px)', padding: '10px 0' },
    submitButton: { marginTop: '20px', width: '100%' },
    apiErrorText: { color: Colors.danger, padding: '10px', border: `1px solid ${Colors.danger}`, borderRadius: '5px', width: '100%', textAlign: 'center', fontSize: '14px' }
};

export default ClienteForm;