import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/core/store/auth';
import { UserWithPermissions } from '@/core/utils/permission-types';
import type { User } from '@/modules/user-creations/types/user';

/**
 * 🔥 HOOK PARA SINCRONIZAR PERMISOS DEL USUARIO
 * 
 * Útil para refrescar los permisos cuando:
 * - El usuario acaba de loguearse
 * - Se cambian permisos desde el panel de administración
 * - Se necesita verificar permisos actualizados
 * 
 * Usa directamente /auth/me en lugar de buscar en la lista de usuarios
 */
export const useSyncUserPermissions = () => {
  const { setUser, setUserWithPermissions } = useAuthStore();
  const queryClient = useQueryClient();

  const syncPermissions = useCallback(async (): Promise<boolean> => {
    try {
      // Verificar que QueryClient esté disponible
      if (!queryClient) {
        console.error('🔄 ❌ QueryClient no disponible');
        return false;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('🔄 No hay token disponible para sincronizar permisos');
        return false;
      }

      console.log('🔄 ===================================');
      console.log('🔄 SINCRONIZANDO PERMISOS DIRECTAMENTE');
      console.log('🔄 ===================================');

      // Invalidar consultas existentes
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] });

      // Obtener datos frescos directamente desde /auth/me
      const freshUserData = await queryClient.fetchQuery({
        queryKey: ['currentUser'],
        queryFn: async (): Promise<UserWithPermissions> => {
          const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3005'}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const result = await response.json();
          return result.data;
        }
      });

      console.log('🔄 ✅ Datos frescos obtenidos:', {
        name: freshUserData.name,
        role: freshUserData.Role?.name,
        totalPermissions: freshUserData.Role?.Permissions?.length || 0,
        permissionsPreview: freshUserData.Role?.Permissions?.slice(0, 3).map(p => ({
          moduleId: p.moduleId,
          canRead: p.canRead,
          canWrite: p.canWrite
        })) || []
      });

      // Crear usuario básico para compatibilidad
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

      // Actualizar el store
      setUser(userToSave);
      setUserWithPermissions(freshUserData);

      console.log('🔄 🎉 ¡Permisos sincronizados correctamente!');
      console.log('🔄 ===================================');
      return true;

    } catch (error) {
      console.error('🔄 ❌ Error sincronizando permisos:', error);
      console.log('🔄 ===================================');
      return false;
    }
  }, [setUser, setUserWithPermissions, queryClient]);

  /**
   * Hook de efecto para sincronización automática (compatible con versión anterior)
   * Se ejecuta cuando es necesario verificar permisos
   */
  const autoSyncIfNeeded = useCallback(async () => {
    if (typeof window === 'undefined') return; // Solo en el cliente
    
    const { user, userWithPermissions } = useAuthStore.getState();
    const token = localStorage.getItem('authToken');
    
    // Solo sincronizar si hay token pero los permisos están incompletos
    if (token && user && (!userWithPermissions || !userWithPermissions.Role?.Permissions?.length)) {
      console.log('🔄 🔍 Detectada necesidad de sincronización automática...');
      await syncPermissions();
    }
  }, [syncPermissions]);

  return {
    syncPermissions,
    autoSyncIfNeeded,
    /**
     * Funciones de conveniencia para casos específicos
     */
    refreshAfterLogin: syncPermissions,
    refreshAfterRoleChange: syncPermissions,
  };
};
