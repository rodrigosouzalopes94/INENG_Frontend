// src/pages/ObraScreen.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { Colors } from '../theme/colors';
import Card from '../components/ui/Card';
import DashboardLayout from '../components/ui/DashboardLayout';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import ObraForm from '../components/ui/ObraForm';
import { useAuthContext } from '../context/AuthContext';
import { useObrasList } from '../hooks/useObrasList';
import type { Obra } from '../models/Obra';

// Componente para exibir detalhes da obra no modal
const ObraDetailModalContent: React.FC<{ obra: Obra }> = ({ obra }) => {
    return (
        <div style={detailStyles.container}>
            <h3 style={detailStyles.title}>Detalhes da Obra {obra.nomeObra}</h3>
            <p><strong>Cliente:</strong> {obra.cliente?.nomeOuRazao || 'N/A'}</p>
            <p><strong>Tipo:</strong> {obra.tipoObra}</p>
            <p><strong>{obra.tipoObra === 'CONSTRUCAO' ? 'CNO' : 'Descrição'}:</strong> {obra.cno || obra.descricao}</p>

            <h4 style={detailStyles.photosTitle}>Fotos ({obra.fotos?.length || 0})</h4>
            <div style={detailStyles.photosGrid}>
                {obra.fotos?.map(foto => (
                    <img key={foto.id} src={`http://localhost:3000${foto.url}`} style={detailStyles.photo} alt={`Foto ${foto.id}`} />
                ))}
            </div>
        </div>
    );
};

const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Obras', path: '/obras' },
];

const ObraScreen: React.FC = () => {
    const { obras, loading, error, removeObra, fetchObras } = useObrasList();
    const { user } = useAuthContext();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const userRole = user?.role === 'ADMIN' ? 'ADMIN' : 'GESTOR';

    // Logs para debug
    useEffect(() => {
        console.log('Estado obras:', obras);
    }, [obras]);

    // Funções da tabela e modal
    const handleViewDetails = (obra: Obra) => {
        setSelectedObra(obra);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEdit = (obra: Obra) => {
        setSelectedObra(obra);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setSelectedObra(null);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        setIsModalOpen(false);
        setSelectedObra(null);
        setIsEditing(false);
        fetchObras(); // Atualiza a lista
    };

    // Colunas da tabela
    const columns = useMemo(() => [
        { header: 'ID', accessor: 'id' as const, width: '5%' },
        { header: 'Nome', accessor: 'nomeObra', width: '20%' },
        { header: 'Cliente', accessor: (o: Obra) => o.cliente?.nomeOuRazao || 'N/A', width: '20%' },
        { header: 'Tipo', accessor: 'tipoObra', width: '10%' },
        { header: 'Início', accessor: (o: Obra) => new Date(o.dataInicio).toLocaleDateString(), width: '15%' },
        { header: 'Ações', accessor: (o: Obra) => (
            <div style={{ display: 'flex', gap: '8px' }}>
                <Button title="Ver" variant="ghost" onClick={() => handleViewDetails(o)} />
                <Button title="Editar" variant="ghost" onClick={() => handleEdit(o)} />
                <Button title="Excluir" variant="danger" onClick={() => removeObra(o.id)} />
            </div>
        )},
    ], [removeObra]);

    return (
        <DashboardLayout menuItems={menuItems} userRole={userRole}>
            <div style={styles.pageHeader}>
                <h1 style={styles.pageTitle}>Gerenciamento de Obras</h1>
                <Button title="Nova Obra" variant="primary" onClick={handleNew} />
            </div>

            <Card style={styles.listCardContainer}>
                {loading ? (
                    <div style={styles.centerContent}>Carregando Obras...</div>
                ) : obras.length > 0 ? (
                    <Table data={obras} columns={columns} />
                ) : (
                    <div style={styles.emptyState}>
                        <h2>Nenhuma obra cadastrada.</h2>
                        <Button title="Cadastrar Obra" onClick={handleNew} variant="accent" style={{ marginTop: 20 }} />
                    </div>
                )}
            </Card>

            {error && (
                <div style={styles.errorContainer}>
                    <p style={{ color: Colors.danger, textAlign: 'center' }}>Erro ao carregar dados: {error}</p>
                    <Button title="Tentar Novamente" onClick={fetchObras} variant="secondary" style={{ marginTop: 20 }} />
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleSave}
                title={isEditing ? `Editando Obra #${selectedObra?.id || 'Nova'}` : `Detalhes da Obra`}
            >
                {isEditing && (
                    <ObraForm obraInicial={selectedObra} onSave={handleSave} />
                )}
                {!isEditing && selectedObra && (
                    <>
                        <ObraDetailModalContent obra={selectedObra} />
                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                            <Button title="Mudar para Edição" onClick={() => handleEdit(selectedObra)} variant="secondary" />
                        </div>
                    </>
                )}
            </Modal>
        </DashboardLayout>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: '0 20px 0 0' },
    pageTitle: { fontSize: 28, color: Colors.primary, margin: 0, fontWeight: 'bold' },
    listCardContainer: { padding: 20 },
    emptyState: { padding: 50, textAlign: 'center', marginTop: 5 },
    errorContainer: { padding: 20, marginTop: 30, backgroundColor: '#fff4f4', border: `1px solid ${Colors.danger}`, borderRadius: '8px' },
    centerContent: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 100px)' },
};

const detailStyles: { [key: string]: React.CSSProperties } = {
    container: { padding: 10, maxHeight: '60vh', overflowY: 'auto' },
    title: { fontSize: 22, color: Colors.accent, marginBottom: 10, fontWeight: 'bold' },
    photosTitle: { fontSize: 16, color: Colors.primary, marginTop: 15, marginBottom: 10, borderBottom: `1px solid ${Colors.background}` },
    photosGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 },
    photo: { width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '4px' },
};

export default ObraScreen;
