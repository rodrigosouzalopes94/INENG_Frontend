import React, { useState } from 'react';
import styled from 'styled-components'; // Import styled
import { useClientes } from '../hooks/useClientes'; // Hook de clientes
import { useObrasList } from '../hooks/useObrasList'; // Hook de Obras
import { ObraService } from '../api/ObraService';
import type { Obra } from '../models/Obra';
import CardComponent from '../components/ui/Card'; // Renomeia Card
import Button from '../components/ui/Button'; // Importa Button refatorado
import DashboardLayout from '../components/ui/DashboardLayout';
// Mantém imports do Radix UI Dialog e renomeia
import {
    Dialog,
    DialogContent as RadixDialogContent,
    DialogTitle as RadixDialogTitle,
    DialogClose,
    DialogPortal,
    DialogOverlay as RadixDialogOverlay
} from '@radix-ui/react-dialog';
// Assume que ObraForm já foi refatorado ou usa componentes refatorados
import ObraForm from '../components/ui/ObraForm';
import { Colors } from '../theme/colors';

// --- Imports e Lógica (Ajuste na tipagem de menuItems se necessário) ---
const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Obras', path: '/obras' },
    { label: 'Equipamentos', path: '/equipamentos' },
    { label: 'Funcionários', path: '/funcionarios', allowedRoles: ['GESTOR', 'ADMIN'] as const }, // Exemplo com roles
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

// Header (Reutilizado)
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

// Wrapper para o botão (Reutilizado)
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

// Container dos Cards (Usa Grid Layout)
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

// Estiliza o CardComponent para Obras
// Passa 'highlight' para o componente base
const ObraCard = styled(CardComponent)`
  display: flex;
  flex-direction: column;
  /* Padding base ('medium' por padrão) já vem do CardComponent */
`;

// Container para o conteúdo textual do card (interno)
const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px; /* Espaço entre textos */
  flex-grow: 1; /* Empurra ações para baixo */
  /* Padding já vem do CardComponent base, não precisa aqui a menos que queira sobrescrever */
`;


const CardLabel = styled.p`
  font-size: 0.9em;
  font-weight: bold;
  color: ${Colors.secondary};
  margin: 0;
  text-transform: capitalize; // 'Construção' ou 'Reforma'
`;

const CardTitle = styled.p`
  font-size: 1.15em;
  font-weight: bold;
  color: ${Colors.primary};
  margin: 0 0 5px 0;
`;

const CardDetail = styled.p`
  font-size: 0.9em;
  color: ${Colors.text};
  margin: 0;
`;

// Container para os botões de ação (interno)
const CardActions = styled.div`
  display: flex;
  gap: 10px; /* Espaço entre botões Editar/Excluir */
  margin-top: auto; /* Empurra para o final do card */
  padding-top: 15px; /* Espaço acima dos botões */
  border-top: 1px solid ${Colors.background};
  justify-content: flex-end; /* Alinha botões à direita */
`;

// Botões de Ação
const ActionButton = styled(Button)`
  padding: 6px 12px;
  font-size: 0.85em;
