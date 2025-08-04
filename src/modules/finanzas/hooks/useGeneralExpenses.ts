import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchGeneralExpenses,
  createGeneralExpense,
  updateGeneralExpense,
  deleteGeneralExpense
} from '../action/generalExpense.actions';
import { GeneralExpense, CreateExpensePayload, UpdateExpensePayload } from '../types/generalExpense';

const EXPENSES_QUERY_KEY = 'generalExpenses';

// Hook para OBTENER TODOS los gastos
export const useFetchGeneralExpenses = () => {
  return useQuery<GeneralExpense[], Error>({
    queryKey: [EXPENSES_QUERY_KEY],
    queryFn: fetchGeneralExpenses,
  });
};

// Hook para CREAR un gasto
export const useCreateGeneralExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<GeneralExpense, Error, CreateExpensePayload>({
    mutationFn: createGeneralExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] });
    },
  });
};

// Hook para ACTUALIZAR un gasto
export const useUpdateGeneralExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<GeneralExpense, Error, { id: string; payload: UpdateExpensePayload }>({
    mutationFn: ({ id, payload }) => updateGeneralExpense(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] });
    },
  });
};

// Hook para ELIMINAR un gasto
export const useDeleteGeneralExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteGeneralExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] });
    },
  });
};