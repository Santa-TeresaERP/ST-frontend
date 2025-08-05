import api from '@/core/config/client';
import { Location } from '../types/location';

export const fetchLocations = async (): Promise<Location[]> => {
  try {
    const response = await api.get('/locations');
    
    // Manejar diferentes estructuras de respuesta de la API
    let locations: Location[] = [];
    
    // Caso 1: La API devuelve { data: Location[] }
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      locations = response.data.data;
    }
    // Caso 2: La API devuelve { locations: Location[] }
    else if (response.data && response.data.locations && Array.isArray(response.data.locations)) {
      locations = response.data.locations;
    }
    // Caso 3: La API devuelve Location[] directamente
    else if (Array.isArray(response.data)) {
      locations = response.data;
    }
    // Caso 4: response.data es el wrapper y locations está dentro
    else if (response.data && typeof response.data === 'object') {
      // Buscar cualquier propiedad que sea un array
      const keys = Object.keys(response.data);
      for (const key of keys) {
        if (Array.isArray(response.data[key])) {
          locations = response.data[key];
          break;
        }
      }
    }
    
    return locations;
  } catch (error) {
    console.error('❌ Error fetching locations:', error);
    throw error; // Permitir que React Query maneje el error
  }
};

export const getLocation = async (id: string): Promise<Location> => {
  const response = await api.get<Location>(`/locations/${id}`);
  return response.data;
};

export const createLocation = async (payload: Omit<Location, 'id'>): Promise<Location> => {
  const response = await api.post<Location>('/locations', payload);
  return response.data;
};

export const updateLocation = async (id: string, payload: Partial<Location>): Promise<Location> => {
  const response = await api.put<Location>(`/locations/${id}`, payload);
  return response.data;
};

export const deleteLocation = async (id: string): Promise<void> => {
  await api.delete(`/locations/${id}`);
};
