import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useFuncionarios } from '../hooks/useFuncionarios'; // Seu hook
import type { Funcionario, TipoContrato } from '../models/Funcionario';
import type { Column } from '../components/ui/Table'; // Importa a interface da Tabela
import DashboardLayout from '../components/ui/DashboardLayout';
import CardComponent from '../components/ui/Card'; // Renomeia Card
import Button from '../components/ui/Button'; // Importa Button refatorado
import Table from '../components/ui/Table'; // Importa Table refatorado
// Imports do Radix UI Dialog (renomeados)
import {
    Dialog,
    DialogContent as RadixDialogContent,
    DialogTitle as RadixDialogTitle,
    DialogClose,
    DialogPortal,
    DialogOverlay as RadixDialogOverlay
} from '@radix-ui/react-dialog';
import FuncionarioForm from '../components/ui/FuncionarioForm';
import { Colors } from '../theme/colors';
import { useAuthContext } from '../context/AuthContext'; // Para a role
import { maskCPF } from '../utils/formatters'; // Para exibir CPF formatado

// --- Menu Items (com tipagem correta) ---
const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Obras', path: '/obras' },
    { label: 'Equipamentos', path: '/equipamentos' },
    { label: 'Funcionários', path: '/funcionarios', allowedRoles: ['GESTOR', 'ADMIN'] as const },
];

// --- Styled Components (Reutilizados/Adaptados) ---

const LoadingMessage = styled.p`
  padding: 30px;
  text-align: center;
  color: ${Colors.secondary};
  font-style: italic;
`;

const ErrorMessage = styled.p`
  padding: 20px;
  text-align: center;
  color: ${Colors.danger};
  background-color: #fff4f4;
  border: 1px solid ${Colors.danger};
  border-radius: 8px;
  margin: 20px 0;
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  position: relative;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  color: ${Colors.primary};
  font-weight: bold;
  margin: 0;

  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

const ButtonWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  @media (max-width: 600px) {
    position: static;
    transform: none;
    width: 100%;
    margin-top: 10px;
  }
`;

const AddButton = styled(Button)`
  padding: 8px 15px;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

// Wrapper para a Tabela, usando o CardComponent como base
const TableCard = styled(CardComponent)`
  padding: 0;
  overflow: hidden; 
`;

// Container dos botões de ação dentro da tabela
const ActionCell = styled.div`
    display: flex;
    gap: 8px;
`;

// Mensagem para lista vazia
const EmptyListMessage = styled.p`
    text-align: center;
    color: ${Colors.secondary};
    padding: 30px;
    font-style: italic;
    background-color: ${Colors.white};
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin: 20px 0;
`;

// --- Estilos do Modal (DEFINIDOS APENAS UMA VEZ) ---
const DialogOverlay = styled(RadixDialogOverlay)`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  z-index: 40;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  @keyframes overlayShow { from { opacity: 0; } to { opacity: 1; } }
`;

const DialogContent = styled(RadixDialogContent)`
  background-color: white;
  border-radius: 10px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 600px; /* Um pouco maior para o form de funcionário */
  max-height: 85vh;
  padding: 25px;
  z-index: 50;
  overflow-y: auto;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  @keyframes contentShow { from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
  &:focus { outline: none; }
`;

const DialogTitle = styled(RadixDialogTitle)`
  margin: 0 0 20px 0;
  font-weight: bold;
  color: ${Colors.primary};
  font-size: 1.25em;
`;

const DialogCloseButton = styled(DialogClose)`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.6em;
  line-height: 1;
  padding: 5px;
  color: ${Colors.secondary};
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: ${Colors.primary};
  }
