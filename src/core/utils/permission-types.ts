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

// 🔥 SISTEMA DINÁMICO DE MÓDULOS
// Los IDs se obtienen automáticamente del backend usando useModulesMap()
// No más UUIDs hardcodeados - todo es dinámico 🚀

// 🔥 NOMBRES DE MÓDULOS DEL BACKEND (exactos)
// ✅ Usar estos nombres con useModulesMap().getModuleId(MODULE_NAMES.USERS)
export const MODULE_NAMES = {
  // Nombres exactos del backend (deben coincidir con tu createModules)
  MODULES: 'modulos',      // Gestión de módulos
  USERS: 'user',           // Gestión de usuarios  
  ROLES: 'roles',          // Gestión de roles
  INVENTORY: 'inventario', // Inventario
  PRODUCTION: 'Produccion', // Producción (nota la mayúscula)
  
  // 🚧 Futuros módulos - agregar según backend
  // MUSEUM: 'museo',
  // RENTALS: 'alquileres', 
  // SALES: 'ventas',
  // FINANZAS: 'finanzas',
} as const;

// Resultado de verificación de permisos (para componentes que muestran feedback)
export interface PermissionResult {
  hasPermission: boolean;
  reason?: string;    // Motivo del rechazo
  module?: string;    // Módulo donde se intentó la acción
  action?: string;    // Acción que se intentó realizar
}
