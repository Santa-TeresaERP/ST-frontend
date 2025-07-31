import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/core/store/auth';
import { useState, useEffect } from 'react';
import { login } from '../actions/login';
import type { User } from '@/modules/user-creations/types/user';
import { LoginCredentials, LoginResponse } from '../types/loginactionside';

export const useAdminLogin = () => {
  const { setUser, setUserWithPermissions } = useAuthStore();

  const mutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: login,
    onSuccess: (data) => {
      console.log('🔥 RESPUESTA COMPLETA DEL LOGIN:', data);
      
      // Guardar usuario básico (para compatibilidad)
      setUser(data.user as User);
      
      // 🔥 GUARDAR USUARIO CON PERMISOS COMPLETOS (estructura del backend)
      setUserWithPermissions(data.user);
      
      console.log('✅ Usuario logueado con permisos:', {
        name: data.user.name,
        role: data.user.Role?.name,
        totalPermissions: data.user.Role?.Permissions?.length || 0,
        permissions: data.user.Role?.Permissions
      });
    },
  });

  return {
    loginFn: mutation.mutateAsync,
    isPending: mutation.status === 'pending'
  };
};

export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const saveToken = (token: string) => {
    localStorage.setItem('authToken', token);
    setToken(token);

  };

  const removeToken = () => {
      localStorage.removeItem("authToken");
      setToken(null);
    };
  
    return { token, saveToken, removeToken };
  } 