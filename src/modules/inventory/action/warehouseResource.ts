import api from '@/core/config/client';
import { WarehouseResourceAttributes } from '../types/warehouseResource';

// GET: Fetch all warehouse resources
export const fetchWarehouseResources = async (): Promise<WarehouseResourceAttributes[]> => {
  const response = await api.get<WarehouseResourceAttributes[]>('/warehouseResource');
  return response.data;
};

// GET: Fetch a single warehouse resource by ID
export const getWarehouseResource = async (id: string): Promise<WarehouseResourceAttributes> => {
  const response = await api.get<WarehouseResourceAttributes>(`/warehouseResource/${id}`);
  return response.data;
};

// POST: Create a warehouse resource
export const createWarehouseResource = async (
  data: Omit<WarehouseResourceAttributes, 'id'>
): Promise<WarehouseResourceAttributes> => {
  const response = await api.post<WarehouseResourceAttributes>('/warehouseResource', data);
  return response.data;
};

// PUT: Update a warehouse resource
export const updateWarehouseResource = async (
  id: string,
  data: Partial<Omit<WarehouseResourceAttributes, 'id'>>
): Promise<WarehouseResourceAttributes> => {
  try {
    const response = await api.put<WarehouseResourceAttributes>(`/warehouseResource/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating warehouse resource:', error);
    throw new Error('Failed to update warehouse resource. Please try again.');
  }
};

// DELETE: Delete a warehouse resource
export const deleteWarehouseResource = async (id: string): Promise<void> => {
  await api.delete(`/warehouseResource/${id}`);
};