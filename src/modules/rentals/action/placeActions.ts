import api from '@/core/config/client';
import { Place } from '../types';

// Obtener todos los places
export const fetchPlaces = async (): Promise<Place[]> => {
  try {
    const response = await api.get('/places');
    
    let rawPlaces = [];
    
    // Manejar diferentes estructuras de respuesta
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      rawPlaces = response.data.data;
    } else if (Array.isArray(response.data)) {
      rawPlaces = response.data;
    } else {
      console.warn('⚠️ Unexpected places response structure:', response.data);
      return [];
    }

    // Transformar todos los places al formato del frontend
    const transformedPlaces = rawPlaces.map((rawPlace: Record<string, unknown>) => {
      return {
        id: rawPlace.id as string,
        nombre: (rawPlace.name as string) || '',
        area: (rawPlace.area as string) || '',
        location_id: rawPlace.location_id as string,
        createdAt: rawPlace.createdAt as string,
        updatedAt: rawPlace.updatedAt as string,
      };
    });

    return transformedPlaces;
  } catch (error) {
    console.error('❌ Error fetching places:', error);
    return [];
  }
};

// Obtener places por location_id (FILTRANDO EN FRONTEND)
export const fetchPlacesByLocation = async (locationId: string): Promise<Place[]> => {
  try {
    // Obtener TODOS los places del backend
    const response = await api.get('/places');
    
    let rawPlaces = [];
    
    // Manejar diferentes estructuras de respuesta
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      rawPlaces = response.data.data;
    } else if (Array.isArray(response.data)) {
      rawPlaces = response.data;
    } else {
      console.warn('⚠️ Unexpected places response structure:', response.data);
      return [];
    }

    // FILTRAR EN FRONTEND por location_id
    const filteredPlaces = rawPlaces.filter((place: Record<string, unknown>) => {
      const placeLocationId = place.location_id as string;
      return placeLocationId === locationId;
    });

    // Transformar los datos filtrados del backend al formato que espera el frontend
    const transformedPlaces = filteredPlaces.map((rawPlace: Record<string, unknown>) => {
      return {
        id: rawPlace.id as string,
        nombre: (rawPlace.name as string) || '',
        area: (rawPlace.area as string) || '',
        location_id: rawPlace.location_id as string,
        createdAt: rawPlace.createdAt as string,
        updatedAt: rawPlace.updatedAt as string,
      };
    });

    return transformedPlaces;
  } catch (error) {
    console.error('❌ Error fetching places by location:', {
      locationId,
      error: String(error)
    });
    return []; // Devolver array vacío en caso de error
  }
};

// Crear un nuevo place
export const createPlace = async (placeData: {
  nombre: string;
  area: string;
  location_id: string;
}): Promise<Place> => {
  try {
    // Transformar los datos del frontend al formato que espera el backend
    const backendPayload = {
      name: placeData.nombre,
      area: placeData.area,
      location_id: placeData.location_id,
    };

    const response = await api.post('/places', backendPayload);
    
    // Manejar diferentes estructuras de respuesta
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('❌ Error creating place:', error);
    throw error;
  }
};

// Actualizar un place
export const updatePlace = async (id: string, placeData: Partial<Place>): Promise<Place> => {
  try {
    const response = await api.put(`/places/${id}`, placeData);
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('❌ Error updating place:', error);
    throw error;
  }
};

// Eliminar un place
export const deletePlace = async (id: string): Promise<void> => {
  try {
    await api.delete(`/places/${id}`);
  } catch (error) {
    console.error('❌ Error deleting place:', error);
    throw error;
  }
};
