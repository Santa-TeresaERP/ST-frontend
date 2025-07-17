import api from '@/core/config/client';
import { salesAttributes } from '../types/sales';

export const fetchSales = async (): Promise<salesAttributes[]> => {
  const response = await api.get<salesAttributes[]>('/sales');
  return response.data;
};

export const fetchSale = async (id: string): Promise<salesAttributes> => {
  const response = await api.get<salesAttributes>(`/sales/${id}`);
  return response.data;
};

export const createSale = async (
  payload: Omit<salesAttributes, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<salesAttributes> => {
  const response = await api.post<salesAttributes>('/sales', payload);
  return response.data;
};

export const updateSale = async (
  id: string, 
  payload: Partial<Omit<salesAttributes, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<salesAttributes> => {
  const response = await api.patch<salesAttributes>(`/sales/${id}`, payload);
  return response.data;
};

export const deleteSale = async (id: string): Promise<void> => {
  await api.delete(`/sales/${id}`);
};