// src/components/forms/ObraForm.tsx

import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useObraForm } from '../../hooks/useObraForm';
import type { TipoObra, ObraFormData } from '../../models/Obra';
import { Colors } from '../../theme/colors';

// Dados iniciais (alinhados ao Hook)
const INITIAL_FORM_DATA: ObraFormData = {
    clienteId: null,
    nomeObra: '',
    tipoObra: 'CONSTRUCAO',
    enderecoCompleto: '',
    dataInicio: new Date().toISOString().substring(0, 10),
    previsaoEntrega: '',
    fotos: null,
};


const ObraForm: React.FC<{ onSave: () => void }> = ({ onSave }) => {
    const { submitObra, loading, apiError, clientes } = useObraForm();
    const [formData, setFormData] = useState<ObraFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Partial<Record<keyof ObraFormData, string>>>({});
    const isConstrucao = formData.tipoObra === 'CONSTRUCAO';
    const hasClientes = clientes.length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'clienteId' ? Number(value) : value, // Converte clienteId para Number
        }));
        if (errors[name as keyof ObraFormData]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Captura a lista de arquivos
        setFormData(prev => ({ ...prev, fotos: e.target.files }));
    };

    const handleTypeChange = (type: TipoObra) => {
        setFormData(prev => ({
            ...prev,
            tipoObra: type,
            // Limpa campos condicionais ao alternar
            cno: undefined, 
            descricao: undefined,
        }));
        setErrors({});
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof ObraFormData, string>> = {};

        if (!formData.clienteId) newErrors.clienteId = 'Selecione o cliente responsável.';
        if (!formData.dataInicio) newErrors.dataInicio = 'Data de Início é obrigatória.';
        if (!formData.previsaoEntrega) newErrors.previsaoEntrega = 'Previsão de Entrega é obrigatória.';

        // Validação Condicional
        if (isConstrucao && (!formData.cno || formData.cno.length < 5)) {
            newErrors.cno = 'CNO é obrigatório e válido para Construção.';
        }
        if (!isConstrucao && (!formData.descricao || formData.descricao.length < 10)) {
            newErrors.descricao = 'Descrição detalhada é obrigatória para Reforma.';
        }
        
        if (!formData.enderecoCompleto || !formData.nomeObra) {
            newErrors.enderecoCompleto = 'Título e Endereço completo são obrigatórios.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        // Limpa o payload antes de enviar (remove campos vazios)
        const dataToSend: ObraFormData = {
            ...formData,
            cno: isConstrucao ? formData.cno : undefined,
            descricao: !isConstrucao ? formData.descricao : undefined,
        } as ObraFormData;

        const success = await submitObra(dataToSend);

        if (success) {
            alert('Obra cadastrada com sucesso!');
            onSave(); // Fecha o modal/redireciona
        }
    };

    // Renderização de Estado
    if (loading && clientes.length === 0) {
        return <p style={{ textAlign: 'center', color: Colors.primary }}>Carregando clientes...</p>;
    }
    
    if (clientes.length === 0) {
        return <p style={styles.apiErrorText}>Nenhum cliente cadastrado. Cadastre um cliente antes de criar uma obra.</p>;
    }

    return (
        <div style={styles.formWrapper}>
            <form onSubmit={handleSubmit} style={styles.formContainer} encType="multipart/form-data">
                
                {apiError && <p style={styles.apiErrorText}>{apiError}</p>}
                
                {/* 1. SELEÇÃO DE CLIENTE (Dropdown) */}
                <div style={styles.selectContainer}>
                    <label style={styles.label}>Cliente Responsável *</label>
                    <select
                        name="clienteId"
                        value={formData.clienteId || ''}
                        onChange={(e) => handleChange(e as React.ChangeEvent<HTMLSelectElement>)}
                        style={styles.selectField}
                        required
                    >
                        <option value="">-- Selecione um Cliente --</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nomeOuRazao} ({cliente.id})
                            </option>
                        ))}
                    </select>
                    {errors.clienteId && <span style={styles.errorText}>{errors.clienteId}</span>}
                </div>
                
                {/* 2. TÍTULO E TIPO DE OBRA */}
                <Input label="Nome da Obra/Título *" name="nomeObra" value={formData.nomeObra} onChange={handleChange} error={errors.nomeObra} required />

                <div style={styles.toggleContainer}>
                    <p style={styles.toggleLabel}>Tipo de Obra *</p>
                    <div style={styles.toggleButtonGroup}>
                        <Button 
                            title="Construção" 
                            type="button" 
                            variant={isConstrucao ? 'primary' : 'secondary'}
                            onClick={() => handleTypeChange('CONSTRUCAO')}
                        />
                        <Button 
                            title="Reforma" 
                            type="button" 
                            variant={!isConstrucao ? 'primary' : 'secondary'}
                            onClick={() => handleTypeChange('REFORMA')}
                        />
                    </div>
                </div>

                {/* 3. CAMPO CONDICIONAL */}
                {isConstrucao ? (
                    <Input label="CNO (Cadastro Nacional de Obra) *" name="cno" value={formData.cno || ''} onChange={handleChange} error={errors.cno} required={isConstrucao} />
                ) : (
                    // Usar textarea para descrição longa
                    <Input label="Descrição da Reforma *" name="descricao" value={formData.descricao || ''} onChange={handleChange} error={errors.descricao} required={!isConstrucao} style={{ gridColumn: 'span 2' }} />
                )}

                {/* 4. DATAS E ENDEREÇO */}
                <Input label="Data de Início *" name="dataInicio" type="date" value={formData.dataInicio} onChange={handleChange} required />
                <Input label="Previsão de Entrega *" name="previsaoEntrega" type="date" value={formData.previsaoEntrega || ''} onChange={handleChange} error={errors.previsaoEntrega} required />

                <Input label="Endereço Completo *" name="enderecoCompleto" value={formData.enderecoCompleto} onChange={handleChange} error={errors.enderecoCompleto} required style={{ gridColumn: 'span 2' }} />
                
                {/* 5. UPLOAD DE FOTOS */}
                <Input label="Fotos da Obra (Máx. 10 arquivos)" name="fotos" type="file" onChange={handleFileUpload} multiple accept="image/*" style={{ gridColumn: 'span 2' }} />

                {/* BOTÃO SUBMIT */}
                <Button 
                    title={loading ? 'Cadastrando Obra...' : 'Finalizar Cadastro de Obra'} 
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
        maxWidth: '700px', 
        margin: '0 auto', 
        padding: '20px', 
    },
    formTitle: {
        color: Colors.primary,
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '25px',
        textAlign: 'center',
    },
    formContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        padding: '20px',
        border: `1px solid ${Colors.background}`,
        borderRadius: '8px',
        backgroundColor: Colors.white,
    },
    selectContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gridColumn: 'span 2', 
    },
    selectField: {
        padding: '10px',
        border: `1px solid ${Colors.secondary}`,
        borderRadius: '5px',
        fontSize: '16px',
        height: '42px', 
        backgroundColor: Colors.white,
    },
    label: {
        color: Colors.text,
        fontWeight: 'bold',
        marginBottom: '5px',
        fontSize: '14px',
    },
    toggleContainer: {
        gridColumn: 'span 2',
        textAlign: 'center',
        marginBottom: '10px',
    },
    toggleLabel: {
        color: Colors.primary,
        fontWeight: 'bold',
        marginBottom: '10px',
        fontSize: '16px',
    },
    toggleButtonGroup: {
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
    },
    submitButton: {
        marginTop: '20px',
        gridColumn: 'span 2',
    },
    errorText: { // Estilo de erro genérico
        color: Colors.danger,
        fontSize: '12px',
        marginTop: '5px',
    },
    apiErrorText: {
        color: Colors.danger,
        padding: '15px',
        border: `1px solid ${Colors.danger}`,
        borderRadius: '5px',
        width: '100%',
        textAlign: 'center',
        gridColumn: 'span 2',
        marginBottom: '10px',
        backgroundColor: '#fff4f4',
    }
};

export default ObraForm;