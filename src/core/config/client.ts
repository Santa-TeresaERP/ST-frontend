import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3005',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 INTERCEPTOR DE RESPUESTA PARA MANEJAR ERRORES 403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si es error 403, agregar flag para manejo silencioso en componentes
    if (error.response?.status === 403) {
      error.isPermissionError = true;
    }
    return Promise.reject(error);
  }
);

export default api;