`;

// --- FIM DOS ESTILOS DO MODAL ---


// Formata o Enum para exibição amigável
const formatTipoContrato = (tipo: TipoContrato) => {
    switch (tipo) {
        case 'DIARISTA': return 'Diarista';
        case 'MENSALISTA': return 'Mensalista';
        case 'REGISTRADO': return 'Registrado (CLT)';
        default: return tipo;
    }
};

// --- Componente React ---

const FuncionarioPage: React.FC = () => {
    const { user } = useAuthContext();
    // O hook 'useFuncionarios' já tem a lógica de tratar 401 e setar 'error'
    const { funcionarios, loading, error, fetchFuncionarios, removeFuncionario } = useFuncionarios();

    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);

    // --- Handlers (usando useCallback) ---
    const handleAddNew = useCallback(() => {
        setSelectedFuncionario(null);
        setFormOpen(true);
    }, []);

    const handleEdit = useCallback((funcionario: Funcionario) => {
        setSelectedFuncionario(funcionario);
        setFormOpen(true);
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
            const success = await removeFuncionario(id);
            if (!success) {
                // O hook 'useFuncionarios' já deve ter setado a 'error'
                // Opcional: alert('Erro ao excluir funcionário.');
            }
        }
    }, [removeFuncionario]);

    const handleFormSaved = useCallback(() => {
        setFormOpen(false);
        // O hook 'submitFuncionario' já atualiza o estado 'funcionarios'
    }, []);

    const handleCloseModal = useCallback(() => {
        setFormOpen(false);
    }, []);

    // Define as colunas para o componente Table
    const columns = useMemo((): Column<Funcionario>[] => [
        {
            header: 'Nome',
            accessor: 'nome',
        },
        {
            header: 'CPF',
            accessor: (item) => maskCPF(item.cpf), // Formata o CPF
        },
        {
            header: 'Profissão',
            accessor: 'tipoProfissao',
        },
        {
            header: 'Contrato',
            accessor: (item) => formatTipoContrato(item.tipoContrato), // Formata o Enum
        },
        {
            header: 'Ações',
            accessor: (item) => (
                <ActionCell>
                    {/* Botões usam 'variant' e 'style' (para overrides rápidos) */}
                    <Button
                        title="Editar"
                        variant="accent"
                        onClick={() => handleEdit(item)}
                        style={{ padding: '4px 8px', fontSize: '0.8em' }}
                    />
                    <Button
                        title="Excluir"
                        variant="danger"
                        onClick={() => handleDelete(item.id)}
                        style={{ padding: '4px 8px', fontSize: '0.8em' }}
                    />
                </ActionCell>
            ),
        },
    ], [handleEdit, handleDelete]);

    return (
        <DashboardLayout menuItems={menuItems} userRole={user?.role || 'GESTOR'}>
            <Header>
                <PageTitle>Funcionários</PageTitle>
                <ButtonWrapper>
                    <AddButton variant="accent" onClick={handleAddNew}>
                        + Novo Funcionário
                    </AddButton>
                </ButtonWrapper>
            </Header>

            {loading && <LoadingMessage>Carregando funcionários...</LoadingMessage>}
            {/* O hook 'useFuncionarios' (com a lógica de 401) vai setar 'error' */}
            {error && <ErrorMessage>{error}</ErrorMessage>}

            {/* Mostra tabela SE não estiver carregando, sem erro E com funcionários */}
            {!loading && !error && funcionarios.length > 0 && (
                 <TableCard paddingSize="none"> {/* Usa o Card sem padding interno */}
                    <Table
                        data={funcionarios}
                        columns={columns}
                    />
                    {/* Mensagem de vazio já é tratada pelo componente Table internamente */}
                 </TableCard>
            )}

            {/* Mostra mensagem de vazio SE não estiver carregando, sem erro E sem funcionários */}
            {!loading && !error && funcionarios.length === 0 && (
                <EmptyListMessage>
                    Nenhum funcionário cadastrado.
                </EmptyListMessage>
            )}

            {/* Modal de Criar/Editar Funcionário */}
            <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent>
                        <DialogTitle>
                            {selectedFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
                        </DialogTitle>
                        
                        <FuncionarioForm
                            funcionarioInicial={selectedFuncionario}
                            onSave={handleFormSaved}
                            onCancel={handleCloseModal}
                        />
                         
                        <DialogCloseButton aria-label="Fechar">×</DialogCloseButton>
                    </DialogContent>
                </DialogPortal>
            </Dialog>

        </DashboardLayout>
    );
};

export default FuncionarioPage;