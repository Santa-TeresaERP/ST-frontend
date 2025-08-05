import api from '@/core/config/client';
import { Place, CreatePlacePayload, UpdatePlacePayload } from '../types/places';

export const fetchPlaces = async (): Promise<Place[]> => {
  const response = await api.get<Place[]>('/places');
  return response.data;
};

export const fetchPlace = async (id: string): Promise<Place> => {
  const response = await api.get<Place>(`/places/${id}`);
  return response.data;
};

export const createPlace = async (payload: CreatePlacePayload): Promise<Place> => {
  const response = await api.post<Place>('/places', payload);
  return response.data;
};

export const updatePlace = async (id: string, payload: UpdatePlacePayload): Promise<Place> => {
  const response = await api.patch<Place>(`/places/${id}`, payload);
  return response.data;
};

export const deletePlace = async (id: string): Promise<void> => {
  await api.delete(`/places/${id}`);
};
