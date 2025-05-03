import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchRecipes,
  fetchRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../action/recipes';
import {
  CreateRecipePayload,
  RecipeAttributes,
  UpdateRecipePayload,
} from '../types/recipes';

export const useFetchRecipes = () => {
  return useQuery<RecipeAttributes[], Error>({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });
};

export const useFetchRecipeById = (id: string) => {
  return useQuery<RecipeAttributes, Error>({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipeById(id),
    enabled: !!id,
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation<RecipeAttributes, Error, CreateRecipePayload>({
    mutationFn: createRecipe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recipes'] }),
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation<RecipeAttributes, Error, { id: string; payload: UpdateRecipePayload }>({
    mutationFn: ({ id, payload }) => updateRecipe(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: 'recipes' })
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; product_id: string }>({
    mutationFn: ({ id, product_id }) => deleteRecipe(id, product_id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: 'recipes' })
  });
};