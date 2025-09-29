import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { 
  MonasteryExpense, 
  CreateMonasteryExpensePayload, 
  UpdateMonasteryExpensePayload 
} from '../types/monasteryexpense.d';
import { 
  fetchMonasteryExpenses,
  fetchMonasteryExpenseById,
  createMonasteryExpense,
  updateMonasteryExpense,
  deleteMonasteryExpense
} from '../action/monasteryexpense';

const MONASTERY_EXPENSES_QUERY_KEY = 'monasteryExpenses';

// Hook para OBTENER TODOS los gastos del monasterio
export const useFetchMonasteryExpenses = () => {
  return useQuery<MonasteryExpense[], Error>({
    queryKey: [MONASTERY_EXPENSES_QUERY_KEY],
    queryFn: fetchMonasteryExpenses,
  });
};

// Hook para OBTENER UN gasto del monasterio por ID
export const useFetchMonasteryExpenseById = (id: string) => {
  return useQuery<MonasteryExpense, Error>({
    queryKey: [MONASTERY_EXPENSES_QUERY_KEY, id],
    queryFn: () => fetchMonasteryExpenseById(id),
    enabled: !!id, // Solo ejecutar si hay un ID válido
  });
};

// Hook para CREAR un gasto del monasterio
export const useCreateMonasteryExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<MonasteryExpense, Error, CreateMonasteryExpensePayload>({
    mutationFn: createMonasteryExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MONASTERY_EXPENSES_QUERY_KEY] });
      // También invalidar los overheads del monasterio si están relacionados
      queryClient.invalidateQueries({ queryKey: ['overhead-monastery'] });
    },
  });
};

// Hook para ACTUALIZAR un gasto del monasterio
export const useUpdateMonasteryExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<MonasteryExpense, Error, { id: string; payload: UpdateMonasteryExpensePayload }>({
    mutationFn: ({ id, payload }) => updateMonasteryExpense(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [MONASTERY_EXPENSES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MONASTERY_EXPENSES_QUERY_KEY, variables.id] });
      // También invalidar los overheads del monasterio si están relacionados
      queryClient.invalidateQueries({ queryKey: ['overhead-monastery'] });
    },
  });
};

// Hook para ELIMINAR un gasto del monasterio
export const useDeleteMonasteryExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteMonasteryExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MONASTERY_EXPENSES_QUERY_KEY] });
      // También invalidar los overheads del monasterio si están relacionados
      queryClient.invalidateQueries({ queryKey: ['overhead-monastery'] });
    },
  });
};

// Hook consolidado para gestión completa de gastos del monasterio
export const useMonasteryExpenses = () => {
  const query = useFetchMonasteryExpenses();
  const updateMut = useUpdateMonasteryExpense();
  const deleteMut = useDeleteMonasteryExpense();
  const createMut = useCreateMonasteryExpense();

  const arrayData = Array.isArray(query.data)
    ? (query.data as MonasteryExpense[])
    : query.data
    ? ([query.data] as MonasteryExpense[])
    : ([] as MonasteryExpense[]);

  return {
    data: arrayData,
    loading: query.isLoading,
    error: query.error ? query.error.message : null,
    update: (id: string, payload: UpdateMonasteryExpensePayload) =>
      updateMut.mutateAsync({ id, payload }),
    remove: (id: string) => deleteMut.mutateAsync(id),
    deleting: deleteMut.isPending,
    updating: updateMut.isPending,
    create: (payload: CreateMonasteryExpensePayload) => createMut.mutateAsync(payload),
    creating: createMut.isPending,
    refetch: query.refetch,
  };
};