import api from '@/core/config/client';
import { Categorie, UpdateCategoriePayload, CreateCategoriePayload } from '../../production/types/categories';

export const fetchCategories = async (): Promise<Categorie[]> =>{
    const response = await api.get<Categorie[]>('/categories');
    return response.data;
}

export const createCategories = async (payload: UpdateCategoriePayload): Promise<Categorie> =>{
    const response = await api.post<Categorie>('/categories', payload);
    return response.data;
}

export const updateCategories = async (id: string, payload: CreateCategoriePayload): Promise<Categorie> =>{
    const response = await api.patch<Categorie>(`/categories/${id}`, payload);
    return response.data;
}

export const deleteCategories = async (id: string): Promise<void> =>{
    await api.delete(`/categories/${id}`);
}
