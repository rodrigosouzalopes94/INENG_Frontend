import React, { useState } from 'react';
import { useEquipamentos } from '../hooks/useEquipamentos';
import { EquipamentoService } from '../api/EquipamentoService';
import type { Equipamento } from '../models/Equipamento';
import DashboardLayout from '../components/ui/DashboardLayout';
import Card from '../components/ui/Card';
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogPortal, DialogOverlay } from '@radix-ui/react-dialog';
import { Colors } from '../theme/colors';
import EquipamentoForm from '../components/ui/Equipamentoform';
import EquipamentoMovimentoForm from '../components/ui/EquipamentoMovimentoForm';

const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Obras', path: '/obras' },
    { label: 'Equipamentos', path: '/equipamentos' },
];

const EquipamentoPage: React.FC = () => {
    const { equipamentos, loading, error, fetchEquipamentos } = useEquipamentos();
    
    // State para o modal de Criar/Editar
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedEquipamento, setSelectedEquipamento] = useState<Equipamento | null>(null);

    // State para o modal de Movimentação
    const [isMovimentoOpen, setMovimentoOpen] = useState(false);
    const [movimentoEquipamentoId, setMovimentoEquipamentoId] = useState<number | null>(null);

    // --- Handlers do Form (Criar/Editar) ---
    const handleAddNew = () => {
        setSelectedEquipamento(null);
        setFormOpen(true);
    };

    const handleEdit = (equipamento: Equipamento) => {
        setSelectedEquipamento(equipamento);
        setFormOpen(true);
    };

    const handleFormSaved = () => {
        setFormOpen(false);
        fetchEquipamentos(); // Recarrega a lista
    };

    // --- Handlers do Movimento (Estoque) ---
    const handleMovimentar = (id: number) => {
        setMovimentoEquipamentoId(id);
        setMovimentoOpen(true);
    };

    const handleMovimentoSaved = () => {
        setMovimentoOpen(false);
        setMovimentoEquipamentoId(null);
        fetchEquipamentos(); // Recarrega a lista
    };

    // --- Handler de Delete ---
    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza? Esta ação excluirá o equipamento e todo o seu histórico.')) {
            try {
                await EquipamentoService.deleteEquipamento(id);
                fetchEquipamentos();
            } catch (err) {
                alert('Erro ao excluir equipamento.');
                console.error(err);
            }
        }
    };

    return (
        <DashboardLayout menuItems={menuItems} userRole="GESTOR">
            <header style={styles.header}>
                <h1 style={styles.pageTitle}>Equipamentos</h1>
                <div style={styles.buttonWrapper}> {/* Wrapper para centralizar o título */}
                    <button style={styles.addButton} onClick={handleAddNew}>
                        + Novo Equipamento
                    </button>
                </div>
            </header>

            {loading && <p>Carregando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={styles.cardsContainer}>
                {equipamentos.map((item) => (
                    <Card key={item.id} style={styles.card}>
                        {item.fotoUrl && (
                            <img src={item.fotoUrl} alt={item.equipamento} style={styles.cardImage} />
                        )}
                        <p style={styles.cardPatrimonio}>{item.patrimonio}</p>
                        <p style={styles.cardTitle}>{item.equipamento}</p>
                        <p style={styles.cardDetail}>Marca: {item.marca}</p>
                        <p style={styles.cardStock}>Estoque: {item.quantidade}</p>
                        
                        <div style={styles.cardActions}>
                            <button style={styles.actionButton} onClick={() => handleMovimentar(item.id)}>
                                Movimentar
                            </button>
                            <button style={styles.actionButtonGhost} onClick={() => handleEdit(item)}>
                                Editar
                            </button>
                            <button style={styles.actionButtonDanger} onClick={() => handleDelete(item.id)}>
                                Excluir
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal de Criar/Editar Equipamento */}
            <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                <DialogPortal>
                    <DialogOverlay style={styles.dialogOverlay} />
                    <DialogContent style={styles.dialogContent}>
                        <DialogTitle style={styles.dialogTitle}>
                            {selectedEquipamento ? 'Editar Equipamento' : 'Novo Equipamento'}
                        </DialogTitle>
                        <EquipamentoForm
                            equipamento={selectedEquipamento}
                            onSaved={handleFormSaved}
                            onCancel={() => setFormOpen(false)}
                        />
                        <DialogClose asChild>
                            <button style={styles.dialogClose}>X</button>
                        </DialogClose>
                    </DialogContent>
                </DialogPortal>
            </Dialog>

            {/* Modal de Movimentação de Estoque */}
            <Dialog open={isMovimentoOpen} onOpenChange={setMovimentoOpen}>
                <DialogPortal>
                    <DialogOverlay style={styles.dialogOverlay} />
                    <DialogContent style={{...styles.dialogContent, width: 450}}>
                        <DialogTitle style={styles.dialogTitle}>
                            Registrar Movimento
                        </DialogTitle>
                        {movimentoEquipamentoId && (
                            <EquipamentoMovimentoForm
                                equipamentoId={movimentoEquipamentoId}
                                onSaved={handleMovimentoSaved}
                                onCancel={() => setMovimentoOpen(false)}
                            />
                        )}
                        <DialogClose asChild>
                            <button style={styles.dialogClose}>X</button>
                        </DialogClose>
                    </DialogContent>
                </DialogPortal>
            </Dialog>

        </DashboardLayout>
    );
};

// Estilos
const styles: { [key: string]: React.CSSProperties } = {
    // --- Header (centralizado) ---
    header: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        marginBottom: 30, position: 'relative',
    },
    pageTitle: {
        fontSize: 28, color: Colors.primary, fontWeight: 'bold',
    },
    buttonWrapper: {
        position: 'absolute', right: 0, top: '50%',
        transform: 'translateY(-50%)',
    },
    addButton: {
        padding: '8px 15px', backgroundColor: Colors.accent, color: 'white',
        border: 'none', borderRadius: 6, cursor: 'pointer',
    },
    
    // --- Cards ---
    cardsContainer: {
        display: 'flex', flexWrap: 'wrap', gap: 20,
        justifyContent: 'flex-start',
    },
    card: {
        width: 280, display: 'flex', flexDirection: 'column',
        borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        backgroundColor: 'white', overflow: 'hidden', // para a imagem
    },
    cardImage: {
        width: '100%', height: 150, objectFit: 'cover',
        backgroundColor: Colors.background,
    },
    cardPatrimonio: {
        fontSize: 12, fontWeight: 'bold', color: Colors.secondary,
        margin: '10px 15px 0 15px',
    },
    cardTitle: {
        fontSize: 18, fontWeight: 'bold', color: Colors.primary,
        margin: '5px 15px 0 15px',
    },
    cardDetail: {
        fontSize: 14, color: Colors.text,
        margin: '5px 15px',
    },
    cardStock: {
        fontSize: 16, fontWeight: 'bold', color: Colors.accent,
        margin: '5px 15px 15px 15px',
    },
    cardActions: {
        display: 'flex', justifyContent: 'space-between', gap: 5,
        marginTop: 'auto', padding: 15, borderTop: `1px solid ${Colors.background}`
    },
    actionButton: {
        flex: 1, padding: '6px 10px', borderRadius: 6, border: 'none',
        backgroundColor: Colors.accent, color: 'white', cursor: 'pointer',
    },
    actionButtonGhost: {
        flex: 1, padding: '6px 10px', borderRadius: 6, border: `1px solid ${Colors.secondary}`,
        backgroundColor: 'transparent', color: Colors.secondary, cursor: 'pointer',
    },
    actionButtonDanger: {
        padding: '6px 10px', borderRadius: 6, border: 'none',
        backgroundColor: Colors.danger, color: 'white', cursor: 'pointer',
    },

    // --- Dialogs (Modal) ---
    dialogOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        position: 'fixed', inset: 0, zIndex: 40,
    },
    dialogContent: {
        width: 500, maxWidth: '95%', padding: 25, borderRadius: 10,
        backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column', gap: 15,
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', zIndex: 50,
    },
    dialogTitle: {
        fontSize: 20, fontWeight: 'bold',
        marginBottom: 15, color: Colors.primary,
    },
    dialogClose: {
        position: 'absolute', top: 10, right: 10,
        background: 'transparent', border: 'none',
        fontSize: 18, cursor: 'pointer',
    },
};

export default EquipamentoPage;