import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre del producto no puede estar vacío')
    .max(50, 'El nombre del producto no debe exceder los 50 caracteres'),

  category_id: z.string().uuid('El ID de la categoría debe ser un UUID válido'),

  price: z.number().positive('El precio debe ser un número positivo'),

  description: z
    .string()
    .max(255, 'La descripción no debe exceder los 255 caracteres')
    .optional(),

  imagen_url: z.string().url('La URL de la imagen debe ser válida').optional(),
});

