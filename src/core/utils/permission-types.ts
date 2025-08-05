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
  // 🔥 SOLO MÓDULOS PARA TESTING - otros comentados temporalmente
  MODULES: '631d7c73-5c82-4a02-bd9a-24751b1ee4f3',    // "modulos" ✅ ACTIVO PARA PRUEBAS
  
  // 🚧 COMENTADOS TEMPORALMENTE PARA TESTING
  // ROLES: 'ec11b23d-be86-49f3-8821-1d4d289698ef',      // "roles"  
  // INVENTORY: '604d4546-3957-4d47-a49b-3248a6e32ab5',  // "inventario"
  // USERS: '47ded0bb-ad86-4cdb-a9d2-bb6b4d95f2a7',      // "user"
  // PRODUCTION: 'e895f3df-2689-44f1-8f6b-67f1c21d7acb', // "Producción"
  // MUSEUM: 'museum-id-here',                            // "museo" - reemplaza con el ID real
  // RENTALS: 'rentals-id-here',                          // "rentals" - reemplaza con el ID real
  // SALES: 'sales-id-here',                              // "sales" - reemplaza con el ID real
} as const;

// 🔥 HELPER para obtener nombres de módulos
export const MODULE_NAMES = {
  [MODULE_IDS.MODULES]: 'modulos',
  
  // 🚧 COMENTADOS TEMPORALMENTE PARA TESTING
  // [MODULE_IDS.ROLES]: 'roles',
  // [MODULE_IDS.INVENTORY]: 'inventario',
  // [MODULE_IDS.USERS]: 'user',
  // [MODULE_IDS.PRODUCTION]: 'Producción',
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
