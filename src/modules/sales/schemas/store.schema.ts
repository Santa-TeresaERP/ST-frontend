import { z } from 'zod';

export const createStoreSchema = z.object({
  store_name: z
    .string()
    .min(1, 'El nombre de la tienda es obligatorio')
    .max(100, 'El nombre de la tienda no puede exceder 100 caracteres'),
  address: z
    .string()
    .min(1, 'La dirección es obligatoria')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  observations: z
    .string()
    .max(500, 'Las observaciones no pueden exceder 500 caracteres')
    .optional()
});

export const updateStoreSchema = z.object({
  id: z.string().uuid('ID de tienda inválido'),
  store_name: z
    .string()
    .min(1, 'El nombre de la tienda es obligatorio')
    .max(100, 'El nombre de la tienda no puede exceder 100 caracteres')
    .optional(),
  address: z
    .string()
    .min(1, 'La dirección es obligatoria')
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .optional(),
  observations: z
    .string()
    .max(500, 'Las observaciones no pueden exceder 500 caracteres')
    .optional()
});

export const storeIdSchema = z.object({
  id: z.string().uuid('ID de tienda inválido')
});

export type CreateStoreForm = z.infer<typeof createStoreSchema>;
export type UpdateStoreForm = z.infer<typeof updateStoreSchema>;
export type StoreIdForm = z.infer<typeof storeIdSchema>;
