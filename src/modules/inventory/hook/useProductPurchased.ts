import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProductPurchased,
  createProductPurchased,
  updateProductPurchased,
  deleteProductPurchased
} from '../action/productPurchased';
import {
  ProductPurchased,
  CreateProductPurchasedPayload,
  UpdateProductPurchasedPayload
} from '../types/productPurchased';

const PRODUCT_PURCHASED_QUERY_KEY = 'productPurchased';

/**
 * Hook para OBTENER la lista de productos comprados.
 */
export const useFetchProductPurchased = () => {
  return useQuery<ProductPurchased[], Error>({
    queryKey: [PRODUCT_PURCHASED_QUERY_KEY],
    queryFn: fetchProductPurchased,
  });
};

/**
 * Hook para CREAR un nuevo producto comprado.
 */
export const useCreateProductPurchased = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductPurchased, Error, CreateProductPurchasedPayload>({
    mutationFn: createProductPurchased,
    onSuccess: () => {
      // Cuando la creación es exitosa, invalidamos la caché para que la lista se actualice.
      queryClient.invalidateQueries({ queryKey: [PRODUCT_PURCHASED_QUERY_KEY] });
    },
  });
};

/**
 * Hook para ACTUALIZAR un producto comprado.
 */
export const useUpdateProductPurchased = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductPurchased, Error, { id: string; payload: UpdateProductPurchasedPayload }>({
    mutationFn: ({ id, payload }) => updateProductPurchased(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_PURCHASED_QUERY_KEY] });
    },
  });
};

/**
 * Hook para ELIMINAR (lógicamente) un producto comprado.
 */
export const useDeleteProductPurchased = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteProductPurchased,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_PURCHASED_QUERY_KEY] });
    },
  });
};