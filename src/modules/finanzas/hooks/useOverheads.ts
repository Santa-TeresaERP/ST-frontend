import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { 
  OverheadAttributes, 
  CreateOverheadPayload, 
  UpdateOverheadPayload 
} from '../types/overheads';
import { 
  fetchAllOverheads,
  fetchOverheads,
  fetchMonthlyExpenses,
  fetchMonasteryOverheads,
  createOverhead,
  createMonasterioOverhead,
  updateOverhead,
  deleteOverhead
} from '../action/overheads';

const OVERHEADS_QUERY_KEY = 'finanzas-overheads';

// Hook para OBTENER TODOS los gastos generales
export const useFetchAllOverheads = () => {
  return useQuery<OverheadAttributes[], Error>({
    queryKey: [`${OVERHEADS_QUERY_KEY}-all`],
    queryFn: fetchAllOverheads,
  });
};

// Hook para OBTENER gastos generales básicos
export const useFetchOverheads = () => {
  return useQuery<OverheadAttributes[], Error>({
    queryKey: [OVERHEADS_QUERY_KEY],
    queryFn: fetchOverheads,
  });
};

// Hook para OBTENER gastos mensuales
export const useFetchMonthlyExpenses = () => {
  return useQuery<OverheadAttributes[], Error>({
    queryKey: [`${OVERHEADS_QUERY_KEY}-monthly`],
    queryFn: fetchMonthlyExpenses,
  });
};

// Hook para OBTENER gastos del monasterio
export const useFetchMonasteryOverheads = () => {
  return useQuery<OverheadAttributes[], Error>({
    queryKey: [`${OVERHEADS_QUERY_KEY}-monastery`],
    queryFn: fetchMonasteryOverheads,
  });
};

// Hook para CREAR un gasto general (genérico)
export const useCreateOverhead = () => {
  const queryClient = useQueryClient();
  return useMutation<OverheadAttributes, Error, CreateOverheadPayload>({
    mutationFn: createOverhead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OVERHEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-all`] });
      queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monthly`] });
      queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monastery`] });
    },
  });
};

// Hook para CREAR un gasto general de tipo MONASTERIO
export const useCreateMonasterioOverhead = () => {
  const queryClient = useQueryClient();
  return useMutation<OverheadAttributes, Error, Omit<CreateOverheadPayload, 'type'>>({
    mutationFn: createMonasterioOverhead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monastery`] });
      queryClient.invalidateQueries({ queryKey: [OVERHEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-all`] });
    },
  });
};

// Hook para ACTUALIZAR un gasto general
export const useUpdateOverhead = () => {
  const queryClient = useQueryClient();
  return useMutation<OverheadAttributes, Error, { id: string; payload: UpdateOverheadPayload }>({
    mutationFn: ({ id, payload }) => updateOverhead(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OVERHEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-all`] });
      queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monthly`] });
      queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monastery`] });
    },
  });
};

// Hook para ELIMINAR (lógicamente) un gasto general
export const useDeleteOverhead = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteOverhead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OVERHEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-all`] });
      queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monthly`] });
      queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monastery`] });
    },
  });
};

// Hook consolidado para gestión completa de gastos generales
export const useFinanzasOverheads = () => {
  const query = useFetchAllOverheads();
  const updateMut = useUpdateOverhead();
  const deleteMut = useDeleteOverhead();
  const createMut = useCreateOverhead();
  const createMonMut = useCreateMonasterioOverhead();

  const arrayData = Array.isArray(query.data)
    ? (query.data as OverheadAttributes[])
    : query.data
    ? ([query.data] as OverheadAttributes[])
    : ([] as OverheadAttributes[]);

  return {
    data: arrayData,
    loading: query.isLoading,
    error: query.error ? query.error.message : null,
    update: (id: string, payload: UpdateOverheadPayload) =>
      updateMut.mutateAsync({ id, payload }),
    remove: (id: string) => deleteMut.mutateAsync(id),
    deleting: deleteMut.isPending,
    updating: updateMut.isPending,
    create: (payload: CreateOverheadPayload) => createMut.mutateAsync(payload),
    createMonasterio: (payload: Omit<CreateOverheadPayload, 'type'>) =>
      createMonMut.mutateAsync(payload),
    creating: createMut.isPending,
    refetch: query.refetch,
  };
};