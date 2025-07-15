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

// Tipo específico para crear movimientos (exactamente como lo espera el backend)
export type CreateMovementProductPayload = {
  warehouse_id: string;           // UUID válido, obligatorio
  store_id?: string | null;       // String simple, opcional (ej: "Tienda Centro", "Sucursal Norte")
  product_id: string;             // UUID válido, obligatorio
  movement_type: "entrada" | "salida";  // Solo estas dos opciones exactas
  quantity: number;               // Número no negativo (>= 0)
  movement_date: string | Date;   // Fecha válida
  observations?: string;          // String opcional, máximo 150 caracteres
};

export const createMovement = async (
  data: CreateMovementProductPayload
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