// src/components/ui/Card.tsx
import React from 'react';
import { Colors } from '../../theme/colors';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties; // <-- adiciona aqui
}

const Card: React.FC<CardProps> = ({ children, style }) => (
  <div
    style={{
      backgroundColor: Colors.white,
      borderRadius: 12,
      padding: 20,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      ...style, // <-- repassa o style recebido
    }}
  >
    {children}
  </div>
);

export default Card;
