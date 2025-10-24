import React, { type MouseEvent } from 'react'; // Adicionado MouseEvent
import styled from 'styled-components';
import { Colors } from '../../theme/colors';

// --- Interface (SEM ALTERAÇÕES) ---
interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  // Opcional: Adicionar title aqui se quisermos que o Modal base lide com ele
  // title?: string;
}

// --- Styled Components ---

// Fundo escuro (Overlay)
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); // Fundo semi-transparente
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; // Garante que fique acima de outros conteúdos
  opacity: 1; // Para possíveis animações
  transition: opacity 0.2s ease-in-out; // Transição suave
`;

// Container do conteúdo do Modal
const ModalContainer = styled.div`
  width: 90%; // Usa porcentagem para melhor responsividade
  max-width: 500px; // Largura máxima
  background-color: ${Colors.white};
  border-radius: 10px;
  padding: 25px; // Aumenta um pouco o padding
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); // Sombra um pouco mais pronunciada
  box-sizing: border-box;
  transform: scale(1); // Para possíveis animações
  transition: transform 0.2s ease-in-out; // Transição suave
`;

// Botão de fechar (X)
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 26px; // Um pouco maior
  cursor: pointer;
  color: ${Colors.secondary}; // Cor secundária para menos destaque
  line-height: 1; // Remove altura extra da linha
  padding: 5px; // Pequeno padding para área de clique
  transition: color 0.2s;

  &:hover {
    color: ${Colors.primary}; // Escurece no hover
  }
`;

// --- Componente React ---

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  // Retorna null se não estiver aberto
  if (!isOpen) return null;

  // Função para fechar o modal apenas se clicar no overlay (não no conteúdo)
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    // Verifica se o clique foi diretamente no Overlay (e não em filhos como ModalContainer)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Usa o Overlay estilizado
    // Adiciona onClick para fechar ao clicar fora
    <Overlay onClick={handleOverlayClick}>
      {/* Usa o ModalContainer estilizado */}
      <ModalContainer>
        {/* Usa o CloseButton estilizado */}
        <CloseButton onClick={onClose}>×</CloseButton>
        {/* Renderiza o conteúdo (ex: o formulário) */}
        {children}
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;