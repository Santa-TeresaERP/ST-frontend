import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Supplier, CreateSupplierPayload, UpdateSupplierPayload } from '../types/suppliers';
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../action/suppliers';

export const useFetchSuppliers = () =>
  useQuery<Supplier[], Error>({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
  });

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation<Supplier, Error, CreateSupplierPayload>({
    mutationFn: createSupplier,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation<Supplier, Error, { id: string; payload: UpdateSupplierPayload }>({
    mutationFn: ({ id, payload }) => updateSupplier(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteSupplier,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
  });
};