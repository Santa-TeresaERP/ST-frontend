import api from '@/core/config/client';
import { WarehouseMovementResourceAttributes } from '../types/movementResource';

// GET: Obtener todos los movimientos de recursos
export const getResourceMovements = async (): Promise<WarehouseMovementResourceAttributes[]> => {
  const response = await api.get<WarehouseMovementResourceAttributes[]>('/warehouseMovementResource');
  return response.data;
};

// POST: Crear movimiento de recurso
export const createResourceMovement = async (
  data: Omit<WarehouseMovementResourceAttributes, 'createdAt' | 'updatedAt'>
): Promise<WarehouseMovementResourceAttributes> => {
  const response = await api.post<WarehouseMovementResourceAttributes>('/warehouseMovementResource', data);
  return response.data;
};

// PATCH: Actualizar movimiento de recurso
export const updateResourceMovement = async (
  id: string,
  data: Partial<WarehouseMovementResourceAttributes>
): Promise<WarehouseMovementResourceAttributes> => {
  const response = await api.patch<WarehouseMovementResourceAttributes>(`/warehouseMovementResource/${id}`, data);
  return response.data;
};

// DELETE: Eliminar movimiento de recurso
export const deleteResourceMovement = async (id: string): Promise<void> => {
  await api.delete(`/warehouseMovementResource/${id}`);
};