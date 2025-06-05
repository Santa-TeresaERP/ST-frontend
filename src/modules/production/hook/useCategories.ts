import { Category, CreateCategoryPayload, UpdateCategoryPayload } from '../types/categories';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, fetchCategory, createCategory, updateCategory, deleteCategory } from '../action/categories';

export const useFetchCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
};

export const useFetchCategory  = (id: string) => {
  return useQuery<Category, Error>({
    queryKey: ['categories', id],
    queryFn: () => fetchCategory(id),
    enabled: !!id, // Solo ejecutar si id está definido
  });
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, CreateCategoryPayload>({
    mutationFn: createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, { id: string; payload: UpdateCategoryPayload }>({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
};