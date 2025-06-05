import api from '@/core/config/client';
import { CreateProductPayload, Product, UpdateProductPayload } from '../types/products';

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};

export const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
  const response = await api.post<Product>('/products', payload);
  return response.data;
};

export const updateProduct = async (id: string, payload: UpdateProductPayload): Promise<Product> => {
  const response = await api.patch<Product>(`/products/${id}`, payload);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};