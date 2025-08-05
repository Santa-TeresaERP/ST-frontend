import api from '@/core/config/client';
import { Place, CreatePlacePayload, UpdatePlacePayload } from '../types/places';

export const fetchPlaces = async (location_id?: string): Promise<Place[]> => {
  const url = location_id ? `/places?location_id=${location_id}` : '/places';
  const response = await api.get<Place[]>(url);
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
