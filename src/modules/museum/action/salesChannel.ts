import api from '@/core/config/client';
import { SalesChannel } from '../types/salesChannel';

const BASE_URL = '/sales_channel';

export const getSalesChannels = async (): Promise<SalesChannel[]> => {
  const res = await api.get<SalesChannel[]>(BASE_URL);
  return res.data;
};

export const getSalesChannel = async (id: string): Promise<SalesChannel> => {
  const res = await api.get<SalesChannel>(`${BASE_URL}/${id}`);
  return res.data;
};

export const createSalesChannel = async (data: Omit<SalesChannel, 'id'>): Promise<SalesChannel> => {
  const res = await api.post<SalesChannel>(BASE_URL, data);
  return res.data;
};

export const updateSalesChannel = async (id: string, data: Partial<SalesChannel>): Promise<SalesChannel> => {
  const res = await api.patch<SalesChannel>(`${BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteSalesChannel = async (id: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
}; 