// Define o Enum (espelhando o Prisma)
export enum TipoContrato {
  DIARISTA = 'DIARISTA',
  MENSALISTA = 'MENSALISTA',
  REGISTRADO = 'REGISTRADO',
}

/**
 * Interface principal do Funcionário (o que recebemos da API).
 */
export interface Funcionario {
  id: number;
  nome: string;
  rg: string;
  cpf: string;
  endereco: string;
  tipoProfissao: string;
  tipoContrato: TipoContrato;
  createdById: number;
  createdAt: string; // Prisma envia datas como string ISO
  updatedAt: string;
}

/**
 * Interface (DTO/Payload) para CRIAR ou ATUALIZAR um funcionário.
 * (O que o frontend envia para a API).
 */
export interface FuncionarioPayload {
  nome: string;
  rg: string;
  cpf: string; // Enviamos como string (com ou sem máscara, o backend limpa)
  endereco: string;
  tipoProfissao: string;
  tipoContrato: TipoContrato;
  // 'createdById' não é enviado, pois o backend pega do token JWT
}