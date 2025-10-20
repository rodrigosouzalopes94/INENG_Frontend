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
// Importa o formulário de cadastro/edição
import ClienteForm from '../components/ui/ClientForm';


// Dados para o DrawerMenu (adaptados da sua DashboardPage)
// Assumindo que a DashboardPage é a fonte de verdade para os menuItems
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
    
    // Garante que a role seja usada para o layout e permissões
    const userRole = user?.role === 'ADMIN' ? 'ADMIN' : 'GESTOR'; 

    const handleEdit = (cliente: Cliente) => {
        setEditingCliente(cliente);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setEditingCliente(null); // Limpa o estado para indicar novo cadastro
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCliente(null);
        fetchClientes(); // Atualiza a lista após fechar o modal
    };

    // Definição das colunas da tabela
    const columns = useMemo(() => [
        { header: 'ID', accessor: 'id' as const },
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
            {/* MODIFICAÇÃO NO JSX: Envolver o Button em uma div */}
            <div style={styles.header}>
                <h1 style={styles.pageTitle}>Gerenciamento de Clientes</h1>
                
                {/* O Button agora está dentro de um wrapper para posicionamento absoluto */}
                <div style={styles.buttonWrapper}>
                    <Button title="Novo Cliente" variant="primary" onClick={handleNew} />
                </div>
            </div>

            <Card style={styles.listCardContainer}>
                {clientes.length > 0 ? (
                    // ✅ LISTAGEM: Renderiza a Tabela genérica
                    <Table data={clientes} columns={columns} />
                ) : (
                    // LÓGICA: Lista vazia -> Mostra o estado vazio e um botão de ação
                    <div style={styles.emptyState}>
                        <h2>Nenhum cliente cadastrado.</h2>
                        <p>Clique em "Novo Cliente" acima ou abaixo para iniciar o cadastro.</p>
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
                {/* Renderiza o ClienteForm e passa o cliente em edição/null */}
                <ClienteForm clienteInicial={editingCliente} onSave={handleCloseModal} />
            </Modal>
        </DashboardLayout>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    // MODIFICAÇÃO NO CSS
    header: {
        display: 'flex',
        justifyContent: 'center', // MUDADO de 'space-between'
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative', // ADICIONADO
        // 'padding' removido, pois o wrapper do botão cuidará do posicionamento
    },
    pageTitle: {
        fontSize: 28,
        color: Colors.primary,
        margin: 0,
        fontWeight: 'bold',
        whiteSpace: 'nowrap', 
        textAlign: 'center', // Mantido
    },
    // ESTILO ADICIONADO (Idêntico ao da ObraScreen)
    buttonWrapper: {
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
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