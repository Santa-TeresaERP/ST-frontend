import { Production, CreateProductionPayload, UpdateProductionPayload } from '../types/productions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProductions, createProduction, updateProduction, deleteProduction } from '../action/productions';

export const useFetchProductions = () => {
  return useQuery<Production[], Error>({
    queryKey: ['productions'],
    queryFn: fetchProductions,
  });
};

export const useCreateProduction = () => {
  const queryClient = useQueryClient();
  return useMutation<Production, Error, CreateProductionPayload>({
    mutationFn: createProduction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productions'] }),
  });
};

export const useUpdateProduction = () => {
  const queryClient = useQueryClient();
  return useMutation<Production, Error, { id: string; payload: UpdateProductionPayload }>({
    mutationFn: ({ id, payload }) => updateProduction(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productions'] }),
  });
};

export const useDeleteProduction = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteProduction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productions'] }),
  });
};

