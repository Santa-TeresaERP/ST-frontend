import api from '@/core/config/client';
import { WarehouseMovementProductAttributes } from '../types/movementProduct';

type MovementFilters = {
  product_id?: string;
  store_id?: string;
  movement_type?: string;
  start_date?: string;
  end_date?: string;
};

export const getMovements = async (filters: MovementFilters): Promise<WarehouseMovementProductAttributes[]> => {
  const params = Object.entries(filters).reduce((acc, [key, value]) => {
    if (value) acc.append(key, value);
    return acc;
  }, new URLSearchParams());

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