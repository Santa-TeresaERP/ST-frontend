import api from '@/core/config/client';
import { WarehouseMovementProductAttributes } from '../types/movementProduct';

export const getMovements = async (): Promise<WarehouseMovementProductAttributes[]> => {
  const response = await api.get<WarehouseMovementProductAttributes[]>('/warehouseMovementProduct');
  return response.data;
};

export const createMovement = async (
  data: Omit<WarehouseMovementProductAttributes, 'id' | 'createdAt' | 'updatedAt'>
): Promise<WarehouseMovementProductAttributes> => {
  const response = await api.post<WarehouseMovementProductAttributes>('/warehouseMovementProduct', data);
  return response.data;
};

export const updateMovement = async (
  id: string,
  data: Partial<WarehouseMovementProductAttributes>
): Promise<WarehouseMovementProductAttributes> => {
  const response = await api.patch<WarehouseMovementProductAttributes>(`/warehouseMovementProduct/${id}`, data);
  return response.data;
};

export const deleteMovement = async (id: string): Promise<void> => {
  await api.delete(`/warehouseMovementProduct/${id}`);
};