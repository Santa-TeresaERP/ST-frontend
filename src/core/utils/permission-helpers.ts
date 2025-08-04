import { MODULE_IDS } from './permission-types';
import { useModulePermissions } from './permission-hooks';

/**
 * 🔥 HELPERS ESPECÍFICOS PARA CADA MÓDULO
 * Uso más fácil en componentes sin recordar IDs
 */

// 🚧 SOLO ACTIVO PARA TESTING - Hook para permisos de módulos
export const useModulesPermissions = () => useModulePermissions(MODULE_IDS.MODULES);

// 🚧 COMENTADOS TEMPORALMENTE PARA TESTING
// Hook para permisos de usuarios
// export const useUserPermissions = () => useModulePermissions(MODULE_IDS.USERS);

// Hook para permisos de roles
// export const useRolePermissions = () => useModulePermissions(MODULE_IDS.ROLES);

// Hook para permisos de inventario
// export const useInventoryPermissions = () => useModulePermissions(MODULE_IDS.INVENTORY);

// Hook para permisos de producción
// export const useProductionPermissions = () => useModulePermissions(MODULE_IDS.PRODUCTION);

// Hook para permisos de museo
// export const useMuseumPermissions = () => useModulePermissions(MODULE_IDS.MUSEUM);

// Hook para permisos de rentals
// export const useRentalsPermissions = () => useModulePermissions(MODULE_IDS.RENTALS);

// Hook para permisos de ventas
// export const useSalesPermissions = () => useModulePermissions(MODULE_IDS.SALES);

/**
 * 🔥 HELPER PARA OBTENER PERMISOS DE MÓDULOS ESPECÍFICOS
 * Los hooks deben llamarse estáticamente, no dinámicamente
 * 🚧 SOLO ACTIVO PARA TESTING - Solo módulos
 */
export const useCommonModulePermissions = () => {
  const modulePerms = useModulesPermissions();

  return {
    modules: modulePerms,
  };
};

/**
 * 🔥 HELPER PARA VERIFICAR SI PUEDE ACCEDER A CUALQUIER MÓDULO
 * 🚧 SOLO ACTIVO PARA TESTING - Solo módulos
 */
export const useCanAccessAnyModule = () => {
  const modulePerms = useModulesPermissions();

  const canAccessAny = modulePerms.canView;

  return {
    canAccessAny,
    moduleAccess: {
      modules: modulePerms.canView,
    }
  };
};

// 🚧 COMENTADOS TEMPORALMENTE PARA TESTING
/*
export const useCommonModulePermissions = () => {
  const userPerms = useUserPermissions();
  const rolePerms = useRolePermissions();
  const inventoryPerms = useInventoryPermissions();
  const productionPerms = useProductionPermissions();
  const modulePerms = useModulesPermissions();

  return {
    users: userPerms,
    roles: rolePerms,
    inventory: inventoryPerms,
    production: productionPerms,
    modules: modulePerms,
  };
};

export const useCanAccessAnyModule = () => {
  const userPerms = useUserPermissions();
  const rolePerms = useRolePermissions();
  const inventoryPerms = useInventoryPermissions();
  const productionPerms = useProductionPermissions();
  const modulePerms = useModulesPermissions();
  const museumPerms = useMuseumPermissions();
  const rentalsPerms = useRentalsPermissions();
  const salesPerms = useSalesPermissions();

  const canAccessAny = 
    userPerms.canView || 
    rolePerms.canView || 
    inventoryPerms.canView || 
    productionPerms.canView || 
    modulePerms.canView ||
    museumPerms.canView ||
    rentalsPerms.canView ||
    salesPerms.canView;

  return {
    canAccessAny,
    moduleAccess: {
      users: userPerms.canView,
      roles: rolePerms.canView,
      inventory: inventoryPerms.canView,
      production: productionPerms.canView,
      modules: modulePerms.canView,
      museum: museumPerms.canView,
      rentals: rentalsPerms.canView,
      sales: salesPerms.canView,
    }
  };
};
*/
