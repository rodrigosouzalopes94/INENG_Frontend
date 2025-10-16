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

/**
 * Aplica a máscara de CNPJ (XX.XXX.XXX/XXXX-XX) a uma string de dígitos.
 * Limita a 14 dígitos e aplica a formatação para exibição.
 * @param cnpj A string contendo números do CNPJ.
 * @returns O CNPJ formatado para exibição.
 */
export const maskCNPJ = (cnpj: string): string => {
  if (!cnpj) return '';

  // 1. Remove tudo que não for dígito e limita a 14 caracteres
  const cleanCnpj = cnpj.replace(/\D/g, '').substring(0, 14);

  // 2. Aplica a máscara: XX.XXX.XXX/XXXX-XX
  return cleanCnpj
    .replace(/^(\d{2})(\d)/, '$1.$2')    // Coloca o primeiro ponto: XX.X
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // Coloca o segundo ponto: XX.XXX.X
    .replace(/\.(\d{3})(\d)/, '.$1/$2')    // Coloca a barra: XX.XXX.XXX/X
    .replace(/(\d{4})(\d)/, '$1-$2');     // Coloca o hífen final: .../XXXX-XX
};

/**
 * Aplica a máscara de CEP (XXXXX-XXX) a uma string de dígitos.
 * Limita a 8 dígitos e aplica a formatação para exibição.
 * @param cep A string contendo números do CEP.
 * @returns O CEP formatado para exibição.
 */
export const maskCEP = (cep: string): string => {
    if (!cep) return '';
    
    // 1. Remove tudo que não for dígito e limita a 8 caracteres
    const cleanCep = cep.replace(/\D/g, '').substring(0, 8);
    
    // 2. Aplica a máscara: 12345-678
    return cleanCep.replace(/(\d{5})(\d)/, '$1-$2'); 
};


// Você pode adicionar outras funções como formatCurrency aqui futuramente.