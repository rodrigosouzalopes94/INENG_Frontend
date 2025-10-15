// src/api/client.ts

import axios from 'axios';
import { AuthStorage } from '../services/AuthStorage'; 

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// O Interceptor usa o AuthStorage, que agora está configurado com a chave 'token'
api.interceptors.request.use((config) => {
  const token = AuthStorage.getToken();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;