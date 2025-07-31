import { useMemo } from 'react';
import { useAuthStore } from '@/core/store/auth';
import { PermissionManager } from './permission-manager';

/**
 * 🔥 HOOK PRINCIPAL PARA PERMISOS
 */
export const usePermissions = () => {
  const user = useAuthStore((state) => state.userWithPermissions);
  
  const permissionManager = useMemo(() => {
    return new PermissionManager(user);
  }, [user]);

  return {
    permissionManager,
    isLoggedIn: !!user,
    isAdmin: permissionManager.isAdmin(),
    user
  };
};

/**
 * 🔥 HOOK PARA PERMISOS DE UN MÓDULO ESPECÍFICO
 */
export const useModulePermissions = (moduleId: string) => {
  const { permissionManager, isLoggedIn, isAdmin } = usePermissions();

  const permissions = useMemo(() => {
    const canView = permissionManager.canRead(moduleId);
    const canEdit = permissionManager.canEdit(moduleId);
    const canCreate = permissionManager.canWrite(moduleId);
    const canDelete = permissionManager.canDelete(moduleId);

    return {
      canView,
      canEdit,
      canCreate,
      canDelete,
    };
  }, [permissionManager, moduleId]);

  return {
    ...permissions,
    isLoggedIn,
    isAdmin,
    isLoading: false,
  };
};