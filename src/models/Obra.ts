// Frontend/src/models/Obra.ts

export type TipoObra = 'CONSTRUCAO' | 'REFORMA';

export interface Foto {
    id: number;
    url: string;
    obraId: number;
}

// Payload de texto do formulário
export interface ObraPayload {
    nomeObra: string;
    tipoObra: TipoObra;
    descricao?: string;
    enderecoCompleto: string;
    dataInicio: string; // YYYY-MM-DD
    previsaoEntrega: string; // YYYY-MM-DD
    cno?: string;
    clienteId: number;
    // (Não inclui 'fotos' ou 'fotosExistentes' aqui)
}

// O objeto Obra completo vindo da API
export interface Obra {
    id: number;
    nomeObra: string;
    tipoObra: TipoObra;
    descricao: string | null;
    enderecoCompleto: string;
    dataInicio: string; // ISO String (com T)
    previsaoEntrega: string; // ISO String (com T)
    cno: string | null;
    clienteId: number;
    createdById: number;
    createdAt: string;
    // Relações que vêm do 'include' do Prisma
    fotos?: Foto[];
    cliente?: { nomeOuRazao: string };
}