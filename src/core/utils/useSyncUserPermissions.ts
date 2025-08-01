/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useAuthStore } from '@/core/store/auth';
import { useFetchUsers } from '@/modules/user-creations/hook/useUsers';

/**
 * 🔥 HOOK PARA SINCRONIZAR PERMISOS DESPUÉS DEL LOGIN
 * Usa el endpoint de usuarios para obtener permisos completos
 */
export const useSyncUserPermissions = () => {
  const { user, setUserWithPermissions } = useAuthStore();
  const { data: users } = useFetchUsers();

  useEffect(() => {
    console.log('🔍 =================================');
    console.log('🔍 SINCRONIZACIÓN DE PERMISOS');
    console.log('🔍 =================================');
    console.log('🔍 Usuario en store:', user ? {
      id: user.id,
      name: user.name,
      email: user.email
    } : 'NO HAY USUARIO EN STORE');
    
    console.log('🔍 Lista de usuarios desde API:', users ? {
      total: users.length,
      usuarios: users.map(u => ({ id: u.id, name: u.name, role: (u as any).Role?.name }))
    } : 'NO HAY USUARIOS DESDE API');

    if (user && users) {
      // Buscar el usuario actual en la lista con permisos completos
      const currentUserWithPermissions = users.find(u => u.id === user.id);
      
      console.log('🔍 Usuario encontrado con permisos:', currentUserWithPermissions ? {
        id: currentUserWithPermissions.id,
        name: currentUserWithPermissions.name,
        role: (currentUserWithPermissions as any).Role?.name,
        roleStatus: (currentUserWithPermissions as any).Role?.status,
        totalPermissions: (currentUserWithPermissions as any).Role?.Permissions?.length || 0
      } : 'NO ENCONTRADO');
      
      if (currentUserWithPermissions) {
        // Actualizar el usuario con permisos completos
        setUserWithPermissions(currentUserWithPermissions as any);
        console.log('🔍 ✅ Usuario con permisos actualizado en el store');
      } else {
        console.log('🔍 ❌ Usuario no encontrado en la lista de usuarios');
      }
    } else {
      console.log('🔍 ⏳ Esperando usuario o lista de usuarios...');
    }
    console.log('🔍 =================================');
  }, [user, users, setUserWithPermissions]);

  return {
    isLoading: !users,
    users
  };
};
