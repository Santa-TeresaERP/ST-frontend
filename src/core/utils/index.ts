// 🔥 EXPORTS DEL SISTEMA DE PERMISOS
export * from './permission-types';
export * from './permission-manager';
export * from './permission-hooks';
export * from './useSyncUserPermissions';
export * from './useLoadUserFromToken';
export * from './useAutoPermissionSync'; // 🔥 NUEVO: Auto-sync automático
export { default as AccessDeniedModal } from './AccessDeniedModal';

// 🔥 UTILS DE CONTROL DE ERRORES
export * from './error-suppressor';
