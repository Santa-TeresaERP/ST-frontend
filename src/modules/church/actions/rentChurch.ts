import api from '@/core/config/client';
import { RentChurch, CreateRentChurchPayload, UpdateRentChurchPayload } from '../types/rentChurch';

// Obtener todas las reservas de iglesia
export const fetchRentChurches = async (): Promise<RentChurch[]> => {
  try {
    const response = await api.get('/rent-church');
    
    let rawRentChurches = [];
    
    // Manejar diferentes estructuras de respuesta
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      rawRentChurches = response.data.data;
    } else if (Array.isArray(response.data)) {
      rawRentChurches = response.data;
    } else {
      console.warn('⚠️ Unexpected rent churches response structure:', response.data);
      return [];
    }

    return rawRentChurches;
  } catch (error) {
    console.error('❌ Error fetching rent churches:', error);
    return [];
  }
};

// Obtener una reserva de iglesia por ID
export const fetchRentChurchById = async (id: string): Promise<RentChurch | null> => {
  try {
    const response = await api.get(`/rent-church/${id}`);
    
    if (response.data && response.data.data) {
      return response.data.data;
    } else if (response.data) {
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error fetching rent church by ID:', error);
    return null;
  }
};

// Crear una nueva reserva de iglesia
export const createRentChurch = async (rentChurchData: CreateRentChurchPayload): Promise<RentChurch> => {
  try {
    const response = await api.post('/rent-church', rentChurchData);
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error creating rent church:', error);
    throw error;
  }
};

// Actualizar una reserva de iglesia existente
export const updateRentChurch = async (
  id: string,
  rentChurchData: UpdateRentChurchPayload
): Promise<RentChurch> => {
  try {
    const response = await api.patch(`/rent-church/${id}`, rentChurchData);
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error updating rent church:', error);
    throw error;
  }
};

// Desactivar (soft delete) una reserva de iglesia
export const deleteRentChurch = async (id: string): Promise<void> => {
  try {
    await api.put(`/rent-church/${id}`);
  } catch (error) {
    console.error('❌ Error deleting rent church:', error);
    throw error;
  }
};
