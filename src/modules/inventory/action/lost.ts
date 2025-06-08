import api from '@/core/config/client';
import type { SupplierLost, CreateSupplierLostPayload, UpdateSupplierLostPayload } from '../types/lost';

export const fetchSupplierLosts = async (): Promise<SupplierLost[]> => {
  const res = await api.get('/supplier-lost');
  return res.data;
};

export const createSupplierLost = async (payload: CreateSupplierLostPayload): Promise<SupplierLost> => {
  const res = await api.post('/supplier-lost', payload);
  return res.data;
};

export const updateSupplierLost = async (id: string, payload: UpdateSupplierLostPayload): Promise<SupplierLost> => {
  const res = await api.put(`/supplier-lost/${id}`, payload);
  return res.data;
};

export const deleteSupplierLost = async (id: string): Promise<void> => {
  await api.delete(`/supplier-lost/${id}`);
};
