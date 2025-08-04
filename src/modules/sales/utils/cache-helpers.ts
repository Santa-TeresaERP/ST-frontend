import { QueryClient } from '@tanstack/react-query';

/**
 * Funciones helper para gestionar el cache de React Query de manera aislada por tienda
 * Evita que las operaciones en una tienda afecten a otras tiendas
 */

/**
 * Invalida todas las queries relacionadas con una tienda específica
 * @param queryClient - Cliente de React Query
 * @param storeId - ID de la tienda
 * @param sessionId - ID de la sesión (opcional)
 */
export const invalidateStoreQueries = (
  queryClient: QueryClient, 
  storeId: string, 
  sessionId?: string
) => {
  console.log(`🔄 [DEBUG] Invalidando cache para tienda: ${storeId}${sessionId ? `, sesión: ${sessionId}` : ''}`);
  
  // Debug: mostrar el estado actual del cache antes de invalidar
  const currentCache = queryClient.getQueryData(['activeCashSession', storeId]);
  console.log(`🔍 [DEBUG] Cache actual antes de invalidar:`, currentCache);
  
  // Invalidar queries específicas de la tienda
  queryClient.invalidateQueries({ queryKey: ['activeCashSession', storeId] });
  queryClient.invalidateQueries({ queryKey: ['cashSessionHistory', storeId] });
  queryClient.invalidateQueries({ queryKey: ['checkStoreActiveSession', storeId] });
  
  console.log(`✅ [DEBUG] Queries invalidadas para tienda ${storeId}`);
  
  // Si hay una sesión específica, invalidar sus detalles
  if (sessionId) {
    queryClient.invalidateQueries({ queryKey: ['cashSession', sessionId] });
    queryClient.invalidateQueries({ queryKey: ['cashSessionDetails', sessionId] });
    console.log(`✅ [DEBUG] Detalles de sesión ${sessionId} invalidados`);
  }
};

/**
 * Limpia completamente el cache de una tienda específica
 * @param queryClient - Cliente de React Query
 * @param storeId - ID de la tienda
 */
export const clearStoreCache = (queryClient: QueryClient, storeId: string) => {
  console.log(`🗑️ Limpiando cache completo para tienda: ${storeId}`);
  
  // Remover queries específicas de la tienda
  queryClient.removeQueries({ queryKey: ['activeCashSession', storeId] });
  queryClient.removeQueries({ queryKey: ['cashSessionHistory', storeId] });
  queryClient.removeQueries({ queryKey: ['checkStoreActiveSession', storeId] });
};

/**
 * Invalida solo las queries globales (que no son específicas de tienda)
 * @param queryClient - Cliente de React Query
 */
export const invalidateGlobalQueries = (queryClient: QueryClient) => {
  console.log('🌐 Invalidando queries globales');
  queryClient.invalidateQueries({ queryKey: ['cashSessions'] });
};

/**
 * Función segura para cambiar de tienda - limpia el cache de la tienda anterior
 * @param queryClient - Cliente de React Query
 * @param previousStoreId - ID de la tienda anterior (opcional)
 * @param newStoreId - ID de la nueva tienda
 */
export const switchStore = (
  queryClient: QueryClient, 
  previousStoreId: string | undefined, 
  newStoreId: string
) => {
  if (previousStoreId && previousStoreId !== newStoreId) {
    console.log(`🔄 Cambiando de tienda: ${previousStoreId} → ${newStoreId}`);
    // Opcional: limpiar cache de la tienda anterior para evitar conflictos
    // clearStoreCache(queryClient, previousStoreId);
  }
  
  // Invalidar queries de la nueva tienda para cargar datos frescos
  invalidateStoreQueries(queryClient, newStoreId);
};
