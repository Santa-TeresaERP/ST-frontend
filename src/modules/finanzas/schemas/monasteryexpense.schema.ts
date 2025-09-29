import { z } from 'zod';

export const monasteryExpenseSchema = z.object({
  id: z.string().uuid().optional(),
  category: z.string(),
  amount: z.number(),
  Name: z.string(),
  date: z.coerce.date(),
  descripción: z.string(),
  overheadsId: z.string().optional().default(''), // Permitir vacío y establecer como opcional
});

export const createMonasteryExpenseSchema = monasteryExpenseSchema.omit({ id: true });

export const updateMonasteryExpenseSchema = createMonasteryExpenseSchema.partial();