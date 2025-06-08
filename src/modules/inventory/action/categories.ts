import api from '@/core/config/client';
import type { SupplierCategory, CreateSupplierCategoryPayload, UpdateSupplierCategoryPayload } from '../types/categories';

export const fetchSupplierCategories = async (): Promise<SupplierCategory[]> => {
  const res = await api.get('/supplier-categories');
  return res.data;
};

export const createSupplierCategory = async (payload: CreateSupplierCategoryPayload): Promise<SupplierCategory> => {
  const res = await api.post('/supplier-categories', payload);
  return res.data;
};

export const updateSupplierCategory = async (id: string, payload: UpdateSupplierCategoryPayload): Promise<SupplierCategory> => {
  const res = await api.put(`/supplier-categories/${id}`, payload);
  return res.data;
};

export const deleteSupplierCategory = async (id: string): Promise<void> => {
  await api.delete(`/supplier-categories/${id}`);
};