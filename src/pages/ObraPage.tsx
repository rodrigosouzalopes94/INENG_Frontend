// src/pages/ObraScreen.tsx

import React, { useState } from 'react';
import { useClientes } from '../hooks/useClientes';
import { useObrasList } from '../hooks/useObrasList';
import { ObraService } from '../api/ObraService';
import type { Obra } from '../models/Obra';
import Card from '../components/ui/Card';
import DashboardLayout from '../components/ui/DashboardLayout';

// Imports do Radix com Portal e Overlay
import { 
    Dialog, 
    DialogContent, 
    DialogTitle, 
    DialogClose,
    DialogPortal, // Necessário para centralizar
    DialogOverlay // Fundo escuro
} from '@radix-ui/react-dialog';

import ObraForm from '../components/ui/ObraForm';
import { Colors } from '../theme/colors';

const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Obras', path: '/obras' },
    { label: 'Equipamentos', path: '/equipamentos' },
    { label: 'Funcionários', path: '/funcionarios'},
];

const ObraPage: React.FC = () => {
    const { clientes, loading: loadingClientes, error: errorClientes } = useClientes();
    const { obras, loading: loadingObras, fetchObras } = useObrasList();
    const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleAddObra = () => {
        setSelectedObra(null);
        setDialogOpen(true);
    };

    const handleEditObra = (obra: Obra) => {
        setSelectedObra(obra);
        setDialogOpen(true);
    };

    const handleDeleteObra = async (id: string | number) => {
        if (window.confirm('Tem certeza que deseja excluir esta obra? Esta ação não pode ser desfeita.')) {
            try {
                await ObraService.deleteObra(id);
                await fetchObras();
            } catch (error) {
                console.error("Erro ao excluir obra:", error);
                alert("Não foi possível excluir a obra. Tente novamente.");
            }
        }
    };

    const handleSaved = async () => {
        setDialogOpen(false);
        await fetchObras();
    };

    // Esta é a função que o botão "Cancelar" precisa chamar
    const handleClose = () => {
        setDialogOpen(false);
    };

    return (
        <DashboardLayout menuItems={menuItems} userRole="GESTOR">
            <header style={styles.header}>
                <h1 style={styles.pageTitle}>Obras</h1>
                <button style={styles.addButton} onClick={handleAddObra}>
                    + Nova Obra
                </button>
            </header>

            {(loadingObras || loadingClientes) && <p>Carregando...</p>}
            {errorClientes && <p style={{ color: 'red' }}>{errorClientes}</p>}

            <div style={styles.cardsContainer}>
                {obras.map((obra) => (
                    <Card key={obra.id} style={styles.card}>
                        <p style={styles.cardLabel}>
                            {obra.tipoObra === 'CONSTRUCAO' ? 'Construção' : 'Reforma'}
                        </p>
                        <p style={styles.cardTitle}>{obra.nomeObra}</p>
                        <p style={styles.cardDetail}>Cliente: {obra.cliente?.nomeOuRazao}</p>
                        <p style={styles.cardDetail}>Endereço: {obra.enderecoCompleto}</p>
                        
                        <div style={styles.cardActions}>
                            <button style={styles.editButton} onClick={() => handleEditObra(obra)}>
                                Editar
                            </button>
                            <button 
                                style={styles.deleteButton} 
                                onClick={() => handleDeleteObra(obra.id)}
                            >
                                Excluir
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal com Portal */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogPortal> 
                    <DialogOverlay style={styles.dialogOverlay} />
                    
                    <DialogContent style={styles.dialogContent}>
                        <DialogTitle style={styles.dialogTitle}>
                            {selectedObra ? 'Editar Obra' : 'Nova Obra'}
                        </DialogTitle>
                        <ObraForm
                            obra={selectedObra}
                            clientes={clientes}
                            onSaved={handleSaved}
                            // AJUSTE FEITO AQUI:
                            // A prop 'onCancel' foi renomeada para 'onClose'
                            // para bater com a interface do ObraForm.
                            onClose={handleClose} 
                        />
                        <DialogClose asChild>
                            <button style={styles.dialogClose}>X</button>
                        </DialogClose>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </DashboardLayout>
    );
};

// Estilos com todas as features (título centralizado e modal centralizado)
const styles: { [key: string]: React.CSSProperties } = {
    header: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 30,
        position: 'relative', 
    },
    pageTitle: {
        fontSize: 28,
        color: Colors.primary,
        fontWeight: 'bold',
    },
    addButton: {
        padding: '8px 15px',
        backgroundColor: Colors.accent,
        color: 'white',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
    },
    cardsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
        justifyContent: 'flex-start',
    },
    card: {
        width: 250,
        minHeight: 140, 
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        borderRadius: 8,
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        backgroundColor: 'white',
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.secondary,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    cardDetail: {
        fontSize: 14,
        color: Colors.text,
    },
    cardActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 'auto',
        paddingTop: 10,
    },
    editButton: {
        padding: '6px 12px',
        borderRadius: 6,
        border: 'none',
        backgroundColor: Colors.accent,
        color: 'white',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '6px 12px',
        borderRadius: 6,
        border: 'none',
        backgroundColor: '#DC3545',
        color: 'white',
        cursor: 'pointer',
    },
    // Estilo para o fundo escuro (Overlay)
    dialogOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        position: 'fixed',
        inset: 0,
        zIndex: 40,
    },
    // Estilo para o conteúdo do Modal centralizado
    dialogContent: {
        width: 500,
        maxWidth: '95%',
        padding: 25,
        borderRadius: 10,
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
        
        // Centralização com position fixed
        position: 'fixed', 
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
    },
    dialogTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: Colors.primary,
    },
    dialogClose: {
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'transparent',
        border: 'none',
        fontSize: 18,
        cursor: 'pointer',
    },
};

export default ObraPage;