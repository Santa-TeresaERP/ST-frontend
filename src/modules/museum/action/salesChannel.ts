import { SalesChannel } from '../types/salesChannel';

const BASE_URL = '/sales_channel';

export const getSalesChannels = async (): Promise<SalesChannel[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error al obtener canales de venta');
  return res.json();
};

export const getSalesChannel = async (id: string): Promise<SalesChannel> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener canal de venta');
  return res.json();
};

export const createSalesChannel = async (data: Omit<SalesChannel, 'id'>): Promise<SalesChannel> => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear canal de venta');
  return res.json();
};

export const updateSalesChannel = async (id: string, data: Partial<SalesChannel>): Promise<SalesChannel> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar canal de venta');
  return res.json();
};

export const deleteSalesChannel = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar canal de venta');
}; 