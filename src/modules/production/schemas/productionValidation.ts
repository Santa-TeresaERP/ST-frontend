import { z } from 'zod';

export const productionSchema = z.object({
  productId: z.string().uuid('El ID del producto debe ser un UUID válido'),

  quantityProduced: z
    .number()
    .int('La cantidad producida debe ser un número entero')
    .positive('La cantidad producida debe ser positiva'),

  productionDate: z
    .string()
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: 'La fecha de producción debe ser una fecha válida',
    }),

  observation: z
    .string()
    .max(255, 'La observación no debe exceder los 255 caracteres')
    .optional(),

  plant_id: z.string().uuid('El ID de la planta debe ser un UUID válido'),

  createdAt: z.date().optional(),

  updatedAt: z.date().optional(),
});