import React, { useState } from 'react';
import styled from 'styled-components'; // Import styled
import { useEquipamentos } from '../hooks/useEquipamentos';
import { EquipamentoService } from '../api/EquipamentoService';
import type { Equipamento } from '../models/Equipamento';
import DashboardLayout from '../components/ui/DashboardLayout';
import CardComponent from '../components/ui/Card'; // Renomeia Card
import Button from '../components/ui/Button'; // Importa Button refatorado
// Mantém imports do Radix UI Dialog e renomeia para evitar conflitos
import {
    Dialog,
    DialogContent as RadixDialogContent,
    DialogTitle as RadixDialogTitle,
    DialogClose, // Usaremos DialogCloseButton estilizado
    DialogPortal,
    DialogOverlay as RadixDialogOverlay
} from '@radix-ui/react-dialog';
import { Colors } from '../theme/colors';
// Verifica nome: Corrigido para EquipamentoForm
import EquipamentoForm from '../components/ui/Equipamentoform';
import EquipamentoMovimentoForm from '../components/ui/EquipamentoMovimentoForm';

// --- Imports e Lógica (Ajuste na tipagem de menuItems se necessário) ---
const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Obras', path: '/obras' },
    { label: 'Equipamentos', path: '/equipamentos' },
    { label: 'Funcionários', path: '/obras'},
    // { label: 'Funcionários', path: '/funcionarios', allowedRoles: ['GESTOR', 'ADMIN'] as const },
];

// --- Styled Components ---

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

// Header (Reutilizado do DashboardPage)
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

// Wrapper para o botão (Reutilizado do DashboardPage)
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

// Botão Adicionar (Usa o componente Button refatorado)
const AddButton = styled(Button)`
  padding: 8px 15px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

// Container dos Cards (Usa Grid Layout para responsividade)
const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Colunas responsivas */
  gap: 25px;
  padding-bottom: 30px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr; // Uma coluna
    gap: 20px;
  }
`;

// Estiliza o CardComponent para Equipamentos
const EquipamentoCard = styled(CardComponent)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  /* Padding base do CardComponent é usado, não precisa redefinir se for 'medium' */
`;

const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  background-color: ${Colors.background};
  display: block;
`;

// Placeholder para quando não há imagem
const ImagePlaceholder = styled.div`
    height: 180px;
    background-color: ${Colors.background};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${Colors.secondary};
    font-size: 0.9em;
    font-style: italic;
`;

// Container para o conteúdo textual do card
const CardContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1; /* Empurra ações para baixo */
`;

const CardPatrimonio = styled.p`
  font-size: 0.8em;
  font-weight: bold;
  color: ${Colors.secondary};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardTitle = styled.p`
  font-size: 1.1em;
  font-weight: bold;
  color: ${Colors.primary};
  margin: 0 0 5px 0;
`;

const CardDetail = styled.p`
  font-size: 0.9em;
  color: ${Colors.text};
  margin: 0;
`;

const CardStock = styled.p`
  font-size: 1em;
  font-weight: bold;
  color: ${Colors.accent};
  margin: 8px 0 0 0;
`;

// Container para os botões de ação
const CardActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto; /* Empurra para o final do card */
  padding: 15px;
  border-top: 1px solid ${Colors.background};
`;

// Botões de Ação
const ActionButton = styled(Button)`
  flex: 1;
  padding: 6px 8px;
  font-size: 0.85em;
  white-space: nowrap;
`;
const ActionButtonGhost = styled(ActionButton)``;
const ActionButtonDanger = styled(ActionButton)`
  flex: 0 0 auto;
`;

// Mensagem para lista vazia
const EmptyListMessage = styled.p`
    text-align: center;
    color: ${Colors.secondary};
    grid-column: 1 / -1; /* Ocupa todas as colunas do grid */
    padding: 30px;
    font-style: italic;
`;


// --- Estilos do Modal (Reutilizados) ---

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
  max-width: 500px;
  max-height: 85vh;
  padding: 25px;
  z-index: 50;
  overflow-y: auto;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  @keyframes contentShow { from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
  &:focus { outline: none; }
`;

const MovimentoDialogContent = styled(DialogContent)`
    max-width: 450px;
`;

const DialogTitle = styled(RadixDialogTitle)`
  margin: 0 0 20px 0;
  font-weight: bold;
  color: ${Colors.primary};
  font-size: 1.25em;
`;

