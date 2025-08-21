import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchOverheads,
  createOverhead,
  createMonasterioOverhead,
  updateOverhead,
  deleteOverhead
} from '../action/overheads.actions';
import { Overhead, CreateOverheadPayload, UpdateOverheadPayload } from '../types/overheads.d';

const OVERHEADS_QUERY_KEY = 'overhead';

// Hook para OBTENER TODOS los gastos generales
export const useFetchOverheads = () => {
  return useQuery<Overhead[], Error>({
    queryKey: [OVERHEADS_QUERY_KEY],
    queryFn: fetchOverheads,
  });
};

// Hook para CREAR un gasto general (genérico)
export const useCreateOverhead = () => {
  const queryClient = useQueryClient();
  return useMutation<Overhead, Error, CreateOverheadPayload>({
    mutationFn: createOverhead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OVERHEADS_QUERY_KEY] });
    },
  });
};

// Hook para CREAR un gasto general de tipo MONASTERIO
export const useCreateMonasterioOverhead = () => {
  const queryClient = useQueryClient();
  return useMutation<Overhead, Error, Omit<CreateOverheadPayload, 'type'>>({
    mutationFn: createMonasterioOverhead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OVERHEADS_QUERY_KEY] });
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
    },
  });
};