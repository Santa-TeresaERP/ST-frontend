import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchGeneralIncomes,
  createGeneralIncome,
  updateGeneralIncome,
  deleteGeneralIncome
} from '../action/generalIncome.actions';
import { GeneralIncome, CreateIncomePayload, UpdateIncomePayload } from '../types/generalIncome';

const INCOMES_QUERY_KEY = 'generalIncomes';

// Hook para OBTENER TODOS los ingresos
export const useFetchGeneralIncomes = () => {
  return useQuery<GeneralIncome[], Error>({
    queryKey: [INCOMES_QUERY_KEY],
    queryFn: fetchGeneralIncomes,
  });
};

// Hook para CREAR un ingreso
export const useCreateGeneralIncome = () => {
  const queryClient = useQueryClient();
  return useMutation<GeneralIncome, Error, CreateIncomePayload>({
    mutationFn: createGeneralIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INCOMES_QUERY_KEY] });
      // Invalidar también reportes financieros para sincronizar cálculos
      queryClient.invalidateQueries({ queryKey: ['financialReports'] });
    },
  });
};

// Hook para ACTUALIZAR un ingreso
export const useUpdateGeneralIncome = () => {
  const queryClient = useQueryClient();
  return useMutation<GeneralIncome, Error, { id: string; payload: UpdateIncomePayload }>({
    mutationFn: ({ id, payload }) => updateGeneralIncome(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INCOMES_QUERY_KEY] });
      // Invalidar también reportes financieros para sincronizar cálculos
      queryClient.invalidateQueries({ queryKey: ['financialReports'] });
    },
  });
};

// Hook para ELIMINAR un ingreso
export const useDeleteGeneralIncome = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteGeneralIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INCOMES_QUERY_KEY] });
      // Invalidar también reportes financieros para sincronizar cálculos
      queryClient.invalidateQueries({ queryKey: ['financialReports'] });
    },
  });
};