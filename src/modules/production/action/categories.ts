import api from '@/core/config/client';
import { Category, CreateCategoryPayload, UpdateCategoryPayload } from '../types/categories';

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/categories');
  return response.data;
};

export const fetchCategory = async (id: string): Promise<Category> => {
  const response = await api.get<Category>(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (payload: CreateCategoryPayload): Promise<Category> => {
  const response = await api.post<Category>('/categories', payload);
  return response.data;
};

export const updateCategory = async (id: string, payload: UpdateCategoryPayload): Promise<Category> => {
  const response = await api.patch<Category>(`/categories/${id}`, payload);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};