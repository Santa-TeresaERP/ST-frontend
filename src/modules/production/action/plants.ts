import api from '@/core/config/client';
import { Plant, CreatePlantPayload, UpdatePlantPayload } from '../types/plants';

export const fetchPlants = async (): Promise<Plant[]> => {
  const response = await api.get<Plant[]>('/plants');
  return response.data;
};

export const createPlant = async (payload: CreatePlantPayload): Promise<Plant> => {
  const response = await api.post<Plant>('/plants', payload);
  return response.data;
};

export const updatePlant = async (id: string, payload: UpdatePlantPayload): Promise<Plant> => {
  const response = await api.patch<Plant>(`/plants/${id}`, payload);
  return response.data;
};

export const deletePlant = async (id: string): Promise<void> => {
  await api.delete(`/plants/${id}`);
};
