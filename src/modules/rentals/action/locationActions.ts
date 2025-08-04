import api from '@/core/config/client';
import { Location } from '../types/location';

export const fetchLocations = async (): Promise<Location[]> => {
  const response = await api.get<Location[]>('/locations');
  return response.data;
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
