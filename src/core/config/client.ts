import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3005',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // 🔥 USAR LA CLAVE CORRECTA
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 INTERCEPTOR DE RESPUESTA PARA MANEJAR ERRORES 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si es error 401 (Unauthorized), limpiar token automáticamente
    if (error.response?.status === 401) {
      console.log('🔍 Token inválido o expirado, limpiando...');
      localStorage.removeItem('authToken');
    }
    
    return Promise.reject(error);
  }
);

export default api;
