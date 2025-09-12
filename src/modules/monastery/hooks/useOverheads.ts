import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Overhead, CreateOverheadPayload, UpdateOverheadPayload } from '../types/overheads.d';
import { createMonasterioOverhead, createOverhead, deleteOverhead, fetchMonasterioOverheads, fetchMonthlyOverheads, fetchOverheads, updateOverhead } from '../action/overheads.actions';

const OVERHEADS_QUERY_KEY = 'overhead';

// Hook para OBTENER TODOS los gastos generales
export const useFetchOverheads = () => {
  return useQuery<Overhead[], Error>({
    queryKey: [OVERHEADS_QUERY_KEY],
    queryFn: fetchOverheads,
  });
};

export const useFetchMonasterioOverheads = () => {
  return useQuery<Overhead[], Error>({
    queryKey: [`${OVERHEADS_QUERY_KEY}-monastery`],
    queryFn: fetchMonasterioOverheads,
  });
}

export const useFetchMonthlyOverheads = () => {
  return useQuery<Overhead[], Error>({
    queryKey: [`${OVERHEADS_QUERY_KEY}-monthly`],
    queryFn: fetchMonthlyOverheads,
  });
};

// Hook para CREAR un gasto general (genérico)
export const useCreateOverhead = () => {
  const queryClient = useQueryClient();
  return useMutation<Overhead, Error, CreateOverheadPayload>({
    mutationFn: createOverhead,
    onSuccess: () => {
  // Invalidate generic and monastery-specific lists
  queryClient.invalidateQueries({ queryKey: [OVERHEADS_QUERY_KEY] });
  queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monastery`] });
  queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monthly`] });
    },
  });
};

// Hook para CREAR un gasto general de tipo MONASTERIO
export const useCreateMonasterioOverhead = () => {
  const queryClient = useQueryClient();
  return useMutation<Overhead, Error, Omit<CreateOverheadPayload, 'type'>>({
    mutationFn: createMonasterioOverhead,
    onSuccess: () => {
  // Invalidate monastery-specific list primarily, plus generic as safety
  queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monastery`] });
  queryClient.invalidateQueries({ queryKey: [OVERHEADS_QUERY_KEY] });
  queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monthly`] });
    },
  });
};

// Hook para ACTUALIZAR un gasto general
export const useUpdateOverhead = () => {
  const queryClient = useQueryClient();
  return useMutation<Overhead, Error, { id: string; payload: UpdateOverheadPayload }>({
    mutationFn: ({ id, payload }) => updateOverhead(id, payload),
    onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: [OVERHEADS_QUERY_KEY] });
  queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monastery`] });
  queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monthly`] });
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
  queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monastery`] });
  queryClient.invalidateQueries({ queryKey: [`${OVERHEADS_QUERY_KEY}-monthly`] });
    },
  });
};

// Hook consolidado al estilo del módulo de museo
export const useMonasteryOverheads = () => {
  // Use the monastery-specific endpoint for this consolidated hook
  const query = useFetchMonasterioOverheads();
  const updateMut = useUpdateOverhead();
  const deleteMut = useDeleteOverhead();
  const createMut = useCreateOverhead();
  const createMonMut = useCreateMonasterioOverhead();

  const arrayData = Array.isArray(query.data)
    ? (query.data as Overhead[])
    : query.data
    ? ([query.data] as Overhead[])
    : ([] as Overhead[]);

  return {
    data: arrayData,
    loading: query.isLoading,
    error: query.error ? query.error.message : null,
    update: (id: string, payload: Partial<UpdateOverheadPayload>) =>
      updateMut.mutateAsync({ id, payload }),
    remove: (id: string) => deleteMut.mutateAsync(id),
  deleting: deleteMut.isPending,
    create: (payload: CreateOverheadPayload) => createMut.mutateAsync(payload),
    createMonasterio: (payload: Omit<CreateOverheadPayload, 'type'>) =>
      createMonMut.mutateAsync(payload),
    refetch: query.refetch,
  };
};