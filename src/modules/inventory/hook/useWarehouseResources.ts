/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchWarehouseResources,
  getWarehouseResource,
  createWarehouseResource,
  updateWarehouseResource,
  deleteWarehouseResource,
} from '../action/warehouseResource';
import { WarehouseResourceAttributes } from '../types/warehouseResource';

// Hook para obtener todos los recursos del almacén
export const useFetchWarehouseResources = () => {
  return useQuery<WarehouseResourceAttributes[], Error>({
    queryKey: ['warehouseResources'],
    queryFn: fetchWarehouseResources,
  });
};

// Hook para obtener un recurso del almacén por ID
export const useFetchWarehouseResource = (id: string) => {
  return useQuery<WarehouseResourceAttributes, Error>({
    queryKey: ['warehouseResource', id],
    queryFn: () => getWarehouseResource(id),
    enabled: !!id, // Solo ejecutar si el ID es válido
    retry: false, // No reintentar automáticamente si hay un error
    // Error handling can be done globally or within the component using this hook
  });
};

// Hook para crear un recurso del almacén
export const useCreateWarehouseResource = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseResourceAttributes, Error, Omit<WarehouseResourceAttributes, 'id'>>({
    mutationFn: createWarehouseResource,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouseResources'] }),
  });
};

// Hook para actualizar un recurso del almacén
export const useUpdateWarehouseResource = () => {
  const queryClient = useQueryClient();
  return useMutation<
    WarehouseResourceAttributes,
    Error,
    { id: string; data: Partial<Omit<WarehouseResourceAttributes, 'id'>> }
  >({
    mutationFn: ({ id, data }) => updateWarehouseResource(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouseResources'] }),
  });
};

// Hook para eliminar un recurso del almacén
export const useDeleteWarehouseResource = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteWarehouseResource,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warehouseResources'] }),
  });
};