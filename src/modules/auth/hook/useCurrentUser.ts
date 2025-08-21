import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import api from '@/core/config/client';
import { UserWithPermissions } from '@/core/utils/permission-types';

interface CurrentUserResponse {
  success: boolean;
  data: UserWithPermissions;
}

const fetchCurrentUser = async (): Promise<UserWithPermissions> => {
  const response = await api.get<CurrentUserResponse>('/auth/me');
  return response.data.data;
};

export const useCurrentUser = () => {
  const [token, setToken] = useState<string | null>(null);

  // Verificar si hay token disponible
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    setToken(storedToken);
  }, []);

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    enabled: !!token, // 🔥 SOLO EJECUTAR SI HAY TOKEN
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1, // Solo reintentar una vez si falla
  });
};
