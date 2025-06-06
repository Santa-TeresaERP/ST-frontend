import api from '@/core/config/client';
import type { Supplier, CreateSupplierPayload, UpdateSupplierPayload } from '../types/suppliers';

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  const res = await api.get('/supplier'); // <-- SINGULAR
  return res.data;
};

export const createSupplier = async (payload: CreateSupplierPayload): Promise<Supplier> => {
  const res = await api.post('/supplier', payload); // <-- SINGULAR
  return res.data;
};

export const updateSupplier = async (id: string, payload: UpdateSupplierPayload): Promise<Supplier> => {
  const res = await api.put(`/supplier/${id}`, payload); // <-- SINGULAR
  return res.data;
};

export const deleteSupplier = async (id: string): Promise<void> => {
  await api.delete(`/supplier/${id}`); // <-- SINGULAR
};
