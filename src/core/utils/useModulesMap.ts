import { useMemo } from 'react';
import { useFetchModules } from '@/modules/modules/hook/useModules';
import { useAuthStore } from '@/core/store/auth';
import { Permission } from '@/core/utils/permission-types';

/**
 * 🔥 HOOK PARA OBTENER MAPEO DINÁMICO DE MÓDULOS
 * 
 * Este hook obtiene todos los módulos del backend y crea un mapa
 * de nombres de módulos a sus IDs correspondientes.
 * 
 * Esto elimina la necesidad de hardcodear UUIDs en permission-types.ts
 * y verifica permisos ANTES de hacer peticiones HTTP.
 */
export const useModulesMap = () => {
  const { data: modules, isLoading, error } = useFetchModules();
  const { userWithPermissions } = useAuthStore();

  // 🔥 VERIFICAR SI EL USUARIO TIENE ACCESO BÁSICO A MÓDULOS
  const hasModuleAccess = useMemo(() => {
    // Si no hay usuario, no hay acceso
    if (!userWithPermissions?.Role?.Permissions) {
      return false;
    }
    
    // Verificar si tiene al menos un permiso de lectura
    const hasAnyReadPermission = userWithPermissions.Role.Permissions.some(
      permission => permission.canRead === true
    );
    
    return hasAnyReadPermission;
  }, [userWithPermissions]);
  
  // Crear mapas de nombre → ID y ID → nombre
  const modulesMap = useMemo(() => {
    if (!modules || !hasModuleAccess) return {};
    
    return modules.reduce((acc, module) => {
      acc[module.name] = module.id;
      return acc;
    }, {} as Record<string, string>);
  }, [modules, hasModuleAccess]);

  const modulesByIdMap = useMemo(() => {
    if (!modules || !hasModuleAccess) return {};
    
    return modules.reduce((acc, module) => {
      acc[module.id] = module.name;
      return acc;
    }, {} as Record<string, string>);
  }, [modules, hasModuleAccess]);

  /**
   * Obtener ID de un módulo por su nombre
   */
  const getModuleId = (moduleName: string): string | undefined => {
    return modulesMap[moduleName];
  };

  /**
   * Obtener nombre de un módulo por su ID
   */
  const getModuleName = (moduleId: string): string | undefined => {
    return modulesByIdMap[moduleId];
  };

  /**
   * Verificar si un módulo existe por nombre
   */
  const moduleExists = (moduleName: string): boolean => {
    return moduleName in modulesMap;
  };

  /**
   * Obtener todos los nombres de módulos disponibles
   */
  const getAvailableModules = (): string[] => {
    return Object.keys(modulesMap);
  };

  return {
    modules: hasModuleAccess ? modules : [],
    modulesMap,
    modulesByIdMap,
    getModuleId,
    getModuleName,
    moduleExists,
    getAvailableModules,
    isLoading: hasModuleAccess ? isLoading : false,
    error: hasModuleAccess ? error : null,
    hasModuleAccess, // 🔥 Nuevo: indica si el usuario puede acceder a módulos
    // Para backward compatibility con código existente
    isReady: hasModuleAccess && !isLoading && !error && modules !== undefined,
  };
};

/**
 * 🔥 CONSTANTES DE NOMBRES DE MÓDULOS (LUGAR CENTRALIZADO)
 * 
 * ⚠️ IMPORTANTE: Este es el ÚNICO lugar donde se definen MODULE_NAMES
 * No duplicar en otros archivos - importar desde aquí
 * 
 * Estos nombres deben coincidir EXACTAMENTE con los nombres
 * en tu backend (el array de módulos que me mostraste)
 */
export const MODULE_NAMES = {
  MODULES: 'modulos',
  USERS: 'user', 
  ROLES: 'roles',
  INVENTORY: 'inventario',
  PRODUCTION: 'Produccion',
  SALES: 'Ventas', // 🔥 HABILITADO PARA MÓDULO DE VENTAS
  MUSEUM: 'Museo', // 🔥 HABILITADO PARA MÓDULO DE MUSEO
  
  // 🚧 Futuros módulos - agregar según vayas creando en backend
  // RENTALS: 'alquileres', 
  // FINANZAS: 'finanzas',
} as const;

/**
 * 🔥 TYPE HELPERS para autocompletado
 */
export type ModuleName = typeof MODULE_NAMES[keyof typeof MODULE_NAMES];

/**
 * 🔥 HOOK PARA VERIFICAR PERMISOS DE UN MÓDULO ESPECÍFICO
 * 
 * Uso: const { hasPermission, moduleId } = useModulePermission('user', 'canEdit');
 */
export const useModulePermission = (
  moduleName: string, 
  permission: 'canRead' | 'canWrite' | 'canEdit' | 'canDelete'
) => {
  const { getModuleId, isReady, hasModuleAccess } = useModulesMap();
  const userWithPermissions = useAuthStore((state) => state.userWithPermissions);
  
  const moduleId = getModuleId(moduleName);
  
  // Verificar permisos
  const hasPermission = useMemo(() => {
    // 🔥 SI NO HAY ACCESO A MÓDULOS, DEVOLVER FALSE INMEDIATAMENTE
    if (!hasModuleAccess) {
      return false;
    }
    
    if (!moduleId || !userWithPermissions?.Role?.Permissions) {
      return false;
    }
    
    // Buscar el permiso específico para este módulo
    const modulePermission = userWithPermissions.Role.Permissions.find(
      (perm: Permission) => perm.moduleId === moduleId
    );
    
    if (!modulePermission) {
      return false;
    }
    
    return modulePermission[permission] === true;
  }, [moduleId, userWithPermissions, permission, hasModuleAccess]);
  
  return {
    hasPermission,
    moduleId: hasModuleAccess ? moduleId : undefined,
    isLoading: hasModuleAccess ? !isReady : false,
    moduleName,
    hasModuleAccess, // 🔥 Nuevo: reemplaza is403Error
  };
};
