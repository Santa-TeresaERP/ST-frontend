import { useMemo } from 'react';
import { useAuthStore } from '@/core/store/auth';
import { useModulesMap, MODULE_NAMES } from './useModulesMap';
import { Permission } from './permission-types';

/**
 * 🔥 HOOK PARA OBTENER PERMISOS DE UN MÓDULO ESPECÍFICO
 * 
 * Este hook combina:
 * 1. Los módulos dinámicos del backend (useModulesMap)
 * 2. Los permisos del usuario autenticado (useAuthStore)
 * 
 * Uso: 
 * const userPermissions = useModulePermissions('user');
 * if (userPermissions.canEdit) { ... }
 */
export const useModulePermissions = (moduleName: string) => {
  const { userWithPermissions } = useAuthStore();
  const { getModuleId, isReady } = useModulesMap();

  const modulePermissions = useMemo(() => {
    // Si no hay usuario o módulos aún no están listos
    if (!userWithPermissions?.Role?.Permissions || !isReady) {
      return {
        canRead: false,
        canWrite: false,
        canEdit: false,
        canDelete: false,
        moduleId: undefined,
        found: false,
      };
    }

    // Obtener el ID del módulo dinámicamente
    const moduleId = getModuleId(moduleName);
    
    if (!moduleId) {
      console.warn(`Módulo '${moduleName}' no encontrado en el backend`);
      return {
        canRead: false,
        canWrite: false,
        canEdit: false,
        canDelete: false,
        moduleId: undefined,
        found: false,
      };
    }

    // Buscar los permisos específicos para este módulo
    const permission = userWithPermissions.Role.Permissions.find(
      (p: Permission) => p.moduleId === moduleId
    );

    if (!permission) {
      return {
        canRead: false,
        canWrite: false,
        canEdit: false,
        canDelete: false,
        moduleId,
        found: false,
      };
    }

    return {
      canRead: permission.canRead,
      canWrite: permission.canWrite,
      canEdit: permission.canEdit,
      canDelete: permission.canDelete,
      moduleId,
      found: true,
      permission, // El objeto completo de permisos
    };
  }, [userWithPermissions, moduleName, getModuleId, isReady]);

  return {
    ...modulePermissions,
    isLoading: !isReady,
    moduleName,
  };
};

/**
 * 🔥 HOOK PARA VERIFICAR UN PERMISO ESPECÍFICO EN UN MÓDULO
 * 
 * Versión simplificada para verificaciones rápidas
 * 
 * Uso:
 * const canEditUsers = useHasModulePermission('user', 'canEdit');
 */
export const useHasModulePermission = (
  moduleName: string, 
  action: 'canRead' | 'canWrite' | 'canEdit' | 'canDelete'
) => {
  const permissions = useModulePermissions(moduleName);
  return permissions[action] && permissions.found;
};

/**
 * 🔥 HOOK PARA OBTENER TODOS LOS PERMISOS DE MÓDULOS PRINCIPALES
 * 
 * Útil para dashboards y navegación
 */
export const useAllModulePermissions = () => {
  const modules = useModulePermissions(MODULE_NAMES.MODULES);
  const users = useModulePermissions(MODULE_NAMES.USERS);
  const roles = useModulePermissions(MODULE_NAMES.ROLES);
  const inventory = useModulePermissions(MODULE_NAMES.INVENTORY);
  const production = useModulePermissions(MODULE_NAMES.PRODUCTION);

  const isLoading = modules.isLoading || users.isLoading || roles.isLoading || 
                   inventory.isLoading || production.isLoading;

  return {
    modules,
    users,
    roles,
    inventory,
    production,
    isLoading,
    
    // Helper para verificar si tiene acceso a administración
    hasAdminAccess: users.canRead || roles.canRead || modules.canRead,
    
    // Helper para verificar si tiene acceso a operaciones
    hasOperationsAccess: inventory.canRead || production.canRead,
  };
};

/**
 * 🔥 TYPE HELPERS para mejor autocompletado
 */
export type ModulePermissionAction = 'canRead' | 'canWrite' | 'canEdit' | 'canDelete';
export type ModulePermissionResult = ReturnType<typeof useModulePermissions>;
