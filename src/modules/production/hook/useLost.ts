import { Lost, CreateLostPayload, UpdateLostPayload } from '../types/lost';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchAllLost, 
  fetchLostById, 
  createLost, 
  updateLost, 
  deleteLost 
} from '../action/lost';

export const useFetchAllLost = () => {
  return useQuery<Lost[], Error>({
    queryKey: ['lost'],
    queryFn: fetchAllLost,
  });
};

export const useFetchLostById = (id: string) => {
  return useQuery<Lost, Error>({
    queryKey: ['lost', id],
    queryFn: () => fetchLostById(id),
    enabled: !!id,
  });
};

export const useCreateLost = () => {
  const queryClient = useQueryClient();
  return useMutation<Lost, Error, CreateLostPayload>({
    mutationFn: createLost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lost'] }),
  });
};

export const useUpdateLost = () => {
  const queryClient = useQueryClient();
  return useMutation<Lost, Error, { id: string; payload: UpdateLostPayload }>({
    mutationFn: ({ id, payload }) => updateLost(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lost'] }),
  });
};

export const useDeleteLost = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteLost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lost'] }),
  });
};