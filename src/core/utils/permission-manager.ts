import { UserWithPermissions, Permission } from './permission-types';

/**
 * 🔥 ADMINISTRADOR DE PERMISOS
 * Clase principal que maneja la lógica de verificación de permisos
 * Funciona con el sistema de roles y permisos del backend
 */
export class PermissionManager {
  private user: UserWithPermissions | null = null;

  constructor(user?: UserWithPermissions | null) {
    this.user = user || null;
  }

  // Actualizar el usuario actual
  setUser(user: UserWithPermissions | null) {
    this.user = user;
  }

  /**
   * Verifica si el usuario es Admin
   * Los Admin tienen acceso completo a todo el sistema
   */
  isAdmin(): boolean {
    return this.user?.Role?.name === 'Admin';
  }

  /**
   * Busca el permiso específico para un módulo
   * @param moduleId ID del módulo a verificar
   * @returns Permiso encontrado o null
   */
  private getPermissionForModule(moduleId: string): Permission | null {
    if (!this.user?.Role?.Permissions) return null;
    
    return this.user.Role.Permissions.find(p => p.moduleId === moduleId) || null;
  }

  /**
   * Verificar permiso de LECTURA (ver datos)
   * @param moduleId ID del módulo
   * @returns true si puede leer
   */
  canRead(moduleId: string): boolean {
    if (!this.user || !this.user.status) return false; // Usuario inactivo
    if (this.isAdmin()) return true; // Admin puede todo
    
    const permission = this.getPermissionForModule(moduleId);
    return permission?.canRead || false;
  }

  /**
   * Verificar permiso de EDICIÓN (modificar datos existentes)
   * @param moduleId ID del módulo
   * @returns true si puede editar
   */
  canEdit(moduleId: string): boolean {
    if (!this.user || !this.user.status) return false;
    if (this.isAdmin()) return true;
    
    const permission = this.getPermissionForModule(moduleId);
    return permission?.canEdit || false;
  }

  /**
   * Verificar permiso de ESCRITURA (crear nuevos datos)
   * @param moduleId ID del módulo
   * @returns true si puede crear
   */
  canWrite(moduleId: string): boolean {
    if (!this.user || !this.user.status) return false;
    if (this.isAdmin()) return true;
    
    const permission = this.getPermissionForModule(moduleId);
    return permission?.canWrite || false;
  }

  /**
   * Verificar permiso de ELIMINACIÓN
   * @param moduleId ID del módulo
   * @returns true si puede eliminar
   */
  canDelete(moduleId: string): boolean {
    if (!this.user || !this.user.status) return false;
    if (this.isAdmin()) return true;
    
    const permission = this.getPermissionForModule(moduleId);
    return permission?.canDelete || false;
  }
}

/**
 * Instancia global del administrador de permisos
 */
export const permissionManager = new PermissionManager();
