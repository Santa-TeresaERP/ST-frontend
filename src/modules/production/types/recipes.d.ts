import { z } from 'zod';

export const RecipeSchema = z.object({
  id: z.string(),
  productId: z.string(),
  resourceId: z.string().optional(),
  quantity: z.number(),
  unit: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Recipe = z.infer<typeof RecipeProductResourceSchema>;

export interface CreateRecipePayload {
  productId: string;
  resourceId?: string;  
  quantity: number;
  unit: string;
}

export interface UpdateRecipePayload {
  productId?: string;
  resourceId: string;  
  quantity: number;
  unit: string;
}