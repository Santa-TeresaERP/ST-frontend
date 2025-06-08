import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupplierLost, CreateSupplierLostPayload, UpdateSupplierLostPayload } from '../types/lost';
import { fetchSupplierLosts, createSupplierLost, updateSupplierLost, deleteSupplierLost } from '../action/lost';

export const useFetchSupplierLosts = () =>
  useQuery<SupplierLost[], Error>({
    queryKey: ['supplier-lost'],
    queryFn: fetchSupplierLosts,
  });

export const useCreateSupplierLost = () => {
  const queryClient = useQueryClient();
  return useMutation<SupplierLost, Error, CreateSupplierLostPayload>({
    mutationFn: createSupplierLost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['supplier-lost'] }),
  });
};

export const useUpdateSupplierLost = () => {
  const queryClient = useQueryClient();
  return useMutation<SupplierLost, Error, { id: string; payload: UpdateSupplierLostPayload }>({
    mutationFn: ({ id, payload }) => updateSupplierLost(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['supplier-lost'] }),
  });
};

export const useDeleteSupplierLost = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteSupplierLost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['supplier-lost'] }),
  });
};