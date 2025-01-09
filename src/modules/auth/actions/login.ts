// src/modules/auth/actions/login.ts
import axios from 'axios';
import api from '@/core/config/client';
import { LoginCredentials, LoginResponse } from '../types/loginactionside';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', credentials);

    const { token } = response.data;
    
    localStorage.setItem('token', token);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data.message || 'Error de autenticación';
      console.error('Error en la solicitud:', error);
      throw new Error(errorMessage);
    }
    console.error('Error interno del servidor:', error);
    throw new Error('Error interno del servidor');
  }
};

