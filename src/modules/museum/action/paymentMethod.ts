import  { PaymentMethod } from '@/modules/museum/types/paymentMethod';

const BASE_URL = '/payment_method';

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error al obtener métodos de pago');
  return res.json();
};

export const getPaymentMethod = async (id: string): Promise<PaymentMethod> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener el método de pago');
  return res.json();
};

export const createPaymentMethod = async (data: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear método de pago');
  return res.json();
};

export const updatePaymentMethod = async (id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar método de pago');
  return res.json();
};

export const deletePaymentMethod = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar método de pago');
};
