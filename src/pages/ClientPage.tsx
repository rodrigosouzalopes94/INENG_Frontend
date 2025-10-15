// src/pages/ClientPage.tsx

import React, { useState, useMemo } from 'react';
import { Colors } from '../theme/colors';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DashboardLayout from '../components/ui/DashboardLayout'; 
import Table from '../components/ui/Table'; 
import Modal from '../components/ui/Modal'; 
import { useClientes } from '../hooks/useClientes'; 
import { useAuthContext } from '../context/AuthContext';
import type { Cliente } from '../models/Cliente';
// Importa o formulário de forma direta
import ClienteForm from '../components/ui/ClientForm'; 


// Dados para o DrawerMenu (adaptados da sua DashboardPage)
const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' }, 
    { label: 'Obras', path: '/obras' },
    { label: 'Equipamentos', path: '/equipamentos' },
    { label: 'Funcionários', path: '/funcionarios' },
];

const ClientPage: React.FC = () => {
    // Hooks de Estado e Dados
    const { clientes, loading, error, removeCliente, fetchClientes } = useClientes();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
    const { user } = useAuthContext();
    
    const userRole = user?.role === 'ADMIN' ? 'ADMIN' : 'GESTOR'; 

    const handleEdit = (cliente: Cliente) => {
        setEditingCliente(cliente);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setEditingCliente(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCliente(null);
        fetchClientes(); // Atualiza a lista
    };

    // Definição das colunas da tabela
    const columns = useMemo(() => [
        { header: 'ID', accessor: 'id' },
        { header: 'Nome/Razão Social', accessor: 'nomeOuRazao' },
        { header: 'Tipo', accessor: 'tipoPessoa' },
        { header: 'Documento', accessor: (cliente: Cliente) => cliente.cpf || cliente.cnpj || 'N/A' },
        { header: 'CEP', accessor: 'cep' },
        { header: 'Ações', accessor: (cliente: Cliente) => (
            <div style={{ display: 'flex', gap: '8px' }}>
                <Button title="Editar" variant="ghost" onClick={() => handleEdit(cliente)} />
                <Button title="Excluir" variant="danger" onClick={() => removeCliente(cliente.id)} />
            </div>
        )},
    ], [removeCliente]);


    // 3. Renderização de Estados (Layout)
    if (loading) {
        return <DashboardLayout menuItems={menuItems} userRole={userRole}>
            <div style={styles.centerContent}>Carregando clientes...</div>
        </DashboardLayout>
    }

    if (error) {
        return <DashboardLayout menuItems={menuItems} userRole={userRole}>
            <div style={styles.errorContainer}>
                <p style={{ color: Colors.danger, textAlign: 'center' }}>Erro ao carregar dados: {error}</p>
                <Button title="Tentar Novamente" onClick={fetchClientes} variant="secondary" style={{ marginTop: 20 }} />
            </div>
        </DashboardLayout>
    }

    // 4. Renderização Principal
    return (
        <DashboardLayout menuItems={menuItems} userRole={userRole}>
            <div style={styles.header}>
                {/* Título Alinhado (Corrigido) */}
                <h1 style={styles.pageTitle}>Gerenciamento de Clientes</h1>
                <Button title="Novo Cliente" variant="primary" onClick={handleNew} />
            </div>

            {/* ✅ CORREÇÃO 1: Container de listagem (garantindo padding) */}
            <Card style={styles.listCardContainer}>
                {clientes.length > 0 ? (
                    <Table data={clientes} columns={columns} />
                ) : (
                    // LÓGICA: Lista vazia -> Mostra o estado vazio e um botão de ação
                    <div style={styles.emptyState}>
                        <h2>Nenhum cliente cadastrado.</h2>
                        <p>Clique em "Novo Cliente" para iniciar o cadastro.</p>
                        <Button 
                            title="Cadastrar Agora" 
                            onClick={() => setIsModalOpen(true)} 
                            variant="accent" 
                            style={{ marginTop: 20 }}
                        />
                    </div>
                )}
            </Card>

            {/* Modal de Cadastro/Edição */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCliente ? 'Editar Cliente' : 'Novo Cliente'}>
                {/* ✅ O formulário é renderizado sem Card, pois já está no Modal */}
                <ClienteForm clienteInicial={editingCliente} onSave={handleCloseModal} />
            </Modal>
        </DashboardLayout>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        // Adicionando um padding/margem para alinhar o título com o conteúdo, 
        // e ser responsivo
        padding: '0 20px 0 0', 
    },
    pageTitle: {
        fontSize: 28,
        color: Colors.primary,
        margin: 0,
        fontWeight: 'bold',
        whiteSpace: 'nowrap', // Garante que o título não quebre o layout
    },
    listCardContainer: {
        padding: 20,
    },
    emptyState: {
        padding: 50,
        textAlign: 'center',
        marginTop: 5,
    },
    errorContainer: {
        padding: 20,
        marginTop: 30,
        backgroundColor: '#fff4f4',
        border: `1px solid ${Colors.danger}`,
        borderRadius: '8px',
    },
    centerContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 100px)',
    }
};

export default ClientPage;