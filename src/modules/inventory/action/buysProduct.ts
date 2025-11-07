import api from '@/core/config/client';
import type { 
  BuysProductWithRelations, 
  CreateBuysProductPayload, 
  UpdateBuysProductPayload,
  BuysProductResponse 
} from '../types/buysProduct.d';

export const fetchBuysProducts = async (): Promise<BuysProductWithRelations[]> => {
  const response = await api.get('/buysProduct');
  
  // Manejo flexible de respuesta del backend
  if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return Array.isArray(response.data) ? response.data : [];
};


export const fetchAllBuysProducts = async (): Promise<BuysProductWithRelations[]> => {
  const response = await api.get('/buysProduct/all');
  
  if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return Array.isArray(response.data) ? response.data : [];
};


export const getBuysProduct = async (id: string): Promise<BuysProductWithRelations> => {
  const response = await api.get(`/buysProduct/${id}`);
  return response.data;
};


// IMPORTANTE: Si existe mismo warehouse_id + product_id, suma cantidades
export const createBuysProduct = async (payload: CreateBuysProductPayload): Promise<BuysProductResponse> => {
  const response = await api.post<BuysProductResponse>('/buysProduct', payload);
  return response.data;
};


export const updateBuysProduct = async (
  id: string, 
  payload: UpdateBuysProductPayload
): Promise<BuysProductWithRelations> => {
  const response = await api.patch<BuysProductWithRelations>(`/buysProduct/${id}`, payload);
  return response.data;
};

export const deleteBuysProduct = async (id: string): Promise<void> => {
  await api.put(`/buysProduct/${id}`, { status: false });
};

export const reactivateBuysProduct = async (id: string): Promise<void> => {
  await api.put(`/buysProduct/${id}`, { status: true });
};
