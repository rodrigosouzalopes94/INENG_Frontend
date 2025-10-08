import axios from 'axios';

// Acesse a variável do .env corretamente com import.meta.env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
