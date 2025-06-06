import api from '@/core/config/client';
import {
  Recipe,
  CreateRecipePayload,
  UpdateRecipePayload,
} from '../types/recipes';

export const fetchRecipes = async (): Promise<Recipe[]> => {
  const response = await api.get<Recipe[]>('/recipes');
  return response.data;
};

export const fetchRecipeById = async (id: string): Promise<Recipe> => {
  const response = await api.get<Recipe>(`/recipes/${id}`);
  return response.data;
};

export const fetchRecipeByProd = async (productId: string): Promise<Recipe[]> => {
  const response = await api.get<Recipe[]>(`/recipes/byProduct/${productId}`);
  return response.data;
}

export const createRecipe = async (payload: CreateRecipePayload): Promise<Recipe> => {
  const response = await api.post<Recipe>('/recipes', payload);
  return response.data;
};

export const updateRecipe = async (id: string, payload: UpdateRecipePayload): Promise<Recipe> => {
  const response = await api.patch<Recipe>(`/recipes/${id}`, payload);
  return response.data;
};

export const deleteRecipe = async (id: string): Promise<void> => {
  await api.delete(`/recipes/${id}`);
};