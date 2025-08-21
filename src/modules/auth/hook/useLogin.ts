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
    onSuccess: async (data) => {
      console.log('🔥 RESPUESTA COMPLETA DEL LOGIN:', data);
      
      // 🔥 PASO 1: GUARDAR TOKEN INMEDIATAMENTE
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        console.log('✅ Token guardado en localStorage');
      }
      
      try {
        // 🔥 PASO 2: OBTENER DATOS FRESCOS DIRECTAMENTE (sin React Query para evitar conflictos)
        console.log('🔄 Obteniendo permisos frescos después del login...');
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3005'}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${data.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          const freshUserData = result.data;
          
          console.log('✅ Datos frescos obtenidos:', {
            name: freshUserData.name,
            role: freshUserData.Role?.name,
            totalPermissions: freshUserData.Role?.Permissions?.length || 0
          });
          
          // 🔥 PASO 3: Crear usuario básico para compatibilidad
          const extendedUserData = freshUserData as UserWithPermissions & { 
            dni?: string; 
            phonenumber?: string; 
          };
          
          const userToSave: User = {
            id: freshUserData.id,
            name: freshUserData.name,
            email: freshUserData.email,
            roleId: freshUserData.roleId,
            dni: extendedUserData.dni || '',
            phonenumber: extendedUserData.phonenumber || '',
            password: '',
            status: freshUserData.status
          };
          
          // 🔥 PASO 4: Guardar en el store
          setUser(userToSave);
          setUserWithPermissions(freshUserData);
          
          console.log('🎉 ¡LOGIN COMPLETO CON PERMISOS SINCRONIZADOS!');
          return;
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        
      } catch (error) {
        console.error('❌ Error obteniendo datos frescos, usando datos del login como fallback:', error);
        
        // 🔥 FALLBACK: usar los datos del login como respaldo
        let userToSave: User;
        let userWithPermissionsToSave: UserWithPermissions;
        
        if (typeof data.user === 'string') {
          console.log('⚠️ Usuario viene como string, creando objeto básico');
          userToSave = {
            id: 'temp-id',
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
          userToSave = data.user as User;
          userWithPermissionsToSave = data.user;
        }
        
        setUser(userToSave);
        setUserWithPermissions(userWithPermissionsToSave);
        
        console.log('⚠️ Login completado con datos de fallback');
      }
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