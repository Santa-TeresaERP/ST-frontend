import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/core/store/auth';
import { useState, useEffect } from 'react';
import { login } from '../actions/login';
import type { User } from '@/modules/user-creations/types/user';
import { LoginCredentials, LoginResponse } from '../types/loginactionside';

export const useAdminLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.user as User);
    },
  });

  return {
    loginFn: mutation.mutateAsync,
    isPending: mutation.status === 'pending'
  };
};

export const useAuthToken = () => {
  // Inicializamos el estado con null
  const [token, setToken] = useState<string | null>(null);
  // Añadimos un estado para controlar si ya se ha cargado
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Solo ejecutamos en el cliente
    const storedToken = localStorage.getItem('authToken');
    setToken(storedToken);
    setIsLoaded(true);
  }, []);

  const saveToken = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
    setToken(null);
  };

  return { token, saveToken, removeToken, isLoaded };
};