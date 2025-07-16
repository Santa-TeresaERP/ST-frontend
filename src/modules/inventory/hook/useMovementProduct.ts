import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WarehouseMovementProductAttributes } from '../types/movementProduct';
import { getMovements, createMovement, updateMovement, deleteMovement, CreateMovementProductPayload } from '../action/movementProduct';

// Obtener movimientos
export const useFetchMovements = (filters: Record<string, unknown> = {}) => {
  return useQuery<WarehouseMovementProductAttributes[], Error>({
    queryKey: ['movements', filters],
    queryFn: () => getMovements(filters),
  });
};

// Crear movimiento
export const useCreateMovement = () => {
  const queryClient = useQueryClient();
  return useMutation<WarehouseMovementProductAttributes, Error, CreateMovementProductPayload>({
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