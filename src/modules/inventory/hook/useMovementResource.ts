import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WarehouseMovementResourceAttributes } from '../types/movementResource';
import {
  getResourceMovements,
  createResourceMovement,
  updateResourceMovement,
  deleteResourceMovement,
} from '../action/movementResource';

// Obtener movimientos de recursos
export const useFetchResourceMovements = () => {
  return useQuery<WarehouseMovementResourceAttributes[], Error>({
    queryKey: ['resourceMovements'],
    queryFn: getResourceMovements,
  });
};

// Crear movimiento de recurso
export const useCreateResourceMovement = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseMovementResourceAttributes, Error, Omit<WarehouseMovementResourceAttributes, 'createdAt' | 'updatedAt'>>({
    mutationFn: createResourceMovement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resourceMovements'] }),
  });
};

// Actualizar movimiento de recurso
export const useUpdateResourceMovement = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseMovementResourceAttributes, Error, { id: string; data: Partial<WarehouseMovementResourceAttributes> }>({
    mutationFn: ({ id, data }) => updateResourceMovement(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resourceMovements'] }),
  });
};

// Eliminar movimiento de recurso
export const useDeleteResourceMovement = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteResourceMovement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resourceMovements'] }),
  });
};