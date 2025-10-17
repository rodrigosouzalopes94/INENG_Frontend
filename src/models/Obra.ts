// src/models/Obra.ts

export type TipoObra = 'CONSTRUCAO' | 'REFORMA';

// Tipagem para a Foto (retorno do backend)
export interface Foto {
    id: number;
    url: string; // Ex: /uploads/12345.jpg
    obraId: number;
}

// Payload que o formulário envia (campos de texto)
export interface ObraPayload {
    nomeObra: string;
    tipoObra: TipoObra;
    descricao?: string; // Obrigatório se REFORMA
    enderecoCompleto: string;
    dataInicio: string; // ISO Date String (YYYY-MM-DD)
    previsaoEntrega: string; // ISO Date String
    cno?: string; // Obrigatório se CONSTRUCAO
    clienteId: number; // ID do Cliente selecionado
}

// O objeto Obra retornado pelo Backend
export interface Obra extends ObraPayload {
    id: number;
    fotos?: Foto[];
    cliente?: { nomeOuRazao: string };
    createdById: number;
    createdAt: string; 
}

// Tipagem para o estado do formulário (inclui o FileList para o Input)
export interface ObraFormData extends ObraPayload {
    // Lista de arquivos para upload
    fotos: FileList | null; 
}