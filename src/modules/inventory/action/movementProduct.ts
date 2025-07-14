import api from '@/core/config/client';
import { WarehouseMovementProductAttributes } from '../types/movementProduct';

type MovementFilters = {
  product_id?: string;
  store_id?: string;
  movement_type?: string;
  movement_date?: string;
};

export const getMovements = async (filters: MovementFilters): Promise<WarehouseMovementProductAttributes[]> => {
  const params = new URLSearchParams();
  if (filters.product_id) params.append('product_id', filters.product_id);
  if (filters.store_id) params.append('store_id', filters.store_id);
  if (filters.movement_type) params.append('movement_type', filters.movement_type);
  if (filters.movement_date) params.append('movement_date', filters.movement_date);

  const response = await api.get<WarehouseMovementProductAttributes[]>(`/warehouseMovementProduct`, { params });
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