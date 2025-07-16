import { salesAttributes } from '../types/sales';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSales, fetchSale, createSale, updateSale, deleteSale } from '../action/sales';

export const useFetchSales = () => {
  return useQuery<salesAttributes[], Error>({
    queryKey: ['sales'],
    queryFn: fetchSales,
  });
};

export const useFetchSale = (id: string) => {
  return useQuery<salesAttributes, Error>({
    queryKey: ['sales', id],
    queryFn: () => fetchSale(id),
    enabled: !!id, // Solo ejecutar si id está definido
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  return useMutation<salesAttributes, Error, Omit<salesAttributes, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: createSale,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  });
};

export const useUpdateSale = () => {
  const queryClient = useQueryClient();
  return useMutation<salesAttributes, Error, { id: string; payload: Partial<Omit<salesAttributes, 'id' | 'createdAt' | 'updatedAt'>> }>({
    mutationFn: ({ id, payload }) => updateSale(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteSale,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  });
};