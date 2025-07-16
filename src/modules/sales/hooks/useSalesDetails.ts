import { salesItemsAttributes } from '../types/salesDetails';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSalesDetails, fetchSalesDetail, createSalesDetail, updateSalesDetail, deleteSalesDetail } from '../action/salesDetails';

export const useFetchSalesDetails = () => {
  return useQuery<salesItemsAttributes[], Error>({
    queryKey: ['salesDetails'],
    queryFn: fetchSalesDetails,
  });
};

export const useFetchSalesDetail = (id: string) => {
  return useQuery<salesItemsAttributes, Error>({
    queryKey: ['salesDetails', id],
    queryFn: () => fetchSalesDetail(id),
    enabled: !!id, // Solo ejecutar si id está definido
  });
};

export const useCreateSalesDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<salesItemsAttributes, Error, Omit<salesItemsAttributes, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: createSalesDetail,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['salesDetails'] }),
  });
};

export const useUpdateSalesDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<salesItemsAttributes, Error, { id: string; payload: Partial<Omit<salesItemsAttributes, 'id' | 'createdAt' | 'updatedAt'>> }>({
    mutationFn: ({ id, payload }) => updateSalesDetail(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['salesDetails'] }),
  });
};

export const useDeleteSalesDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteSalesDetail,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['salesDetails'] }),
  });
};