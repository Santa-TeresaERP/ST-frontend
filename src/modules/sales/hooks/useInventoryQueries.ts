import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchWarehouseStoreItems,
  createWarehouseStoreItem,
  updateWarehouseStoreItem,
  deleteWarehouseStoreItem
} from '../action/inventory';
import { 
  WarehouseStoreItem, 
  CreateWarehouseStorePayload,
  UpdateWarehouseStorePayload
} from '../types/inventory.types';

const WAREHOUSE_STORE_QUERY_KEY = 'warehouseStore';

// HOOK PARA LEER (GET ALL)
export const useFetchWarehouseStoreItems = () => {
  return useQuery<WarehouseStoreItem[], Error>({
    queryKey: [WAREHOUSE_STORE_QUERY_KEY],
    queryFn: fetchWarehouseStoreItems,
  });
};

// HOOK PARA CREAR (POST)
export const useCreateWarehouseStoreItem = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseStoreItem, Error, CreateWarehouseStorePayload>({
    mutationFn: createWarehouseStoreItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WAREHOUSE_STORE_QUERY_KEY] });
    },
  });
};

// HOOK PARA ACTUALIZAR (PUT)
export const useUpdateWarehouseStoreItem = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseStoreItem, Error, { id: string; payload: UpdateWarehouseStorePayload }>({
    mutationFn: ({ id, payload }) => updateWarehouseStoreItem(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WAREHOUSE_STORE_QUERY_KEY] });
    },
  });
};

// HOOK PARA ELIMINAR (DELETE)
export const useDeleteWarehouseStoreItem = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteWarehouseStoreItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WAREHOUSE_STORE_QUERY_KEY] });
    },
  });
};