import api from '@/core/config/client';
import type {
  WarehouseMovementResource,
  CreateWarehouseMovementResourcePayload,
  UpdateWarehouseMovementResourcePayload,
} from '../types/movementResource';

export const fetchWarehouseMovementResources = async (): Promise<WarehouseMovementResource[]> => {
  const res = await api.get('/warehouseMovementResource');
  return res.data;
};

export const createWarehouseMovementResource = async (
  payload: CreateWarehouseMovementResourcePayload
): Promise<WarehouseMovementResource> => {
  const res = await api.post('/warehouseMovementResource', payload);
  return res.data;
};

export const updateWarehouseMovementResource = async (
  id: string,
  payload: UpdateWarehouseMovementResourcePayload
): Promise<WarehouseMovementResource> => {
  const res = await api.patch(`/warehouseMovementResource/${id}`, payload);
  return res.data;
};

export const deleteWarehouseMovementResource = async (id: string): Promise<void> => {
  await api.delete(`/warehouseMovementResource/${id}`);
};