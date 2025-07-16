import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWarehouses, createWarehouse, updateWarehouse, deleteWarehouse, activateWarehouse } from '../action/warehouses';
import { WarehouseAttributes, CreateWarehousePayload, UpdateWarehousePayload } from '../types/warehouse';

// Hook para obtener todos los almacenes
export const useFetchWarehouses = () => {
  return useQuery<WarehouseAttributes[], Error>({
    queryKey: ['warehouses'],
    queryFn: fetchWarehouses,
  });
};

// Hook para crear un almacén
export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseAttributes, Error, CreateWarehousePayload>({
    mutationFn: createWarehouse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouses'] }),
  });
};

// Hook para actualizar un almacén
export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseAttributes, Error, { id: string; payload: UpdateWarehousePayload }>({
    mutationFn: ({ id, payload }) => updateWarehouse(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouses'] }),
  });
};

// Hook para eliminar un almacén (desactivar)
export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteWarehouse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouses'] }),
  });
};

// Hook para reactivar un almacén
export const useActivateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseAttributes, Error, string>({
    mutationFn: activateWarehouse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouses'] }),
  });
};