const DialogCloseButton = styled(DialogClose)` // Agora estiliza DialogClose diretamente
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

// --- Componente React ---

const EquipamentoPage: React.FC = () => {
    const { equipamentos, loading, error, fetchEquipamentos } = useEquipamentos();
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedEquipamento, setSelectedEquipamento] = useState<Equipamento | null>(null);
    const [isMovimentoOpen, setMovimentoOpen] = useState(false);
    const [movimentoEquipamentoId, setMovimentoEquipamentoId] = useState<number | null>(null);

    // --- Handlers (Lógica SEM ALTERAÇÕES) ---
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
        fetchEquipamentos();
    };
    const handleMovimentar = (id: number) => {
        setMovimentoEquipamentoId(id);
        setMovimentoOpen(true);
    };
    const handleMovimentoSaved = () => {
        setMovimentoOpen(false);
        setMovimentoEquipamentoId(null);
        fetchEquipamentos();
    };
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

    // --- JSX com Styled Components ---
    return (
        <DashboardLayout menuItems={menuItems} userRole="GESTOR">
            <Header>
                <PageTitle>Equipamentos</PageTitle>
                <ButtonWrapper>
                    <AddButton variant="accent" onClick={handleAddNew}>
                        + Novo Equipamento
                    </AddButton>
                </ButtonWrapper>
            </Header>

            {loading && <LoadingMessage>Carregando...</LoadingMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}

            {/* Renderiza condicionalmente o container ou a mensagem de vazio */}
            {!loading && !error && equipamentos.length === 0 && (
                <EmptyListMessage>Nenhum equipamento cadastrado.</EmptyListMessage>
            )}

            {!loading && !error && equipamentos.length > 0 && (
                <CardsContainer>
                    {equipamentos.map((item) => (
                        <EquipamentoCard key={item.id} paddingSize="small"> {/* Exemplo: Usando padding menor */}
                            {item.fotoUrl ? (
                                <CardImage src={item.fotoUrl} alt={item.equipamento} />
                            ) : (
                                <ImagePlaceholder>Sem Imagem</ImagePlaceholder> // Usa placeholder estilizado
                            )}
                            <CardContent>
                                <CardPatrimonio>{item.patrimonio}</CardPatrimonio>
                                <CardTitle>{item.equipamento}</CardTitle>
                                <CardDetail>Marca: {item.marca}</CardDetail>
                                <CardStock>Estoque: {item.quantidade}</CardStock>
                            </CardContent>
                            <CardActions>
                                <ActionButton variant="accent" onClick={() => handleMovimentar(item.id)}>
                                    Movimentar
                                </ActionButton>
                                <ActionButtonGhost variant="ghost" onClick={() => handleEdit(item)}>
                                    Editar
                                </ActionButtonGhost>
                                <ActionButtonDanger variant="danger" onClick={() => handleDelete(item.id)}>
                                    Excluir
                                </ActionButtonDanger>
                            </CardActions>
                        </EquipamentoCard>
                    ))}
                </CardsContainer>
            )}


            {/* Modal de Criar/Editar Equipamento */}
            <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent>
                        <DialogTitle>
                            {selectedEquipamento ? 'Editar Equipamento' : 'Novo Equipamento'}
                        </DialogTitle>
                        {/* Assume que EquipamentoForm foi refatorado */}
                        <EquipamentoForm
                            equipamento={selectedEquipamento}
                            onSaved={handleFormSaved}
                            onCancel={() => setFormOpen(false)}
                        />
                         {/* Usa DialogCloseButton estilizado */}
                         {/* O 'X' agora vem do próprio botão estilizado */}
                        <DialogCloseButton aria-label="Fechar">×</DialogCloseButton>
                    </DialogContent>
                </DialogPortal>
            </Dialog>

            {/* Modal de Movimentação de Estoque */}
            <Dialog open={isMovimentoOpen} onOpenChange={setMovimentoOpen}>
                <DialogPortal>
                    <DialogOverlay />
                    <MovimentoDialogContent>
                        <DialogTitle>
                            Registrar Movimento
                        </DialogTitle>
                         {/* Assume que EquipamentoMovimentoForm foi refatorado */}
                        {movimentoEquipamentoId && (
                            <EquipamentoMovimentoForm
                                equipamentoId={movimentoEquipamentoId}
                                onSaved={handleMovimentoSaved}
                                onCancel={() => setMovimentoOpen(false)}
                            />
                        )}
                        <DialogCloseButton aria-label="Fechar">×</DialogCloseButton>
                    </MovimentoDialogContent>
                </DialogPortal>
            </Dialog>

        </DashboardLayout>
    );
};

export default EquipamentoPage;