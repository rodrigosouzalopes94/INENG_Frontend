// Define os tipos de movimento, espelhando o Enum do Prisma
export enum TipoMovimento {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
}

// Define o modelo do histórico de movimento
export interface MovimentoEquipamento {
  id: number;
  tipo: TipoMovimento;
  quantidade: number;
  motivo: string | null;
  data: string; // Datas do Prisma vêm como string ISO
  equipamentoId: number;
}

// Define o modelo principal do Equipamento
export interface Equipamento {
  id: number;
  patrimonio: string;
  equipamento: string;
  nf: string;
  marca: string;
  fotoUrl: string | null;
  quantidade: number; // O estoque atual
  createdAt: string;
  updatedAt: string;

  // Opcional: pode ser incluído ao buscar por ID
  movimentos?: MovimentoEquipamento[];
}