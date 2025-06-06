import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupplierCategory, CreateSupplierCategoryPayload, UpdateSupplierCategoryPayload } from '../types/categories';
import { fetchSupplierCategories, createSupplierCategory, updateSupplierCategory, deleteSupplierCategory } from '../action/categories';

export const useFetchSupplierCategories = () =>
  useQuery<SupplierCategory[], Error>({
    queryKey: ['supplier-categories'],
    queryFn: fetchSupplierCategories,
  });

export const useCreateSupplierCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<SupplierCategory, Error, CreateSupplierCategoryPayload>({
    mutationFn: createSupplierCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['supplier-categories'] }),
  });
};

export const useUpdateSupplierCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<SupplierCategory, Error, { id: string; payload: UpdateSupplierCategoryPayload }>({
    mutationFn: ({ id, payload }) => updateSupplierCategory(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['supplier-categories'] }),
  });
};

export const useDeleteSupplierCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteSupplierCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['supplier-categories'] }),
  });
};
