import { useState } from 'react';
import { useSyncUserPermissions } from './useSyncUserPermissions';
import { useAuthStore } from '@/core/store/auth';
import { useModulesMap } from './useModulesMap';

/**
 * 🔥 HOOK SIMPLIFICADO PARA SINCRONIZACIÓN DE PERMISOS
 * 
 * Versión mínima que evita problemas de dependencias circulares
 * Solo proporciona funcionalidad manual de reintento
 */
export const useAutoPermissionSync = () => {
  const { user, userWithPermissions } = useAuthStore();
  const { syncPermissions } = useSyncUserPermissions();
  const { hasModuleAccess } = useModulesMap();
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);

  /**
   * Función para sincronizar permisos manualmente
   */
  const forceSync = async (): Promise<boolean> => {
    try {
      setIsAutoSyncing(true);
      console.log('🔄 🎯 Iniciando sincronización manual de permisos...');
      
      const success = await syncPermissions();
      
      if (success) {
        console.log('🔄 ✅ Sincronización completada exitosamente');
      } else {
        console.log('🔄 ❌ Sincronización falló');
      }
      
      return success;
    } catch (error) {
      console.error('🔄 ❌ Error en sincronización:', error);
      return false;
    } finally {
      setIsAutoSyncing(false);
    }
  };

  /**
   * Verificar si necesita sincronización
   */
  const needsPermissionSync = (): boolean => {
    const token = localStorage.getItem('authToken');
    if (!token || !user) return false;
    
    // Usuario sin permisos completos
    const hasIncompletePermissions = !userWithPermissions?.Role?.Permissions?.length;
    
    // Usuario con permisos pero sin acceso a módulos
    const hasPermissionsButNoAccess = Boolean(userWithPermissions?.Role?.Permissions?.length && !hasModuleAccess);
    
    return hasIncompletePermissions || hasPermissionsButNoAccess;
  };

  return {
    isAutoSyncing,
    forceSync,
    needsPermissionSync: needsPermissionSync(),
    showRetryButton: needsPermissionSync(),
    syncStatus: isAutoSyncing ? 'syncing' : 'idle'
  };
};