`;
const EditButton = styled(ActionButton)``; // Alias para clareza
const DeleteButton = styled(ActionButton)``;

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

// --- Componente React ---

const ObraPage: React.FC = () => { // Renomeado para ObraPage
    // --- Hooks e State ---
    const { clientes, loading: loadingClientes, error: errorClientes } = useClientes();
    // Renomeia 'error' para 'obrasError' para evitar colisão
    const { obras, loading: loadingObras, error: obrasError, fetchObras } = useObrasList();
    const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // --- Handlers (Lógica SEM ALTERAÇÕES) ---
    const handleAddObra = () => {
        setSelectedObra(null);
        setDialogOpen(true);
    };
    const handleEditObra = (obra: Obra) => {
        setSelectedObra(obra);
        setDialogOpen(true);
    };
    const handleDeleteObra = async (id: number | string) => { // Aceita number ou string
        if (window.confirm('Tem certeza que deseja excluir esta obra? Esta ação não pode ser desfeita.')) {
            try {
                await ObraService.deleteObra(Number(id)); // Converte para número
                await fetchObras();
            } catch (error) { // 'error' local do catch
                console.error("Erro ao excluir obra:", error);
                alert("Não foi possível excluir a obra. Tente novamente.");
            }
        }
    };
    const handleSaved = async () => {
        setDialogOpen(false);
        await fetchObras();
    };
    const handleClose = () => {
        setDialogOpen(false);
    };

    // Determina a mensagem de erro a ser exibida
    let displayError = null;
    if (errorClientes) {
        displayError = errorClientes instanceof Error ? errorClientes.message : String(errorClientes);
    } else if (obrasError && !loadingObras) { // Usa obrasError
        displayError = obrasError instanceof Error ? obrasError.message : String(obrasError);
    }


    // --- JSX com Styled Components ---
    return (
        <DashboardLayout menuItems={menuItems} userRole="GESTOR"> {/* Assume GESTOR */}
            <Header>
                <PageTitle>Obras</PageTitle>
                <ButtonWrapper>
                    <AddButton variant="accent" onClick={handleAddObra}>
                        + Nova Obra
                    </AddButton>
                </ButtonWrapper>
            </Header>

            {(loadingObras || loadingClientes) && <LoadingMessage>Carregando...</LoadingMessage>}

            {/* Usa displayError */}
            {displayError && (
                 <ErrorMessage>{displayError}</ErrorMessage>
            )}


            {/* Usa 'obrasError' nas condicionais */}
            {!loadingObras && !obrasError && obras.length === 0 && !errorClientes && (
                <EmptyListMessage>Nenhuma obra cadastrada.</EmptyListMessage>
            )}

            {!loadingObras && !obrasError && obras.length > 0 && ( // Usa !obrasError
                <CardsContainer>
                    {obras.map((obra) => (
                        // Usa ObraCard estilizado, passando highlight
                        <ObraCard
                            key={obra.id}
                            highlight={obra.tipoObra === 'CONSTRUCAO' ? 'primary' : 'accent'}
                            paddingSize="medium" // Usa o padding padrão do Card base
                        >
                            {/* O padding agora é aplicado pelo Card base, então CardContent não precisa */}
                            <CardContent>
                                <CardLabel>
                                    {obra.tipoObra === 'CONSTRUCAO' ? 'Construção' : 'Reforma'}
                                </CardLabel>
                                <CardTitle>{obra.nomeObra}</CardTitle>
                                <CardDetail>Cliente: {obra.cliente?.nomeOuRazao || 'N/A'}</CardDetail>
                                <CardDetail>Endereço: {obra.enderecoCompleto || 'N/A'}</CardDetail>
                            </CardContent>

                            <CardActions>
                                <EditButton variant="accent" onClick={() => handleEditObra(obra)}>
                                    Editar
                                </EditButton>
                                <DeleteButton variant="danger" onClick={() => handleDeleteObra(obra.id)}>
                                    Excluir
                                </DeleteButton>
                            </CardActions>
                        </ObraCard>
                    ))}
                </CardsContainer>
            )}

            {/* Modal com Portal (Usando Dialogs Estilizados) */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent>
                        <DialogTitle>
                            {selectedObra ? 'Editar Obra' : 'Nova Obra'}
                        </DialogTitle>
                        {/* Assume que ObraForm foi refatorado */}
                        <ObraForm
                            obra={selectedObra ?? undefined} // Passa undefined se null
                            clientes={clientes || []} // Passa array vazio se clientes for undefined/null
                            onSaved={handleSaved}
                            onClose={handleClose}
                        />
                        {/* O 'X' agora vem do botão estilizado */}
                        <DialogCloseButton aria-label="Fechar">×</DialogCloseButton>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </DashboardLayout>
    );
};

export default ObraPage;