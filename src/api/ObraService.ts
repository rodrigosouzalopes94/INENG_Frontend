// src/api/ObraService.ts

import axios from 'axios';
import type { Obra } from '../models/Obra';

// Assumindo que você tem uma função utilitária para pegar o token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            // OBS: Não definimos 'Content-Type': 'multipart/form-data' aqui. 
            // O Axios/navegador faz isso automaticamente (com o 'boundary') quando enviamos FormData.
        },
    };
};

const API_BASE_URL = 'http://localhost:3000/api';

export const ObraService = {
    /**
     * Cria uma nova obra com anexos de fotos.
     * @param formData O objeto FormData contendo os campos de texto e os arquivos (fotos).
     */
    async createObra(formData: FormData): Promise<Obra> {
        try {
            const response = await axios.post<Obra>(
                `${API_BASE_URL}/obras`,
                formData, // Envia o FormData diretamente
                getAuthHeader()
            );
            return response.data;
        } catch (error) {
            console.error("Erro ao cadastrar Obra:", error);
            // Rejeita a promessa para que o useObraForm possa capturar o erro
            return Promise.reject(error); 
        }
    },

    /**
     * Lista todas as obras (Endpoint GET /obras).
     */
    async listObras(): Promise<Obra[]> {
         try {
            const response = await axios.get<Obra[]>(
                `${API_BASE_URL}/obras`,
                getAuthHeader()
            );
            return response.data;
        } catch (error) {
            console.error("Erro ao listar Obras:", error);
            return Promise.reject(error);
        }
    },
    
    // Futuras implementações: getObraById, updateObra, deleteObra...
};