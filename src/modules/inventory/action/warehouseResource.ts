/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/core/config/client';
import { WarehouseResourceAttributes } from '../types/warehouseResource';

// GET: Fetch all warehouse resources
export const fetchWarehouseResources = async (): Promise<WarehouseResourceAttributes[]> => {
  const response = await api.get<WarehouseResourceAttributes[]>('/warehouseResource');
  return response.data;
};

// GET: Fetch a single warehouse resource by ID
export const getWarehouseResource = async (id: string): Promise<WarehouseResourceAttributes> => {
  try {
    const response = await api.get<WarehouseResourceAttributes>(`/warehouseResource/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('El recurso del almacén no existe.');
    }
    console.error('Error al obtener el recurso del almacén:', error);
    throw new Error('Error al obtener el recurso del almacén. Por favor, inténtelo de nuevo.');
  }
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
    console.error('Error al actualizar el recurso del almacén:', error);
    throw new Error('Error al actualizar el recurso del almacén. Por favor, inténtelo de nuevo.');
  }
};

// DELETE: Delete a warehouse resource
export const deleteWarehouseResource = async (id: string): Promise<void> => {
  await api.delete(`/warehouseResource/${id}`);
};