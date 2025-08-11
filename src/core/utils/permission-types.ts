// 🔥 TIPOS BASADOS EN TU BACKEND REAL
export interface UserWithPermissions {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: boolean;
  Role?: {
    id: string;
    name: string;
    description: string;
    status: boolean;
    Permissions: Permission[];
  };
}

export interface Permission {
  id: string;
  moduleId: string;
  canRead: boolean;
  canWrite: boolean;
  canEdit: boolean;  // ← Volver a canEdit para coincidir con el backend
  canDelete: boolean;
  createdAt?: string;  // ← Agregado opcional
  updatedAt?: string;  // ← Agregado opcional
}

// 🔥 TIPO EXTENDIDO PARA EL ENDPOINT DE USUARIOS (incluye todos los campos)
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

// 🔥 MAPEO DE IDs DE MÓDULOS FIJOS (según tu backend)
export const MODULE_IDS = {
  // 🔥 MÓDULOS ACTIVOS CON IDs REALES DEL BACKEND (ACTUALIZADOS 2025-08-11)
  MODULES: 'bdf2c753-3802-48fe-99d4-15edb48f0ae9',    // "modulos" ✅ ID REAL DEL BACKEND
  USERS: '6a0784a3-a601-4e59-a405-db7fc5ad1be1',      // "user" ✅ ID REAL DEL BACKEND
  ROLES: '82b63d5f-a196-47f1-888e-ac79ec66f16f',      // "roles" ✅ ID REAL DEL BACKEND
  
  // 🚧 OTROS MÓDULOS DEL BACKEND
  INVENTORY: 'd91c04d0-06f8-4ed9-8276-1f620444a9e0',  // "inventario"
  PRODUCTION: 'e72c52b4-8bea-4a02-a956-0aa5944eba60', // "Produccion"
  
  // 🚧 COMENTADOS TEMPORALMENTE PARA TESTING
  // MUSEUM: 'museum-id-here',                            // "museo" - reemplaza con el ID real
  // RENTALS: 'rentals-id-here',                          // "rentals" - reemplaza con el ID real
  // SALES: 'sales-id-here',                              // "sales" - reemplaza con el ID real
} as const;

// 🔥 HELPER para obtener nombres de módulos
export const MODULE_NAMES = {
  [MODULE_IDS.MODULES]: 'modulos',
  [MODULE_IDS.USERS]: 'user',
  [MODULE_IDS.ROLES]: 'roles',
  [MODULE_IDS.INVENTORY]: 'inventario',
  [MODULE_IDS.PRODUCTION]: 'Produccion',
  
  // 🚧 COMENTADOS TEMPORALMENTE PARA TESTING
  // [MODULE_IDS.MUSEUM]: 'museo',
  // [MODULE_IDS.RENTALS]: 'rentals',
  // [MODULE_IDS.SALES]: 'sales',
} as const;

// Resultado de verificación de permisos
export interface PermissionResult {
  hasPermission: boolean;
  reason?: string;
  module?: string;
  action?: string;
}
