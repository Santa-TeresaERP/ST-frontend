import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WarehouseMovementProductAttributes } from '../types/movementProduct';
import { getMovements, createMovement, updateMovement, deleteMovement } from '../action/movementProduct';

// Obtener movimientos
export const useFetchMovements = () => {
  return useQuery<WarehouseMovementProductAttributes[], Error>({
    queryKey: ['movements'],
    queryFn: getMovements,
  });
};

// Crear movimiento
export const useCreateMovement = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseMovementProductAttributes, Error, Omit<WarehouseMovementProductAttributes, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: createMovement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['movements'] }),
  });
};

// Actualizar movimiento
export const useUpdateMovement = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseMovementProductAttributes, Error, { id: string; data: Partial<WarehouseMovementProductAttributes> }>({
    mutationFn: ({ id, data }) => updateMovement(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['movements'] }),
  });
};

// Eliminar movimiento
export const useDeleteMovement = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteMovement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['movements'] }),
  });
};