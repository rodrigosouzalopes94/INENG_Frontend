// src/components/ui/Input.tsx
import React from 'react';
import { Colors } from '../../theme/colors';

interface InputProps {
  label: string;
  name?: string; // ✅ adicionado
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  required = false,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '15px' }}>
    <label style={{ marginBottom: '5px', fontWeight: 500, color: Colors.text }}>{label}</label>
    <input
      name={name} // ✅ repassando name
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      style={{
        padding: '10px 15px',
        borderRadius: '8px',
        border: `1px solid ${Colors.secondary}`,
        outline: 'none',
        transition: 'all 0.2s',
        width: '100%',
        boxSizing: 'border-box',
        color: Colors.text,
        backgroundColor: Colors.white,
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = Colors.accent)}
      onBlur={(e) => (e.currentTarget.style.borderColor = Colors.secondary)}
    />
  </div>
);

export default Input;
