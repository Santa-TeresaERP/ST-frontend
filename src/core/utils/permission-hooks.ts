import { useMemo } from 'react';
import { useAuthStore } from '@/core/store/auth';
import { PermissionManager } from './permission-manager';
import { useModulesMap } from './useModulesMap';
import { Permission } from './permission-types';

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
 * @param moduleName Nombre del módulo (ej: 'Produccion', 'user', etc.)
 */
export const useModulePermissions = (moduleName: string) => {
  const { getModuleId, hasModuleAccess } = useModulesMap();
  const { user, isAdmin } = usePermissions(); // 🔥 OBTENER isAdmin DEL HOOK PRINCIPAL

  // Calcular permisos específicos del módulo
  const permissions = useMemo(() => {
    // Si no hay usuario o acceso a módulos, devolver permisos en false
    if (!user || !hasModuleAccess) {
      return {
        canView: false,
        canEdit: false,
        canCreate: false,
        canDelete: false,
        isLoading: !user, // Cargando usuario vs sin acceso a módulos
      };
    }

    // 🔥 OBTENER EL UUID DEL MÓDULO POR SU NOMBRE
    const moduleId = getModuleId(moduleName);
    
    if (!moduleId || !user.Role?.Permissions) {
      return {
        canView: false,
        canEdit: false,
        canCreate: false,
        canDelete: false,
        isLoading: false,
      };
    }

    // Buscar el permiso específico para este módulo usando UUID
    const modulePermission = user.Role.Permissions.find(
      (perm: Permission) => perm.moduleId === moduleId
    );

    if (!modulePermission) {
      return {
        canView: false,
        canEdit: false,
        canCreate: false,
        canDelete: false,
        isLoading: false,
      };
    }

    // 🔥 MAPEAR PERMISOS CORRECTAMENTE
    const canView = modulePermission.canRead === true;     // Ver/Leer
    const canEdit = modulePermission.canEdit === true;     // Editar
    const canCreate = modulePermission.canWrite === true;  // Crear
    const canDelete = modulePermission.canDelete === true; // Eliminar

    return {
      canView,
      canEdit,
      canCreate,
      canDelete,
      isLoading: false,
    };
  }, [moduleName, user, getModuleId, hasModuleAccess]);

  return {
    ...permissions,
    isLoggedIn: !!user,
    isAdmin, // 🔥 USAR EL VALOR REAL DE isAdmin DEL HOOK PRINCIPAL
    hasModuleAccess, // Info adicional sobre acceso a módulos
  };
};