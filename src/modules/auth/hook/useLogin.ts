import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/core/store/auth';
import { useState, useEffect } from 'react';
import { login } from '../actions/login';
import type { User } from '@/modules/user-creations/types/user';
import { UserWithPermissions } from '@/core/utils/permission-types';
import { LoginCredentials, LoginResponse } from '../types/loginactionside';

export const useAdminLogin = () => {
  const { setUser, setUserWithPermissions } = useAuthStore();

  const mutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: login,
    onSuccess: (data) => {
      console.log('🔥 RESPUESTA COMPLETA DEL LOGIN:', data);
      
      // 🔥 VERIFICAR SI EL USER ES STRING O OBJETO
      let userToSave: User;
      let userWithPermissionsToSave: UserWithPermissions;
      
      if (typeof data.user === 'string') {
        // Si viene como string (nombre), crear objeto básico
        console.log('⚠️ Usuario viene como string, creando objeto básico');
        userToSave = {
          id: 'temp-id', // ID temporal hasta que se cargue desde token
          name: data.user,
          email: '',
          roleId: ''
        } as User;
        
        userWithPermissionsToSave = {
          id: 'temp-id',
          name: data.user,
          email: '',
          roleId: '',
          status: true
        } as UserWithPermissions;
      } else {
        // Si viene como objeto completo
        userToSave = data.user as User;
        userWithPermissionsToSave = data.user;
      }
      
      // Guardar usuario básico (para compatibilidad)
      setUser(userToSave);
      
      // 🔥 GUARDAR USUARIO CON PERMISOS COMPLETOS (estructura del backend)
      setUserWithPermissions(userWithPermissionsToSave);
      
      console.log('✅ Usuario logueado con permisos:', {
        name: userWithPermissionsToSave.name,
        role: userWithPermissionsToSave.Role?.name,
        totalPermissions: userWithPermissionsToSave.Role?.Permissions?.length || 0,
        permissions: userWithPermissionsToSave.Role?.Permissions
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
    const storedToken = localStorage.getItem('authToken');
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