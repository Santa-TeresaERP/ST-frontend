import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchRecipes,
  fetchRecipeById,
  fetchRecipeByProd,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../action/recipes';
import {
  Recipe,
  CreateRecipePayload,
  UpdateRecipePayload,
} from '../types/recipes';

export const useFetchRecipes = () => {
  return useQuery<Recipe[], Error>({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });
};

export const useFetchRecipeById = (id: string) => {
  return useQuery<Recipe, Error>({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipeById(id),
    enabled: !!id,
  });
};

export const useFetchRecipeByProductId = (productId: string) => {
  return useQuery<Recipe[], Error>({
    queryKey: ['recipe', 'product', productId],
    queryFn: () => fetchRecipeByProd(productId),
    enabled: !!productId,
  });
}

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation<Recipe, Error, CreateRecipePayload>({
    mutationFn: createRecipe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recipes'] }),
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation<Recipe, Error, { id: string; payload: UpdateRecipePayload }>({
    mutationFn: ({ id, payload }) => updateRecipe(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: 'recipes' })
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; }>({
    mutationFn: ({ id }) => deleteRecipe(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: 'recipes' })
  });
};