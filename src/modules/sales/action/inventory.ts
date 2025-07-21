import api from '@/core/config/client'; // Tu cliente API que debe manejar la autorización
import { 
  WarehouseStoreItem, 
  CreateWarehouseStorePayload, 
  UpdateWarehouseStorePayload 
} from '../types/inventory.types';

// El endpoint correcto, en plural, como se define en las rutas del backend.
const WAREHOUSE_ENDPOINT = '/warehouseStores';

/**
 * Llama a: GET /warehouseStores
 * Obtiene todos los artículos del inventario.
 */
export const fetchWarehouseStoreItems = async (): Promise<WarehouseStoreItem[]> => {
  const response = await api.get<WarehouseStoreItem[]>(WAREHOUSE_ENDPOINT);
  return response.data;
};

/**
 * Llama a: POST /warehouseStores
 * Crea un nuevo registro en el inventario.
 */
export const createWarehouseStoreItem = async (payload: CreateWarehouseStorePayload): Promise<WarehouseStoreItem> => {
  const response = await api.post<WarehouseStoreItem>(WAREHOUSE_ENDPOINT, payload);
  return response.data;
};

/**
 * Llama a: PUT /warehouseStores/:id
 * Actualiza un registro existente. Usamos 'put' para que coincida con `router.put`.
 */
export const updateWarehouseStoreItem = async (id: string, payload: UpdateWarehouseStorePayload): Promise<WarehouseStoreItem> => {
  const response = await api.put<WarehouseStoreItem>(`${WAREHOUSE_ENDPOINT}/${id}`, payload);
  return response.data;
};

/**
 * Llama a: DELETE /warehouseStores/:id
 * Elimina un registro del inventario.
 */
export const deleteWarehouseStoreItem = async (id: string): Promise<void> => {
  await api.delete(`${WAREHOUSE_ENDPOINT}/${id}`);
};