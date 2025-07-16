import api from "@/core/config/client";
import { 
  StoreAttributes, 
  CreateStorePayload, 
  UpdateStorePayload,
  SingleStoreResponse 
} from "../types/store";

const BASE_URL = "/store";

// Obtener todas las tiendas
export const fetchStores = async (): Promise<StoreAttributes[]> => {
  try {
    console.log('🌐 Making API call to:', BASE_URL);
    const response = await api.get(BASE_URL);
    console.log('📡 Raw API Response:', response);
    console.log('📦 Response data:', response.data);
    
    // Manejar diferentes formatos de respuesta
    let stores: StoreAttributes[] = [];
    
    if (Array.isArray(response.data)) {
      // El backend devuelve directamente un array
      stores = response.data;
      console.log('📋 Direct array format detected');
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      // El backend devuelve {data: [stores]}
      stores = response.data.data;
      console.log('📋 Wrapped array format detected');
    } else {
      console.warn('⚠️ Unexpected response format:', response.data);
      stores = [];
    }
    
    console.log('🏪 Processed stores:', stores);
    console.log('📊 Total stores:', stores.length);
    return stores;
  } catch (error: unknown) {
    console.error("❌ Error fetching stores:", error);
    const errorDetails = error as { message?: string; response?: { status?: number; data?: unknown } };
    console.error("📊 Error details:", {
      message: errorDetails?.message,
      status: errorDetails?.response?.status,
      data: errorDetails?.response?.data,
      url: BASE_URL
    });
    // Retornar array vacío en lugar de lanzar error
    return [];
  }
};

// Obtener tienda por ID
export const fetchStoreById = async (id: string): Promise<StoreAttributes> => {
  try {
    const response = await api.get<SingleStoreResponse>(`${BASE_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching store by ID:", error);
    throw new Error("No se pudo cargar la tienda");
  }
};

// Crear nueva tienda
export const createStore = async (payload: CreateStorePayload): Promise<StoreAttributes> => {
  try {
    console.log('🏗️ Creating store with payload:', payload);
    console.log('🌐 Making POST request to:', BASE_URL);
    
    const response = await api.post(BASE_URL, payload);
    
    console.log('✅ Store creation response:', response);
    console.log('📦 Response data:', response.data);
    
    // Manejar diferentes formatos de respuesta
    let createdStore: StoreAttributes;
    
    if (response.data?.data) {
      // Formato {data: store}
      createdStore = response.data.data;
      console.log('📋 Wrapped format detected');
    } else if (response.data?.id) {
      // Formato directo {id, store_name, ...}
      createdStore = response.data;
      console.log('📋 Direct format detected');
    } else {
      console.error('⚠️ Unexpected create response format:', response.data);
      throw new Error('Formato de respuesta inesperado');
    }
    
    console.log('🏪 Created store:', createdStore);
    return createdStore;
  } catch (error: unknown) {
    console.error("❌ Error creating store:", error);
    const errorDetails = error as { message?: string; response?: { status?: number; data?: unknown } };
    console.error("📊 Create error details:", {
      message: errorDetails?.message,
      status: errorDetails?.response?.status,
      data: errorDetails?.response?.data,
      url: BASE_URL,
      payload
    });
    throw new Error("No se pudo crear la tienda");
  }
};

// Actualizar tienda (usando PATCH como especifica el backend)
export const updateStore = async (payload: UpdateStorePayload): Promise<StoreAttributes> => {
  try {
    const { id, ...updateData } = payload;
    const response = await api.patch<SingleStoreResponse>(`${BASE_URL}/${id}`, updateData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating store:", error);
    throw new Error("No se pudo actualizar la tienda");
  }
};

// Eliminar tienda
export const deleteStore = async (id: string): Promise<void> => {
  try {
    await api.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting store:", error);
    throw new Error("No se pudo eliminar la tienda");
  }
};
