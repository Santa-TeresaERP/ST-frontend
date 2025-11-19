import { z } from 'zod';

/**
 * Schema de validación para el formulario de CREACIÓN de un Producto Comprado.
 */
export const createProductPurchasedSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres.'),
  
  description: z.string().optional(),
});

/**
 * Schema de validación para el formulario de EDICIÓN.
 * Todos los campos son opcionales.
 */
export const updateProductPurchasedSchema = createProductPurchasedSchema.partial();

/**
 * Inferimos los tipos de TypeScript a partir de los schemas de Zod.
 * Esto es útil para usar con react-hook-form.
 */
export type ProductPurchasedFormData = z.infer<typeof createProductPurchasedSchema>;