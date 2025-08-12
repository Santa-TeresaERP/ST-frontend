import { useMemo } from 'react';
import { useAuthStore } from '@/core/store/auth';
import { PermissionManager } from './permission-manager';

/**
 * 🔥 HOOK PRINCIPAL PARA MANEJO DE PERMISOS
 * Proporciona acceso al PermissionManager y información básica del usuario
 */
export const usePermissions = () => {
  const user = useAuthStore((state) => state.userWithPermissions);
  
  // Crear instancia del manager con el usuario actual
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
 * Retorna los 4 permisos básicos (CRUD) para un módulo
 * @param moduleId ID del módulo a verificar
 */
export const useModulePermissions = (moduleId: string) => {
  const { permissionManager, isLoggedIn, isAdmin } = usePermissions();

  // Calcular permisos específicos del módulo
  const permissions = useMemo(() => {
    const canView = permissionManager.canRead(moduleId);     // Ver/Leer
    const canEdit = permissionManager.canEdit(moduleId);     // Editar
    const canCreate = permissionManager.canWrite(moduleId);  // Crear
    const canDelete = permissionManager.canDelete(moduleId); // Eliminar

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
    isLoading: false, // No hay loading async aquí
  };
};