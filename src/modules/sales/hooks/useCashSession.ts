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