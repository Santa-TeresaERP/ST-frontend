import { WarehouseProduct, CreateWarehouseProductPayload, UpdateWarehouseProductPayload } from '../types/warehouseProduct';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWarehouseProducts, createWarehouseProduct, updateWarehouseProduct, deleteWarehouseProduct } from '../action/warehouseProducts';

export const useFetchWarehouseProducts = () => {
  return useQuery<WarehouseProduct[], Error>({
    queryKey: ['warehouseProducts'],
    queryFn: fetchWarehouseProducts,
  });
};

export const useCreateWarehouseProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseProduct, Error, CreateWarehouseProductPayload>({
    mutationFn: createWarehouseProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouseProducts'] }),
  });
};

export const useUpdateWarehouseProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseProduct, Error, { id: string; payload: UpdateWarehouseProductPayload }>({
    mutationFn: ({ id, payload }) => updateWarehouseProduct(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouseProducts'] }),
  });
};

export const useDeleteWarehouseProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteWarehouseProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouseProducts'] }),
  });
};