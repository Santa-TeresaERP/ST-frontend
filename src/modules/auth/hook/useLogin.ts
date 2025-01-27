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