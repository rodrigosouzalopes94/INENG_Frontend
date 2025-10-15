// src/models/Cliente.ts

// Tipos base definidos no seu prisma/schema.prisma
export type TipoPessoa = 'FISICA' | 'JURIDICA'; 

export interface Cliente {
  id: number; // O ID virá do backend, então não é opcional na leitura
  tipoPessoa: TipoPessoa;
  nomeOuRazao: string;
  
  // Campos Condicionais
  cpf?: string | null; 
  cnpj?: string | null;

  // Endereço e Contato (simplificado)
  cep: string;
  enderecoCompleto: string;
}

// Payload de Criação e Atualização (exclui o ID)
export type ClientePayload = Omit<Cliente, 'id'>

// Payload de Criação e Atualização (Com CPF/CNPJ opcional para o TS)
export interface ClienteForm extends Omit<Cliente, 'id' | 'cpf' | 'cnpj'> {
    cpf?: string; 
    cnpj?: string;
}