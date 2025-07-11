import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.boolean(), 
  description: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Category = z.infer<typeof CategorySchema>;

export interface CreateCategoryPayload {
  name: string;
  description: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  status?: boolean;   // ← ya estaba
}