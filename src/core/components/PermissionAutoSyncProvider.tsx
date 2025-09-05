import React from 'react';
import { suppressAxios403Errors } from '@/core/utils/error-suppressor';

/**
 * 🔥 PROVEEDOR SIMPLIFICADO PARA SUPRIMIR ERRORES 403
 * 
 * Este componente solo se encarga de suprimir errores 403 molestos en consola
 * La lógica de auto-sync se maneja directamente en los modales cuando sea necesario
 */
export const PermissionAutoSyncProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Suprimir errores 403 molestos en consola una sola vez
  React.useEffect(() => {
    suppressAxios403Errors();
    console.log('🔄 🎯 Sistema de supresión de errores 403 activado');
  }, []);

  // Este componente es transparente, solo renderiza los children
  return <>{children}</>;
};

export default PermissionAutoSyncProvider;
