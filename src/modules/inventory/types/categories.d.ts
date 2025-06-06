import { z } from 'zod';

export const SupplierCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type SupplierCategory = z.infer<typeof SupplierCategorySchema>;

export interface CreateSupplierCategoryPayload {
  name: string;
  description: string;
}

export interface UpdateSupplierCategoryPayload {
  name?: string;
  description?: string;
}
