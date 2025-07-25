import { CreateStoreRequest, UpdateStoreRequest, StoreAttributes, StoreResponse } from '../types/store.d';
import api from '@/core/config/client';

// Obtener todas las tiendas
export const fetchStores = async (page: number = 1, limit: number = 10): Promise<StoreResponse> => {
  try {
    const response = await api.get('/store', {
      params: { page, limit }
    });
    
    // Si la API devuelve directamente un array, transformarlo al formato esperado
    if (Array.isArray(response.data)) {
      return {
        stores: response.data,
        total: response.data.length,
        page,
        limit
      };
    }
    
    // Si ya viene con la estructura esperada
    return response.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

// Obtener una tienda por ID
export const fetchStoreById = async (id: string): Promise<StoreAttributes> => {
  const response = await api.get(`/store/${id}`);
  return response.data;
};

// Crear una nueva tienda
export const createStore = async (data: CreateStoreRequest): Promise<StoreAttributes> => {
  try {
    const response = await api.post('/store', data);  
    return response.data;
  } catch (error) {
    console.error('Error creating store:', error);
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown; status?: number } };
      console.error('Error response:', axiosError.response?.data);
      console.error('Error status:', axiosError.response?.status);
    }
    throw error;
  }
};

// Actualizar una tienda existente
export const updateStore = async (data: UpdateStoreRequest): Promise<StoreAttributes> => {
  const { id, ...updateData } = data;
  const response = await api.patch(`/store/${id}`, updateData);
  return response.data;
};

// Eliminar una tienda
export const deleteStore = async (id: string): Promise<void> => {

  await api.delete(`/store/${id}`);
};

// Buscar tiendas por nombre
export const searchStores = async (query: string): Promise<StoreAttributes[]> => {
  const response = await api.get('/store', {
    params: { search: query }
  });
  // Si la API devuelve paginado, extraer solo las tiendas
  return response.data.stores || response.data;
};
