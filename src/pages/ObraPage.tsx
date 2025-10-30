// src/pages/ObraPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useClientes } from '../hooks/useClientes';
import { useObrasList } from '../hooks/useObrasList';
import { ObraService } from '../api/ObraService';
import type { Obra } from '../models/Obra';
import CardComponent from '../components/ui/Card';
import Button from '../components/ui/Button';
import DashboardLayout from '../components/ui/DashboardLayout';
import {
  Dialog,
  DialogContent as RadixDialogContent,
  DialogTitle as RadixDialogTitle,
  DialogClose,
  DialogPortal,
  DialogOverlay as RadixDialogOverlay
} from '@radix-ui/react-dialog';
import ObraForm from '../components/ui/ObraForm';
import { Colors } from '../theme/colors';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Clientes', path: '/clientes' },
  { label: 'Obras', path: '/obras' },
  { label: 'Equipamentos', path: '/equipamentos' },
  { label: 'Funcionários', path: '/funcionarios', allowedRoles: ['GESTOR', 'ADMIN'] as const },
];

// Styled Components
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

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  padding-bottom: 30px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ObraCard = styled(CardComponent)`
  display: flex;
  flex-direction: column;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
`;

const CardLabel = styled.p`
  font-size: 0.9em;
  font-weight: bold;
  color: ${Colors.secondary};
  margin: 0;
  text-transform: capitalize;
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

const CardActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid ${Colors.background};
  justify-content: flex-end;
`;

const ActionButton = styled(Button)`
  padding: 6px 12px;
  font-size: 0.85em;
`;
const EditButton = styled(ActionButton)``;
const DeleteButton = styled(ActionButton)``;

const EmptyListMessage = styled.p`
  text-align: center;
  color: ${Colors.secondary};
  grid-column: 1 / -1;
  padding: 30px;
  font-style: italic;
`;

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

const ObraPage: React.FC = () => {
  const { clientes, loading: loadingClientes, error: errorClientes } = useClientes();
  const { obras, loading: loadingObras, error: obrasError, fetchObras } = useObrasList();
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
  const handleDeleteObra = async (id: number | string) => {
    if (window.confirm('Tem certeza que deseja excluir esta obra? Esta ação não pode ser desfeita.')) {
      try {
        await ObraService.deleteObra(Number(id));
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
  const handleClose = () => setDialogOpen(false);

  let displayError = null;
  if (errorClientes) displayError = String(errorClientes);
  else if (obrasError && !loadingObras) displayError = String(obrasError);

  return (
    <DashboardLayout menuItems={menuItems} userRole="GESTOR">
      <Header>
        <PageTitle>Obras</PageTitle>
        <ButtonWrapper>
          <AddButton variant="accent" onClick={handleAddObra}>
            + Nova Obra
          </AddButton>
        </ButtonWrapper>
      </Header>

      {(loadingObras || loadingClientes) && <LoadingMessage>Carregando...</LoadingMessage>}
      {displayError && <ErrorMessage>{displayError}</ErrorMessage>}
      {!loadingObras && !obrasError && obras.length === 0 && !errorClientes && (
        <EmptyListMessage>Nenhuma obra cadastrada.</EmptyListMessage>
      )}

      {!loadingObras && !obrasError && obras.length > 0 && (
        <CardsContainer>
          {obras.map((obra) => (
            <ObraCard
              key={obra.id}
              highlight={obra.tipoObra === 'CONSTRUCAO' ? 'primary' : 'accent'}
              paddingSize="medium"
            >
              {obra.fotos && obra.fotos.length > 0 && (
                <img
                  src={obra.fotos[0].url}
                  alt={obra.nomeObra}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    marginBottom: '10px'
                  }}
                />
              )}
              <CardContent>
                <CardLabel>{obra.tipoObra === 'CONSTRUCAO' ? 'Construção' : 'Reforma'}</CardLabel>
                <CardTitle>{obra.nomeObra}</CardTitle>
                <CardDetail>Cliente: {obra.cliente?.nomeOuRazao || 'N/A'}</CardDetail>
                <CardDetail>Endereço: {obra.enderecoCompleto || 'N/A'}</CardDetail>
              </CardContent>
              <CardActions>
                <EditButton variant="accent" onClick={() => handleEditObra(obra)}>Editar</EditButton>
                <DeleteButton variant="danger" onClick={() => handleDeleteObra(obra.id)}>Excluir</DeleteButton>
              </CardActions>
            </ObraCard>
          ))}
        </CardsContainer>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogTitle>{selectedObra ? 'Editar Obra' : 'Nova Obra'}</DialogTitle>
            <ObraForm
              obra={selectedObra ?? undefined}
              clientes={clientes || []}
              onSaved={handleSaved}
              onClose={handleClose}
            />
            <DialogCloseButton aria-label="Fechar">×</DialogCloseButton>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </DashboardLayout>
  );
};

export default ObraPage;
