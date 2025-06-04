import { z } from 'zod';

export const recipeProductResourceSchema = z.object({
  productId: z.string().uuid('El ID del producto debe ser un UUID válido'),
  resourceId: z.string().uuid('El ID del recurso debe ser un UUID válido'),
  quantity: z
    .number()
    .min(0, 'La cantidad debe ser un número positivo')
    .max(1000000, 'La cantidad no debe exceder 1,000,000'),
  unit: z.enum(['g', 'kg', 'ml', 'l', 'unidades'], {
    invalid_type_error: 'La unidad debe ser uno de: g, kg, ml, l, unidades',
  }),
});
