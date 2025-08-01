import api from '@/core/config/client';
import { Rental, CreateRentalPayload, UpdateRentalPayload } from '../types/rentals';

export const fetchAllRentals = async (): Promise<Rental[]> => {
  const response = await api.get<Rental[]>('/rentals');
  return response.data;
};

export const fetchRentalById = async (id: string): Promise<Rental> => {
  const response = await api.get<Rental>(`/rentals/${id}`);
  return response.data;
};

export const createRental = async (payload: CreateRentalPayload): Promise<Rental> => {
  const response = await api.post<Rental>('/rentals', payload);
  return response.data;
};

export const updateRental = async (id: string, payload: UpdateRentalPayload): Promise<Rental> => {
  const response = await api.patch<Rental>(`/rentals/${id}`, payload);
  return response.data;
};

export const deleteRental = async (id: string): Promise<void> => {
  await api.delete(`/rentals/${id}`);
};
