// src/utils/formatters.ts

/**
 * Aplica a máscara de CPF (XXX.XXX.XXX-XX) a uma string de dígitos.
 * Limita a 11 dígitos e aplica a formatação para exibição.
 * @param cpf A string contendo números do CPF.
 * @returns O CPF formatado para exibição.
 */
export const maskCPF = (cpf: string): string => {
  if (!cpf) return '';

  // 1. Remove tudo que não for dígito e limita a 11 caracteres
  const cleanCpf = cpf.replace(/\D/g, '').substring(0, 11);

  // 2. Aplica a máscara: 123.456.789-01
  return cleanCpf
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o primeiro ponto
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o segundo ponto
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca o hífen e os dois últimos dígitos
};

// Você pode adicionar outras funções como maskCNPJ ou formatCurrency aqui futuramente.