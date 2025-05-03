import api from '@/core/config/client';
import {
  CreateRecipePayload,
  RecipeAttributes,
  UpdateRecipePayload,
} from '../types/recipes';

export const fetchRecipes = async (): Promise<RecipeAttributes[]> => {
  const response = await api.get<RecipeAttributes[]>('/recipes');
  return response.data;
};

export const fetchRecipeById = async (id: string): Promise<RecipeAttributes> => {
  const response = await api.get<RecipeAttributes>(`/recipes/${id}`);
  return response.data;
};

export const createRecipe = async (payload: CreateRecipePayload): Promise<RecipeAttributes> => {
  const response = await api.post<RecipeAttributes>('/recipes', payload);
  return response.data;
};

export const updateRecipe = async (id: string, payload: UpdateRecipePayload): Promise<RecipeAttributes> => {
  const response = await api.patch<RecipeAttributes>(`/recipes/${id}`, payload);
  return response.data;
};

export const deleteRecipe = async (id: string, product_id: string): Promise<void> => {
  await api.delete(`/recipes/${id}/${product_id}`);
};