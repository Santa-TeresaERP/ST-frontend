import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInventory, createInventoryProduct, updateInventoryProduct, deleteInventoryProduct } from '../action/inventory';
import { InventoryItem, CreateInventoryItem, UpdateInventoryItem } from '../types/inventory.types';

const INVENTORY_QUERY_KEY = 'inventory';

export const useFetchInventory = () => {
  return useQuery<InventoryItem[], Error>({
    queryKey: [INVENTORY_QUERY_KEY],
    queryFn: fetchInventory,
  });
};

export const useCreateInventoryProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<InventoryItem, Error, CreateInventoryItem>({
    mutationFn: createInventoryProduct,
    onSuccess: () => {
      // Invalida y refetchea la query del inventario
      queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY] });
    },
  });
};

export const useUpdateInventoryProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<InventoryItem, Error, { id: string; payload: UpdateInventoryItem }>({
    mutationFn: ({ id, payload }) => updateInventoryProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY] });
    },
  });
};

export const useDeleteInventoryProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteInventoryProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY] });
    },
  });
};