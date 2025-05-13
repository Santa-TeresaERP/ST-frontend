import api from '@/core/config/client';
import { CreatePlantPayload, Plant, UpdatePlantPayload } from '../types/plantProductions';

export const fetchPlants = async (): Promise<Plant[]> => {
  const response = await api.get<Plant[]>('/plantProduction');
  return response.data;
};

export const createPlant = async (payload: CreatePlantPayload): Promise<Plant> => {
  const response = await api.post<Plant>('/plantProduction', payload);
  return response.data;
};

export const updatePlant = async (id: string, payload: UpdatePlantPayload): Promise<Plant> => {
  const response = await api.patch<Plant>(`/plantProduction/${id}`, payload);
  return response.data;
};

export const deletePlant = async (id: string): Promise<void> => {
  await api.delete(`/plantProduction/${id}`);
};