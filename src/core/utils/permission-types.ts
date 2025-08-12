// 🔥 TIPOS BASADOS EN TU BACKEND REAL

/**
 * Usuario con información completa de permisos
 * Incluye el rol y sus permisos asociados
 */
export interface UserWithPermissions {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: boolean; // Usuario activo/inactivo
  Role?: {
    id: string;
    name: string; // Ej: "Admin", "Operador"
    description: string;
    status: boolean; // Rol activo/inactivo
    Permissions: Permission[]; // Array de permisos por módulo
  };
}

/**
 * Permisos específicos para un módulo
 * Define qué acciones puede realizar el usuario en cada módulo
 */
export interface Permission {
  id: string;
  moduleId: string; // ID del módulo al que aplica
  canRead: boolean;   // Ver/Leer datos
  canWrite: boolean;  // Crear nuevos registros
  canEdit: boolean;   // Modificar registros existentes
  canDelete: boolean; // Eliminar registros
  createdAt?: string;
  updatedAt?: string;
}

// 🔥 TIPO EXTENDIDO PARA EL ENDPOINT DE USUARIOS (incluye todos los campos del backend)
export interface UserFromAPI {
  id: string;
  name: string;
  phonenumber: string;
  dni: string;
  email: string;
  password: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  Role: {
    id: string;
    name: string;
    description: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    Permissions: Permission[];
  };
}

// 🔥 MAPEO DE IDs DE MÓDULOS FIJOS (DEPRECATED - usar useModulesMap)
// ⚠️  ESTOS IDs SON SOLO PARA REFERENCIA Y BACKWARD COMPATIBILITY
// ✅  USA: useModulePermissions('USERS') en lugar de MODULE_IDS.USERS
export const MODULE_IDS = {
  // Módulos principales del sistema
  MODULES: 'bdf2c753-3802-48fe-99d4-15edb48f0ae9',    // Gestión de módulos
  USERS: '6a0784a3-a601-4e59-a405-db7fc5ad1be1',      // Gestión de usuarios
  ROLES: '82b63d5f-a196-47f1-888e-ac79ec66f16f',      // Gestión de roles
  
  // Módulos de negocio
  INVENTORY: 'd91c04d0-06f8-4ed9-8276-1f620444a9e0',  // Inventario
  PRODUCTION: 'e72c52b4-8bea-4a02-a956-0aa5944eba60', // Producción
  
  // 🚧 OTROS MÓDULOS (agregar IDs reales cuando estén disponibles)
  // MUSEUM: 'museum-id-here',    // Museo
  // RENTALS: 'rentals-id-here',  // Alquileres
  // SALES: 'sales-id-here',      // Ventas
} as const;

// 🔥 HELPER para obtener nombres legibles de módulos
export const MODULE_NAMES = {
  [MODULE_IDS.MODULES]: 'modulos',
  [MODULE_IDS.USERS]: 'user',
  [MODULE_IDS.ROLES]: 'roles',
  [MODULE_IDS.INVENTORY]: 'inventario',
  [MODULE_IDS.PRODUCTION]: 'Produccion',
  
  // 🚧 Pendientes de agregar
  // [MODULE_IDS.MUSEUM]: 'museo',
  // [MODULE_IDS.RENTALS]: 'rentals',
  // [MODULE_IDS.SALES]: 'sales',
} as const;

// Resultado de verificación de permisos (para componentes que muestran feedback)
export interface PermissionResult {
  hasPermission: boolean;
  reason?: string;    // Motivo del rechazo
  module?: string;    // Módulo donde se intentó la acción
  action?: string;    // Acción que se intentó realizar
}
