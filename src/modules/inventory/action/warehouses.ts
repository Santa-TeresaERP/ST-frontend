import api from '@/core/config/client';
import { WarehouseAttributes, CreateWarehousePayload, UpdateWarehousePayload } from '../types/warehouse';

// Obtener todos los almacenes
export const fetchWarehouses = async (): Promise<WarehouseAttributes[]> => {
  const response = await api.get<WarehouseAttributes[]>('/warehouses');
  return response.data;
};

// Crear un nuevo almacén
export const createWarehouse = async (payload: CreateWarehousePayload): Promise<WarehouseAttributes> => {
  const response = await api.post<WarehouseAttributes>('/warehouses', payload);
  return response.data;
};

// Actualizar un almacén existente
export const updateWarehouse = async (id: string, payload: UpdateWarehousePayload): Promise<WarehouseAttributes> => {
  const response = await api.patch<WarehouseAttributes>(`/warehouses/${id}`, payload);
  return response.data;
};

// Eliminar un almacén (desactivar)
export const deleteWarehouse = async (id: string): Promise<void> => {
  await api.put(`/warehouses/${id}`);
};

// Reactivar un almacén 
export const activateWarehouse = async (id: string): Promise<WarehouseAttributes> => {
  const response = await api.patch<WarehouseAttributes>(`/warehouses/${id}/activate`);
  return response.data;
};