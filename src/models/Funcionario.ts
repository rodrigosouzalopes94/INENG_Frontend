// Define o Enum (espelhando o Prisma)
export enum TipoContrato {
  DIARISTA = 'DIARISTA',
  MENSALISTA = 'MENSALISTA',
  REGISTRADO = 'REGISTRADO',
}

/**
 * Interface principal do Funcionário (o que recebemos da API).
 * ATUALIZADA com os novos campos.
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
  createdAt: string;
  updatedAt: string;
  
  // --- NOVOS CAMPOS ---
  salario: number | null; // Prisma Decimal? (ou string? vou assumir number por ora)
  sindicato: string | null;
  cbo: string | null;
  fotoUrl: string | null; // URL do Vercel Blob
}

/**
 * Interface (DTO/Payload) para CRIAR ou ATUALIZAR um funcionário.
 * ATUALIZADA com os novos campos.
 */
export interface FuncionarioPayload {
  nome: string;
  rg: string;
  cpf: string;
  endereco: string;
  tipoProfissao: string;
  tipoContrato: TipoContrato;
  
  // --- NOVOS CAMPOS ---
  // Salário é enviado como string, pois vem de um <input>
  salario?: string; 
  sindicato?: string;
  cbo?: string;
  
  // O 'foto' (File) será enviado separadamente no FormData,
  // por isso não está neste payload de texto.
}