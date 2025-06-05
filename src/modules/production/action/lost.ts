import api from '@/core/config/client';
import { Lost, CreateLostPayload, UpdateLostPayload } from '../types/lost';

export const fetchAllLost = async (): Promise<Lost[]> => {
  const response = await api.get<Lost[]>('/lost');
  return response.data;
};

export const fetchLostById = async (id: string): Promise<Lost> => {
  const response = await api.get<Lost>(`/lost/${id}`);
  return response.data;
};

export const createLost = async (payload: CreateLostPayload): Promise<Lost> => {
  const response = await api.post<Lost>('/lost', payload);
  return response.data;
};

export const updateLost = async (id: string, payload: UpdateLostPayload): Promise<Lost> => {
  const response = await api.patch<Lost>(`/lost/${id}`, payload);
  return response.data;
};

export const deleteLost = async (id: string): Promise<void> => {
  await api.delete(`/lost/${id}`);
};