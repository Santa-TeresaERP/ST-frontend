import { UserWithPermissions, Permission } from './permission-types';

/**
 * 🔥 MANAGER SIMPLIFICADO PARA TU BACKEND
 */
export class PermissionManager {
  private user: UserWithPermissions | null = null;

  constructor(user?: UserWithPermissions | null) {
    this.user = user || null;
  }

  setUser(user: UserWithPermissions | null) {
    this.user = user;
  }

  /**
   * Verifica si el usuario es Admin (acceso total)
   */
  isAdmin(): boolean {
    return this.user?.Role?.name === 'Admin';
  }

  /**
   * Obtiene el permiso para un módulo específico
   */
  private getPermissionForModule(moduleId: string): Permission | null {
    if (!this.user?.Role?.Permissions) return null;
    
    return this.user.Role.Permissions.find(p => p.moduleId === moduleId) || null;
  }

  /**
   * Verifica si puede leer un módulo
   */
  canRead(moduleId: string): boolean {
    if (!this.user || !this.user.status) return false;
    if (this.isAdmin()) return true;
    
    const permission = this.getPermissionForModule(moduleId);
    return permission?.canRead || false;
  }

  /**
   * Verifica si puede editar un módulo
   */
  canEdit(moduleId: string): boolean {
    if (!this.user || !this.user.status) return false;
    if (this.isAdmin()) return true;
    
    const permission = this.getPermissionForModule(moduleId);
    return permission?.canEdit || false;
  }

  /**
   * Verifica si puede escribir/crear en un módulo
   */
  canWrite(moduleId: string): boolean {
    if (!this.user || !this.user.status) return false;
    if (this.isAdmin()) return true;
    
    const permission = this.getPermissionForModule(moduleId);
    return permission?.canWrite || false;
  }

  /**
   * Verifica si puede eliminar en un módulo
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
