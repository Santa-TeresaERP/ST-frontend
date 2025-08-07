import api from '@/core/config/client';
import { CreateProductionPayload, Production, UpdateProductionPayload } from '../types/productions';

export const fetchProductions = async (): Promise<Production[]> => {
  const response = await api.get<Production[]>('/productions');
  return response.data;
};

export const createProduction = async (payload: CreateProductionPayload): Promise<Production> => {
  const response = await api.post<Production>('/productions', payload);
  return response.data;
};

export const updateProduction = async (id: string, payload: UpdateProductionPayload): Promise<Production> => {
  const response = await api.patch<Production>(`/productions/${id}`, payload);
  return response.data;
};

// action/productions.ts
 export const toggleProduction = async ({ id, isActive }: { id: string; isActive: boolean }) => {
  const res = await api.patch<Production>(`/productions/${id}/status`, { isActive });
  return res.data;
};
