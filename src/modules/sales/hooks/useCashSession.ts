import { CashSessionAttributes, CreateCashSessionPayload, UpdateCashSessionPayload, CloseCashSessionPayload } from '../types/cash-session';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchCashSessions, 
  fetchCashSession, 
  fetchCashSessionDetails,
  createCashSession, 
  updateCashSession, 
  closeCashSession,
  deleteCashSession,
  fetchActiveCashSession,
  fetchCashSessionHistory,
  checkStoreActiveSession
} from '../action/cashSession';

export const useFetchCashSessions = () => {
  return useQuery<CashSessionAttributes[], Error>({
    queryKey: ['cashSessions'],
    queryFn: fetchCashSessions,
  });
};

export const useFetchCashSession = (id: string) => {
  return useQuery<CashSessionAttributes, Error>({
    queryKey: ['cashSession', id],
    queryFn: () => fetchCashSession(id),
    enabled: !!id, // Solo ejecutar si id está definido
  });
};

// Hook para obtener detalles completos de una sesión de caja con totales calculados
export const useFetchCashSessionDetails = (id?: string) => {
  return useQuery({
    queryKey: ['cashSessionDetails', id],
    queryFn: () => fetchCashSessionDetails(id!),
    enabled: !!id, // Solo ejecutar si id está definido
    refetchInterval: 3000, // Refrescar cada 3 segundos
    refetchOnWindowFocus: true,
    staleTime: 1000, // Considerar datos obsoletos después de 1 segundo
  });
};

export const useFetchActiveCashSession = (storeId?: string) => {
  return useQuery<CashSessionAttributes | null, Error>({
    queryKey: ['activeCashSession', storeId],
    queryFn: () => fetchActiveCashSession(storeId!),
    enabled: !!storeId, // Solo ejecutar si storeId está definido
    // ✅ CORREGIDO: Filtro adicional para asegurar que la sesión pertenece a la tienda correcta
    select: (data) => {
      console.log('🔍 [DEBUG] Hook select - Filtrando sesión por tienda:', {
        storeId,
        sessionData: data ? {
          id: data.id,
          store_id: data.store_id,
          status: data.status
        } : null,
        match: data?.store_id === storeId
      });
      
      // Si no hay datos o la sesión no pertenece a la tienda, retornar null
      if (!data || data.store_id !== storeId) {
        console.log('❌ [DEBUG] Sesión filtrada - no pertenece a la tienda seleccionada');
        return null;
      }
      
      console.log('✅ [DEBUG] Sesión válida para la tienda');
      return data;
    }
  });
};

export const useFetchCashSessionHistory = (storeId?: string) => {
  return useQuery<CashSessionAttributes[], Error>({
    queryKey: ['cashSessionHistory', storeId],
    queryFn: () => fetchCashSessionHistory(storeId!),
    enabled: !!storeId, // Solo ejecutar si storeId está definido
  });
};

// Hook para verificar si una tienda tiene una sesión de caja activa usando la nueva ruta
export const useCheckStoreActiveSession = (storeId?: string) => {
  return useQuery({
    queryKey: ['checkStoreActiveSession', storeId],
    queryFn: () => checkStoreActiveSession(storeId!),
    enabled: !!storeId, // Solo ejecutar si storeId está definido
    refetchInterval: 30000, // Refrescar cada 30 segundos para mantener el estado actualizado
    refetchOnWindowFocus: true,
  });
};

export const useCreateCashSession = () => {
  const queryClient = useQueryClient();
  return useMutation<CashSessionAttributes, Error, CreateCashSessionPayload>({
    mutationFn: createCashSession,
    onSuccess: (data) => {
      // ✅ CORREGIDO: Solo invalidar queries específicas de la tienda afectada
      queryClient.invalidateQueries({ queryKey: ['cashSessions'] });
      queryClient.invalidateQueries({ queryKey: ['activeCashSession', data.store_id] });
      queryClient.invalidateQueries({ queryKey: ['cashSessionHistory', data.store_id] });
      queryClient.invalidateQueries({ queryKey: ['checkStoreActiveSession', data.store_id] });
    },
  });
};

export const useUpdateCashSession = () => {
  const queryClient = useQueryClient();
  return useMutation<CashSessionAttributes, Error, { id: string; payload: UpdateCashSessionPayload }>({
    mutationFn: ({ id, payload }) => updateCashSession(id, payload),
    onSuccess: (data) => {
      // ✅ CORREGIDO: Solo invalidar queries específicas de la tienda afectada
      queryClient.invalidateQueries({ queryKey: ['cashSessions'] });
      queryClient.invalidateQueries({ queryKey: ['cashSession', data.id] });
      queryClient.invalidateQueries({ queryKey: ['activeCashSession', data.store_id] });
      queryClient.invalidateQueries({ queryKey: ['cashSessionHistory', data.store_id] });
      queryClient.invalidateQueries({ queryKey: ['cashSessionDetails', data.id] });
      queryClient.invalidateQueries({ queryKey: ['checkStoreActiveSession', data.store_id] });
    },
  });
};

export const useCloseCashSession = () => {
  const queryClient = useQueryClient();
  return useMutation<CashSessionAttributes, Error, { id: string; payload: CloseCashSessionPayload }>({
    mutationFn: ({ id, payload }) => closeCashSession(id, payload),
    onSuccess: (data) => {
      // ✅ CORREGIDO: Solo invalidar queries específicas de la tienda afectada
      queryClient.invalidateQueries({ queryKey: ['cashSessions'] });
      queryClient.invalidateQueries({ queryKey: ['cashSession', data.id] });
      queryClient.invalidateQueries({ queryKey: ['activeCashSession', data.store_id] });
      queryClient.invalidateQueries({ queryKey: ['cashSessionHistory', data.store_id] });
      queryClient.invalidateQueries({ queryKey: ['cashSessionDetails', data.id] });
      queryClient.invalidateQueries({ queryKey: ['checkStoreActiveSession', data.store_id] });
    },
  });
};

export const useDeleteCashSession = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteCashSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashSessions'] });
      // También invalidar las queries relacionadas si es necesario
    },
  });
};
