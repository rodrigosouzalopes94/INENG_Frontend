// src/components/forms/ObraForm.tsx
import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useObraForm } from '../../hooks/useObraForm';
import type { ObraFormData, Obra } from '../../models/Obra';
import { Colors } from '../../theme/colors';

const INITIAL_FORM_DATA: ObraFormData = {
    clienteId: 0,
    nomeObra: '',
    tipoObra: 'CONSTRUCAO',
    enderecoCompleto: '',
    dataInicio: new Date().toISOString().substring(0, 10),
    previsaoEntrega: '',
    cno: '',
    descricao: '',
    fotos: null,
};

interface ObraFormProps {
    obraInicial?: Obra | null;
    onSave: () => void;
}

const ObraForm: React.FC<ObraFormProps> = ({ obraInicial, onSave }) => {
    const { submitObra, loading, apiError, clientes } = useObraForm();
    const [formData, setFormData] = useState<ObraFormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Partial<Record<keyof ObraFormData, string>>>({});

    const isEditing = !!obraInicial?.id;
    const isConstrucao = formData.tipoObra === 'CONSTRUCAO';

    useEffect(() => {
        if (obraInicial) {
            setFormData({
                ...obraInicial,
                dataInicio: new Date(obraInicial.dataInicio).toISOString().substring(0, 10),
                previsaoEntrega: obraInicial.previsaoEntrega ? new Date(obraInicial.previsaoEntrega).toISOString().substring(0, 10) : '',
                cno: obraInicial.cno ?? '',
                descricao: obraInicial.descricao ?? '',
                fotos: null,
            });
            setErrors({});
        }
    }, [obraInicial]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'clienteId' ? Number(value) : value,
        }));
        if (errors[name as keyof ObraFormData]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, fotos: e.target.files }));
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof ObraFormData, string>> = {};
        if (!formData.clienteId) newErrors.clienteId = 'Selecione o cliente responsável.';
        if (!formData.nomeObra) newErrors.nomeObra = 'Nome da obra obrigatório.';
        if (!formData.enderecoCompleto) newErrors.enderecoCompleto = 'Endereço obrigatório.';
        if (!formData.dataInicio) newErrors.dataInicio = 'Data de início obrigatória.';
        if (!formData.previsaoEntrega) newErrors.previsaoEntrega = 'Previsão de entrega obrigatória.';
        if (isConstrucao && !formData.cno) newErrors.cno = 'CNO obrigatório para Construção.';
        if (!isConstrucao && !formData.descricao) newErrors.descricao = 'Descrição obrigatória para Reforma.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const success = await submitObra(formData, isEditing ? obraInicial?.id : undefined);
        if (success) {
            alert(`Obra ${isEditing ? 'atualizada' : 'cadastrada'} com sucesso!`);
            onSave();
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ display: 'grid', gap: 15 }}>
            {apiError && <p style={{ color: Colors.danger }}>{apiError}</p>}
            <select name="clienteId" value={formData.clienteId || ''} onChange={handleChange}>
                <option value="">-- Selecione Cliente --</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nomeOuRazao}</option>)}
            </select>
            {errors.clienteId && <span style={{ color: Colors.danger }}>{errors.clienteId}</span>}
            
            <Input label="Nome Obra" name="nomeObra" value={formData.nomeObra} onChange={handleChange} error={errors.nomeObra} />
            <Input label="Endereço Completo" name="enderecoCompleto" value={formData.enderecoCompleto} onChange={handleChange} error={errors.enderecoCompleto} />
            <Input label="Data de Início" name="dataInicio" type="date" value={formData.dataInicio} onChange={handleChange} error={errors.dataInicio} />
            <Input label="Previsão Entrega" name="previsaoEntrega" type="date" value={formData.previsaoEntrega} onChange={handleChange} error={errors.previsaoEntrega} />
            {isConstrucao ? (
                <Input label="CNO" name="cno" value={formData.cno} onChange={handleChange} error={errors.cno} />
            ) : (
                <Input label="Descrição" name="descricao" value={formData.descricao} onChange={handleChange} error={errors.descricao} />
            )}
            <Input label="Fotos" name="fotos" type="file" multiple onChange={handleFileUpload} />
            <div style={{ display: 'flex', gap: 10 }}>
                <Button title="Cancelar" type="button" variant="secondary" onClick={onSave} />
                <Button title={isEditing ? 'Salvar' : 'Cadastrar'} type="submit" variant="primary" loading={loading} />
            </div>
        </form>
    );
};

export default ObraForm;
