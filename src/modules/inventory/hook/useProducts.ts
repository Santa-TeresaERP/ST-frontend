import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../action/ListProducts';

import {
  ProductAttributes,
  CreateProductPayload,
  UpdateProductPayload,
} from '../types/ListProduct';

// Obtener todos los productos
export const useFetchProducts = () => {
  return useQuery<ProductAttributes[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

// Obtener un producto por ID
export const useFetchProductById = (id: string) => {
  return useQuery<ProductAttributes, Error>({
    queryKey: ['products', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
};

// Crear un nuevo producto
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductAttributes, Error, CreateProductPayload>({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Actualizar un producto
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductAttributes, Error, { id: string; payload: UpdateProductPayload }>({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Eliminar un producto
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
