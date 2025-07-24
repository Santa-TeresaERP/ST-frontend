import api from '@/core/config/client';
import { PaymentMethod } from '../types/paymentMethod';

const BASE_URL = '/paymentMethod';

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const res = await api.get<PaymentMethod[]>(BASE_URL);
  return res.data;
};

export const getPaymentMethod = async (id: string): Promise<PaymentMethod> => {
  const res = await api.get<PaymentMethod>(`${BASE_URL}/${id}`);
  return res.data;
};

export const createPaymentMethod = async (data: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
  const res = await api.post<PaymentMethod>(BASE_URL, data);
  return res.data;
};

export const updatePaymentMethod = async (id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  const res = await api.patch<PaymentMethod>(`${BASE_URL}/${id}`, data);
  return res.data;
};

export const deletePaymentMethod = async (id: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};
