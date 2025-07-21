<<<<<<< HEAD
import { CashSessionAttributes, CreateCashSessionPayload, UpdateCashSessionPayload, CloseCashSessionPayload } from '../types/cash-session';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchCashSessions, 
  fetchCashSession, 
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
=======
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCashSessions, createCashSession } from '../action/cash_session'
import { CashSessionAttributes } from '../types/cash_sessions.d'
import { fetchUsers } from '@/modules/user-creations/action/user';
import { User } from '@/modules/user-creations/types/user';

export const useCashSession = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cash_sessions'],
    queryFn: getCashSessions,
  })

  const createMutation = useMutation({
    mutationFn: createCashSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash_sessions'] })
    },
  })

  return {
    cashSessions: data,
    isLoading,
    isError,
    createCashSession: createMutation.mutateAsync,
  }
}

export const useFetchUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};
>>>>>>> main
