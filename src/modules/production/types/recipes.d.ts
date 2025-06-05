import { z } from 'zod';

export const RecipeSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  quantity_required: z.string(),
  unit: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Recipe = z.infer<typeof RecipeProductResourceSchema>;

export interface CreateRecipePayload {
  product_id: string;
  quantity_required: string;
  unit: string;
  resource_id?: string;
}

export interface UpdateRecipePayload {
  product_id?: string;
  quantity_required: string;
  unit: string;
  resource_id: string;
}