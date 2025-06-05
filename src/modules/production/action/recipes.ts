import api from '@/core/config/client';
import {
  Recipe,
  CreateRecipePayload,
  UpdateRecipePayload,
} from '../types/recipes';

export const fetchRecipes = async (): Promise<Recipe[]> => {
  const response = await api.get<Recipe[]>('/recipeProductResource');
  return response.data;
};

export const fetchRecipeById = async (id: string): Promise<Recipe> => {
  const response = await api.get<Recipe>(`/recipeProductResource/${id}`);
  return response.data;
};

export const createRecipe = async (payload: CreateRecipePayload): Promise<Recipe> => {
  const response = await api.post<Recipe>('/recipeProductResource', payload);
  return response.data;
};

export const updateRecipe = async (id: string, payload: UpdateRecipePayload): Promise<Recipe> => {
  const response = await api.patch<Recipe>(`/recipeProductResource/${id}`, payload);
  return response.data;
};

export const deleteRecipe = async (id: string, product_id: string): Promise<void> => {
  await api.delete(`/recipes/${id}/${product_id}`);
};