import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  WarehouseMovementResource,
  CreateWarehouseMovementResourcePayload,
  UpdateWarehouseMovementResourcePayload,
} from '../types/movementResource';
import {
  fetchWarehouseMovementResources,
  createWarehouseMovementResource,
  updateWarehouseMovementResource,
  deleteWarehouseMovementResource,
} from '../action/movementResource';

export const useFetchWarehouseMovementResources = (filters: Record<string, unknown> = {}) =>
  useQuery<WarehouseMovementResource[], Error>({
    queryKey: ['warehouseMovementResource', filters],
    queryFn: () => fetchWarehouseMovementResources(filters),
  });

export const useCreateWarehouseMovementResource = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseMovementResource, Error, CreateWarehouseMovementResourcePayload>({
    mutationFn: createWarehouseMovementResource,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouseMovementResource'] }),
  });
};

export const useUpdateWarehouseMovementResource = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseMovementResource, Error, { id: string; payload: UpdateWarehouseMovementResourcePayload }>({
    mutationFn: ({ id, payload }) => updateWarehouseMovementResource(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouseMovementResource'] }),
  });
};

export const useDeleteWarehouseMovementResource = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteWarehouseMovementResource,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouseMovementResource'] }),
  });
};