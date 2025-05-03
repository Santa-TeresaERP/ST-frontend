import { z } from 'zod';

export const recipeProductResourceSchema = z.object({
  product_id: z.string().uuid('El ID del producto debe ser un UUID válido'),
  quantity_required: z
    .string()
    .min(1, 'La cantidad requerida no puede estar vacía')
    .max(50, 'La cantidad requerida no debe exceder los 50 caracteres'),

});

export const recipeSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la receta no puede estar vacío')
    .max(100, 'El nombre de la receta no debe exceder los 100 caracteres'),
  description: z
    .string()
    .max(255, 'La descripción no debe exceder los 255 caracteres')
    .optional(),
  products: z.array(recipeProductResourceSchema),
});