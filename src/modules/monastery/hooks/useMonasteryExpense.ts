import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  fetchMonasteryExpenses,
  fetchMonasteryExpenseById,
  createMonasteryExpense,
  updateMonasteryExpense,
  deleteMonasteryExpense,
  fetchMonasteryExpensesByOverhead,
  fetchMonasteryExpensesByCategory,
  fetchMonasteryExpensesByDateRange,
} from '../action/monasteryExpense';
import {
  MonasteryExpenses,
  UpdateMonasteryExpensePayload,
} from '../types/monasteryExpenses';

// Interfaces para el manejo de errores
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Tipo para las respuestas que vienen con wrapper
interface MonasteryExpenseResponse {
  success: boolean;
  data: MonasteryExpenses[];
}

interface MonasteryExpenseFilters {
  category?: string;
  overheadsId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Query Keys
export const MONASTERY_EXPENSE_KEYS = {
  all: ['monasteryExpenses'] as const,
  lists: () => [...MONASTERY_EXPENSE_KEYS.all, 'list'] as const,
  list: (filters?: MonasteryExpenseFilters) => [...MONASTERY_EXPENSE_KEYS.lists(), filters] as const,
  details: () => [...MONASTERY_EXPENSE_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...MONASTERY_EXPENSE_KEYS.details(), id] as const,
  byOverhead: (overheadId: string) => [...MONASTERY_EXPENSE_KEYS.all, 'byOverhead', overheadId] as const,
  byCategory: (category: string) => [...MONASTERY_EXPENSE_KEYS.all, 'byCategory', category] as const,
  byDateRange: (startDate: string, endDate: string) => [
    ...MONASTERY_EXPENSE_KEYS.all, 'byDateRange', startDate, endDate
  ] as const,
};

/**
 * Hook para obtener todos los gastos de monasterio
 */
export const useMonasteryExpenses = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: MONASTERY_EXPENSE_KEYS.lists(),
    queryFn: fetchMonasteryExpenses,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true, // Por defecto habilitado
  });
};

/**
 * Hook para obtener un gasto de monasterio específico
 */
export const useMonasteryExpense = (id: string) => {
  return useQuery({
    queryKey: MONASTERY_EXPENSE_KEYS.detail(id),
    queryFn: () => fetchMonasteryExpenseById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener gastos de monasterio por overhead
 */
export const useMonasteryExpensesByOverhead = (overheadId: string) => {
  return useQuery({
    queryKey: MONASTERY_EXPENSE_KEYS.byOverhead(overheadId),
    queryFn: () => fetchMonasteryExpensesByOverhead(overheadId),
    enabled: !!overheadId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener gastos de monasterio por categoría
 */
export const useMonasteryExpensesByCategory = (category: string) => {
  return useQuery({
    queryKey: MONASTERY_EXPENSE_KEYS.byCategory(category),
    queryFn: () => fetchMonasteryExpensesByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener gastos de monasterio por rango de fechas
 */
export const useMonasteryExpensesByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: MONASTERY_EXPENSE_KEYS.byDateRange(startDate, endDate),
    queryFn: () => fetchMonasteryExpensesByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para crear un nuevo gasto de monasterio
 */
export const useCreateMonasteryExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMonasteryExpense,
    onSuccess: (newExpense: MonasteryExpenses) => {
      // Invalidar y refetch las consultas relacionadas
      queryClient.invalidateQueries({ queryKey: MONASTERY_EXPENSE_KEYS.all });
      
      // Agregar el nuevo gasto a la cache optimistamente
      queryClient.setQueryData(
        MONASTERY_EXPENSE_KEYS.lists(),
        (oldData: MonasteryExpenseResponse | undefined) => {
          // Los datos vienen en formato {success: true, data: Array}
          if (oldData && oldData.data && Array.isArray(oldData.data)) {
            return {
              ...oldData,
              data: [newExpense, ...oldData.data]
            };
          }
          // Si no hay datos previos, crear la estructura esperada
          return {
            success: true,
            data: [newExpense]
          };
        }
      );

      toast.success('Gasto de monasterio creado exitosamente');
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || 'Error al crear el gasto de monasterio';
      toast.error(errorMessage);
      console.error('Error creating monastery expense:', error);
    },
  });
};

/**
 * Hook para actualizar un gasto de monasterio existente
 */
export const useUpdateMonasteryExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMonasteryExpensePayload }) =>
      updateMonasteryExpense(id, payload),
    onSuccess: (updatedExpense: MonasteryExpenses) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({ queryKey: MONASTERY_EXPENSE_KEYS.all });
      
      // Actualizar la cache con los datos actualizados
      queryClient.setQueryData(
        MONASTERY_EXPENSE_KEYS.detail(updatedExpense.id),
        updatedExpense
      );

      toast.success('Gasto de monasterio actualizado exitosamente');
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar el gasto de monasterio';
      toast.error(errorMessage);
      console.error('Error updating monastery expense:', error);
    },
  });
};

/**
 * Hook para eliminar un gasto de monasterio
 */
export const useDeleteMonasteryExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMonasteryExpense,
    onSuccess: (_, deletedId: string) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({ queryKey: MONASTERY_EXPENSE_KEYS.all });
      
      // Remover el gasto eliminado de la cache
      queryClient.setQueryData(
        MONASTERY_EXPENSE_KEYS.lists(),
        (oldData: MonasteryExpenseResponse | undefined) => {
          if (oldData && oldData.data && Array.isArray(oldData.data)) {
            return {
              ...oldData,
              data: oldData.data.filter((expense) => expense.id !== deletedId)
            };
          }
          return {
            success: true,
            data: []
          };
        }
      );

      // Remover la cache del detalle específico
      queryClient.removeQueries({ queryKey: MONASTERY_EXPENSE_KEYS.detail(deletedId) });

      toast.success('Gasto de monasterio eliminado exitosamente');
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || 'Error al eliminar el gasto de monasterio';
      toast.error(errorMessage);
      console.error('Error deleting monastery expense:', error);
    },
  });
};

/**
 * Hook para invalidar manualmente las consultas de gastos de monasterio
 */
export const useInvalidateMonasteryExpenses = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: MONASTERY_EXPENSE_KEYS.all });
  };
};