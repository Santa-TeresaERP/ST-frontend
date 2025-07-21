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
  fetchCashSessionHistory
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
  });
};

export const useFetchCashSessionHistory = (storeId?: string) => {
  return useQuery<CashSessionAttributes[], Error>({
    queryKey: ['cashSessionHistory', storeId],
    queryFn: () => fetchCashSessionHistory(storeId!),
    enabled: !!storeId, // Solo ejecutar si storeId está definido
  });
};

export const useCreateCashSession = () => {
  const queryClient = useQueryClient();
  return useMutation<CashSessionAttributes, Error, CreateCashSessionPayload>({
    mutationFn: createCashSession,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cashSessions'] });
      queryClient.invalidateQueries({ queryKey: ['activeCashSession', data.store_id] });
      queryClient.invalidateQueries({ queryKey: ['cashSessionHistory', data.store_id] });
    },
  });
};

export const useUpdateCashSession = () => {
  const queryClient = useQueryClient();
  return useMutation<CashSessionAttributes, Error, { id: string; payload: UpdateCashSessionPayload }>({
    mutationFn: ({ id, payload }) => updateCashSession(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cashSessions'] });
      queryClient.invalidateQueries({ queryKey: ['cashSession', data.id] });
      queryClient.invalidateQueries({ queryKey: ['activeCashSession', data.store_id] });
      queryClient.invalidateQueries({ queryKey: ['cashSessionHistory', data.store_id] });
    },
  });
};

export const useCloseCashSession = () => {
  const queryClient = useQueryClient();
  return useMutation<CashSessionAttributes, Error, { id: string; payload: CloseCashSessionPayload }>({
    mutationFn: ({ id, payload }) => closeCashSession(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cashSessions'] });
      queryClient.invalidateQueries({ queryKey: ['cashSession', data.id] });
      queryClient.invalidateQueries({ queryKey: ['activeCashSession', data.store_id] });
      queryClient.invalidateQueries({ queryKey: ['cashSessionHistory', data.store_id] });
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
