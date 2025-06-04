import { z } from 'zod';

export const RecipeSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  resource_id: z.string().optional(),
  quantity_required: z.string(),
  unit: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Recipe = z.infer<typeof RecipeProductResourceSchema>;

export interface CreateRecipePayload {
  productId: string;
  resource_id?: string;  
  quantity: string;
  unit: string;
}

export interface UpdateRecipePayload {
  product_id?: string;
  resource_id: string;  
  quantity: string;
  unit: string;
}