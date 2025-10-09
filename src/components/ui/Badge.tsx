// src/components/ui/Badge.tsx
import React from 'react';
import { Colors } from '../../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

const getColor = (variant: string = 'primary') => {
  switch (variant) {
    case 'primary': return Colors.primary;
    case 'secondary': return Colors.secondary;
    case 'danger': return Colors.danger;
    default: return Colors.primary;
  }
};

const Badge: React.FC<BadgeProps> = ({ label, variant }) => {
  return (
    <span
      style={{
        padding: '4px 10px',
        borderRadius: 12,
        color: Colors.white,
        backgroundColor: getColor(variant),
        fontSize: 12,
        fontWeight: 'bold',
      }}
    >
      {label}
    </span>
  );
};

export default Badge;
